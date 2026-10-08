import { Project, Asset } from '@/project/types';
import { computePagePath } from '@/shared/slug';
import { applyTheme } from '@/site/applyTheme';
import { renderPage } from './renderPage';
import { buildManifestJson } from './manifest';

export interface RenderedFile {
  path: string;
  content: string | Blob;
}

export interface RenderSiteOptions {
  project: Project;
  assets: Asset[];
  onProgress?: (pageTitle: string, index: number, total: number) => void;
}

/**
 * Renders all pages, assets, stylesheets, and manifest into a list of file entries ready for ZIP packaging.
 */
export async function renderSite({
  project,
  assets,
  onProgress,
}: RenderSiteOptions): Promise<RenderedFile[]> {
  const files: RenderedFile[] = [];

  // 1. Asset map and files
  const assetFilenameMap: Record<string, string> = {};
  for (const asset of assets) {
    assetFilenameMap[asset.id] = asset.filename;
    files.push({
      path: `assets/images/${asset.filename}`,
      content: asset.blob,
    });
  }

  // 2. Shared stylesheet: assets/css/styles.css
  const stylesCss = applyTheme(project.theme, project.fontPairId);
  files.push({
    path: 'assets/css/styles.css',
    content: stylesCss,
  });

  // 3. Render each page
  const pagesList = Object.values(project.pages);
  const total = pagesList.length;

  for (let i = 0; i < total; i++) {
    const page = pagesList[i];
    if (onProgress) {
      onProgress(page.title, i + 1, total);
    }

    const html = renderPage({
      project,
      page,
      assetFilenameMap,
    });

    const pagePath = computePagePath(project.pages, page.id);
    files.push({
      path: pagePath,
      content: html,
    });
  }

  // 4. Manifest: .pluspix/manifest.json
  const manifestJson = buildManifestJson(project, assets);
  files.push({
    path: '.pluspix/manifest.json',
    content: manifestJson,
  });

  return files;
}
