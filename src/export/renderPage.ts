import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@measured/puck';
import { Project, Page } from '@/project/types';
import { config } from '@/editor/puck/config';
import { ProjectContextProvider } from '@/editor/puck/context';
import { computePagePath } from '@/shared/slug';
import { getGoogleFontsHref } from '@/site/applyTheme';

/**
 * Computes the relative link from one exported page file to another exported page file.
 */
export function computeRelativePageUrl(
  pages: Record<string, Page>,
  fromPageId: string,
  toPageId: string
): string {
  if (fromPageId === toPageId) return '#';
  const fromPath = computePagePath(pages, fromPageId);
  const toPath = computePagePath(pages, toPageId);

  const fromSegments = fromPath.split('/');
  fromSegments.pop(); // remove 'index.html'
  const depth = fromSegments.length;

  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  return `${prefix}${toPath}`;
}

/**
 * Computes the relative prefix to reach the site root from a given page's export path.
 * e.g. index.html -> ""
 *      about/index.html -> "../"
 *      team/lead/index.html -> "../../"
 */
export function getRootRelativePrefix(pages: Record<string, Page>, pageId: string): string {
  const pagePath = computePagePath(pages, pageId);
  const segments = pagePath.split('/');
  segments.pop(); // remove index.html
  return segments.length === 0 ? '' : '../'.repeat(segments.length);
}

export interface RenderPageOptions {
  project: Project;
  page: Page;
  assetFilenameMap: Record<string, string>; // assetId -> filename or relative path
}

/**
 * Renders a single Page into a self-contained offline-ready static HTML document.
 */
export function renderPage({
  project,
  page,
  assetFilenameMap,
}: RenderPageOptions): string {
  const rootPrefix = getRootRelativePrefix(project.pages, page.id);
  const googleFontsHref = getGoogleFontsHref(project.fontPairId);

  // Render React block tree
  const element = React.createElement(
    ProjectContextProvider,
    { project, activePageId: page.id },
    React.createElement(Render, {
      config,
      data: page.puckData || { content: [], root: {} },
    })
  );

  let markup = renderToStaticMarkup(element);

  // 1. Rewrite internal page links: page:ID -> relative path
  markup = markup.replace(/href=["']page:([^"']+)["']/g, (_match, targetId) => {
    if (project.pages[targetId]) {
      const rel = computeRelativePageUrl(project.pages, page.id, targetId);
      return `href="${rel}"`;
    }
    return `href="#"`;
  });

  // 2. Rewrite root-relative links like href="/slug" or href="/" from Navbar
  markup = markup.replace(/href=["']\/([^"']*)["']/g, (_match, pathSegment) => {
    // If empty slug or index -> home page
    const cleanSegment = pathSegment.replace(/^\/|\/$/g, '');
    let targetPage: Page | undefined;

    if (!cleanSegment || cleanSegment === 'index') {
      targetPage = Object.values(project.pages).find(
        (p) => p.parentId === null && p.slug === 'index'
      ) || project.pages[project.rootPageIds[0]];
    } else {
      targetPage = Object.values(project.pages).find(
        (p) => p.slug === cleanSegment
      );
    }

    if (targetPage) {
      const rel = computeRelativePageUrl(project.pages, page.id, targetPage.id);
      return `href="${rel}"`;
    }
    return `href="${rootPrefix}${cleanSegment ? `${cleanSegment}/index.html` : 'index.html'}"`;
  });

  // 3. Rewrite asset references: asset:ID or blob: -> assets/images/{filename}
  for (const [id, filename] of Object.entries(assetFilenameMap)) {
    const relativeAssetPath = `${rootPrefix}assets/images/${filename}`;
    markup = markup.replace(new RegExp(`asset:${id}`, 'g'), relativeAssetPath);
  }

  // Also replace any blob: URLs that may have been temporarily used in the editor
  markup = markup.replace(/src=["']blob:[^"']+["']/g, (match) => {
    // If an asset can be mapped, use first or leave safe placeholder
    const firstFilename = Object.values(assetFilenameMap)[0];
    if (firstFilename) {
      return `src="${rootPrefix}assets/images/${firstFilename}"`;
    }
    return match;
  });

  const pageTitle = page.title || project.name;
  const metaDesc = page.metaDescription || '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pageTitle}</title>
    ${metaDesc ? `<meta name="description" content="${metaDesc}" />` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${googleFontsHref}" />
    <link rel="stylesheet" href="${rootPrefix}assets/css/styles.css" />
  </head>
  <body>
    ${markup}
  </body>
</html>`;
}
