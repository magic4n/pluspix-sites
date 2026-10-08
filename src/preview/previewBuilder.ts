import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@measured/puck';
import { Project, Page } from '@/project/types';
import { config } from '@/editor/puck/config';
import { ProjectContextProvider } from '@/editor/puck/context';
import { applyTheme, getGoogleFontsHref } from '@/site/applyTheme';
import { db } from '@/db/schema';

/**
 * Converts a Blob to base64 data URL.
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Builds preview HTML for a single page or the whole site.
 * @param project The current project.
 * @param target A specific Page or 'all'.
 * @returns Complete standalone HTML string.
 */
export async function buildPreviewHtml(
  project: Project,
  target: Page | 'all'
): Promise<string> {
  // Fetch project assets from IndexedDB
  const assets = await db.assets.where('projectId').equals(project.id).toArray();
  const assetUrlMap: Record<string, string> = {};

  for (const asset of assets) {
    if (asset.blob.size < 50 * 1024) {
      // Under 50 KB -> inline base64
      try {
        assetUrlMap[asset.id] = await blobToBase64(asset.blob);
      } catch {
        assetUrlMap[asset.id] = URL.createObjectURL(asset.blob);
      }
    } else {
      // Large -> object URL
      assetUrlMap[asset.id] = URL.createObjectURL(asset.blob);
    }
  }

  const themeCss = applyTheme(project.theme, project.fontPairId);
  const googleFontsHref = getGoogleFontsHref(project.fontPairId);

  // Map slugs to page IDs for link resolution
  const slugToIdMap: Record<string, string> = {};
  for (const page of Object.values(project.pages)) {
    slugToIdMap[page.slug] = page.id;
    if (page.slug === 'index' && page.parentId === null) {
      slugToIdMap[''] = page.id;
    }
  }

  // Render pages
  const pagesToRender: Page[] =
    target === 'all'
      ? Object.values(project.pages)
      : [target];

  const firstPage = pagesToRender[0] || Object.values(project.pages)[0];
  const initialPageId = firstPage ? firstPage.id : '';

  const pagesHtml = pagesToRender
    .map((page) => {
      const isInitial = page.id === initialPageId;
      const element = React.createElement(
        ProjectContextProvider,
        { project, activePageId: page.id },
        React.createElement(Render, {
          config,
          data: page.puckData || { content: [], root: {} },
        })
      );

      let markup = renderToStaticMarkup(element);

      // Rewrite page internal link formats: page:ID -> ?page=ID
      markup = markup.replace(/href=["']page:([^"']+)["']/g, 'href="?page=$1"');

      // Rewrite asset references if any
      for (const [id, url] of Object.entries(assetUrlMap)) {
        markup = markup.replace(new RegExp(`asset:${id}`, 'g'), url);
      }

      return `
        <div id="page-${page.id}" class="preview-page" style="${isInitial ? 'display: block;' : 'display: none;'}">
          ${markup}
        </div>
      `;
    })
    .join('\n');

  const pageTitle = target === 'all' ? project.name : target.title || project.name;
  const pageMetaDesc = target === 'all' ? '' : target.metaDescription || '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageTitle}</title>
    ${pageMetaDesc ? `<meta name="description" content="${pageMetaDesc}" />` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${googleFontsHref}" />
    <style>
      ${themeCss}
    </style>
  </head>
  <body>
    ${pagesHtml}

    <script>
      (function() {
        var slugToId = ${JSON.stringify(slugToIdMap)};
        var initialId = ${JSON.stringify(initialPageId)};

        function showPage(pageId) {
          var all = document.querySelectorAll('.preview-page');
          for (var i = 0; i < all.length; i++) {
            all[i].style.display = 'none';
          }
          var targetEl = document.getElementById('page-' + pageId);
          if (targetEl) {
            targetEl.style.display = 'block';
            window.scrollTo(0, 0);
          }
        }

        function handleRouting() {
          var params = new URLSearchParams(window.location.search);
          var pageId = params.get('page') || initialId;
          showPage(pageId);
        }

        window.addEventListener('popstate', handleRouting);
        window.addEventListener('hashchange', handleRouting);

        document.addEventListener('click', function(e) {
          var a = e.target.closest('a');
          if (!a) return;
          var href = a.getAttribute('href');
          if (!href) return;

          if (href.indexOf('?page=') === 0) {
            e.preventDefault();
            var targetId = href.replace('?page=', '');
            window.history.pushState(null, '', '?page=' + targetId);
            showPage(targetId);
          } else if (href.indexOf('/') === 0 && !href.indexOf('//') === 0) {
            var slug = href.replace(/^\\//, '');
            var resolvedId = slugToId[slug] || slugToId[''];
            if (resolvedId && document.getElementById('page-' + resolvedId)) {
              e.preventDefault();
              window.history.pushState(null, '', '?page=' + resolvedId);
              showPage(resolvedId);
            }
          }
        });

        handleRouting();
      })();
    </script>
  </body>
</html>`;
}

/**
 * Opens a preview in a new browser tab as a blob: URL.
 */
export async function openPreviewTab(project: Project, target: Page | 'all'): Promise<void> {
  const html = await buildPreviewHtml(project, target);
  const blob = new Blob([html], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
}
