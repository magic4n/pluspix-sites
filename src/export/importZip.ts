import JSZip from 'jszip';
import { nanoid } from 'nanoid';
import { Project, Page, Asset } from '@/project/types';
import { db, PageRecord } from '@/db/schema';
import { PlusPixManifest } from './manifest';

export interface ImportResult {
  success: boolean;
  project?: Project;
  error?: string;
}

/**
 * Validates whether the parsed JSON object matches the PlusPixManifest structure.
 */
function isValidManifest(obj: unknown): obj is PlusPixManifest {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Record<string, any>;

  if (typeof candidate.version !== 'number') return false;
  if (!candidate.project || typeof candidate.project !== 'object') return false;

  const proj = candidate.project;
  if (typeof proj.name !== 'string') return false;
  if (!proj.pages || typeof proj.pages !== 'object') return false;
  if (!Array.isArray(proj.rootPageIds)) return false;

  return true;
}

/**
 * Imports a PlusPix project from a ZIP archive file or blob.
 * @param zipFile The ZIP File or Blob uploaded by the user.
 * @returns Result with the imported Project or error message.
 */
export async function importZip(zipFile: Blob | File): Promise<ImportResult> {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    const manifestFile = zip.file('.pluspix/manifest.json');

    const now = Date.now();
    const newProjectId = nanoid();

    if (manifestFile) {
      // --- CASE A: Manifest exists ---
      const manifestText = await manifestFile.async('text');
      let parsedManifest: unknown;
      try {
        parsedManifest = JSON.parse(manifestText);
      } catch {
        return { success: false, error: 'Malformed .pluspix/manifest.json in archive.' };
      }

      if (!isValidManifest(parsedManifest)) {
        return { success: false, error: 'Invalid project manifest schema.' };
      }

      const originalProject = parsedManifest.project;

      // Map page IDs to new IDs to avoid collision
      const pageIdMap = new Map<string, string>();
      for (const oldId of Object.keys(originalProject.pages)) {
        pageIdMap.set(oldId, nanoid());
      }

      const importedPages: Record<string, Page> = {};
      for (const [oldId, oldPage] of Object.entries(originalProject.pages)) {
        const newPageId = pageIdMap.get(oldId) || nanoid();
        const newParentId = oldPage.parentId ? (pageIdMap.get(oldPage.parentId) || null) : null;

        importedPages[newPageId] = {
          ...oldPage,
          id: newPageId,
          parentId: newParentId,
          createdAt: now,
          updatedAt: now,
        };
      }

      const importedRootPageIds = originalProject.rootPageIds
        .map((oldId) => pageIdMap.get(oldId))
        .filter((id): id is string => Boolean(id));

      const importedProject: Project = {
        ...originalProject,
        id: newProjectId,
        name: `${originalProject.name} (Imported)`,
        createdAt: now,
        updatedAt: now,
        pages: importedPages,
        rootPageIds: importedRootPageIds.length > 0 ? importedRootPageIds : Object.keys(importedPages),
      };

      // Extract referenced assets
      const importedAssets: Asset[] = [];
      const manifestAssets = parsedManifest.assets || [];

      for (const assetMeta of manifestAssets) {
        const imagePath = `assets/images/${assetMeta.filename}`;
        const imageFile = zip.file(imagePath);
        if (imageFile) {
          const blob = await imageFile.async('blob');
          importedAssets.push({
            id: nanoid(),
            projectId: newProjectId,
            filename: assetMeta.filename,
            mime: assetMeta.mime || 'image/jpeg',
            blob,
            createdAt: now,
          });
        }
      }

      const pageRecords: PageRecord[] = Object.values(importedPages).map((p) => ({
        ...p,
        projectId: newProjectId,
      }));

      await db.transaction('rw', db.projects, db.pages, db.assets, async () => {
        await db.projects.add(importedProject);
        if (pageRecords.length > 0) {
          await db.pages.bulkAdd(pageRecords);
        }
        if (importedAssets.length > 0) {
          await db.assets.bulkAdd(importedAssets);
        }
      });

      return { success: true, project: importedProject };
    } else {
      // --- CASE B: No manifest -> Unpack HTML/assets as a new "Imported" project ---
      const defaultPageId = nanoid();
      const defaultPage: Page = {
        id: defaultPageId,
        parentId: null,
        order: 0,
        slug: 'index',
        title: 'Home',
        metaDescription: '',
        puckData: { content: [], root: {} },
        createdAt: now,
        updatedAt: now,
      };

      const importedProject: Project = {
        id: newProjectId,
        name: 'Imported Site',
        createdAt: now,
        updatedAt: now,
        theme: { id: 'minimal-light', customOverrides: {} },
        fontPairId: 'inter-playfair',
        rootPageIds: [defaultPageId],
        pages: {
          [defaultPageId]: defaultPage,
        },
      };

      const importedAssets: Asset[] = [];

      // Scan all files in zip
      for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const blob = await zipEntry.async('blob');
          const filename = relativePath.split('/').pop() || 'file';
          importedAssets.push({
            id: nanoid(),
            projectId: newProjectId,
            filename,
            mime: filename.endsWith('.html') ? 'text/html' : filename.endsWith('.css') ? 'text/css' : 'application/octet-stream',
            blob,
            createdAt: now,
          });
        }
      }

      await db.transaction('rw', db.projects, db.pages, db.assets, async () => {
        await db.projects.add(importedProject);
        await db.pages.add({ ...defaultPage, projectId: newProjectId });
        if (importedAssets.length > 0) {
          await db.assets.bulkAdd(importedAssets);
        }
      });

      return { success: true, project: importedProject };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to read ZIP archive. Please verify the file is not corrupted.',
    };
  }
}
