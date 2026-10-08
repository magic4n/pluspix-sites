import { nanoid } from 'nanoid';
import { db, PageRecord } from './schema';
import { Project, Page, Asset } from '@/project/types';

/**
 * Retrieves all projects sorted by most recently updated first.
 * @returns Array of projects.
 */
export async function getProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

/**
 * Retrieves a single project by its unique ID.
 * @param id Unique project ID.
 * @returns Project if found, undefined otherwise.
 */
export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

/**
 * Creates a new project with a default home page and initial settings.
 * @param params Project creation parameters (name, optional themeId, fontPairId).
 * @returns The newly created project.
 */
export async function createProject(params: {
  name: string;
  themeId?: string;
  fontPairId?: string;
}): Promise<Project> {
  const now = Date.now();
  const projectId = nanoid();
  const homePageId = nanoid();

  const homePage: Page = {
    id: homePageId,
    parentId: null,
    order: 0,
    slug: 'index',
    title: 'Home',
    metaDescription: '',
    puckData: { content: [], root: {} },
    createdAt: now,
    updatedAt: now,
  };

  const project: Project = {
    id: projectId,
    name: params.name.trim() || 'Untitled Project',
    createdAt: now,
    updatedAt: now,
    theme: {
      id: params.themeId || 'minimal-light',
      customOverrides: {},
    },
    fontPairId: params.fontPairId || 'inter-playfair',
    rootPageIds: [homePageId],
    pages: {
      [homePageId]: homePage,
    },
  };

  await db.transaction('rw', db.projects, db.pages, async () => {
    await db.projects.add(project);
    await db.pages.add({ ...homePage, projectId });
  });

  return project;
}

/**
 * Updates an existing project in the database.
 * @param project The project object with updated fields.
 */
export async function updateProject(project: Project): Promise<void> {
  const updatedProject = {
    ...project,
    updatedAt: Date.now(),
  };

  await db.transaction('rw', db.projects, db.pages, async () => {
    await db.projects.put(updatedProject);
    // Sync pages table
    await db.pages.where('projectId').equals(project.id).delete();
    const pageRecords: PageRecord[] = Object.values(updatedProject.pages).map((page) => ({
      ...page,
      projectId: project.id,
    }));
    if (pageRecords.length > 0) {
      await db.pages.bulkAdd(pageRecords);
    }
  });
}

/**
 * Renames an existing project.
 * @param id Unique project ID.
 * @param newName New display name for the project.
 */
export async function renameProject(id: string, newName: string): Promise<void> {
  const project = await db.projects.get(id);
  if (!project) {
    throw new Error(`Project with ID ${id} not found.`);
  }

  const trimmed = newName.trim();
  if (!trimmed) {
    throw new Error('Project name cannot be empty.');
  }

  await db.projects.update(id, {
    name: trimmed,
    updatedAt: Date.now(),
  });
}

/**
 * Duplicates an existing project, including its pages, theme, and assets.
 * @param id Unique project ID to duplicate.
 * @returns The newly duplicated project.
 */
export async function duplicateProject(id: string): Promise<Project> {
  const original = await db.projects.get(id);
  if (!original) {
    throw new Error(`Project with ID ${id} not found.`);
  }

  const originalAssets = await db.assets.where('projectId').equals(id).toArray();
  const now = Date.now();
  const newProjectId = nanoid();

  // Create mapping of old page ID -> new page ID
  const pageIdMap = new Map<string, string>();
  for (const oldPageId of Object.keys(original.pages)) {
    pageIdMap.set(oldPageId, nanoid());
  }

  const duplicatedPages: Record<string, Page> = {};
  for (const [oldId, oldPage] of Object.entries(original.pages)) {
    const newId = pageIdMap.get(oldId) || nanoid();
    const newParentId = oldPage.parentId ? (pageIdMap.get(oldPage.parentId) || null) : null;

    duplicatedPages[newId] = {
      ...oldPage,
      id: newId,
      parentId: newParentId,
      createdAt: now,
      updatedAt: now,
    };
  }

  const newRootPageIds = original.rootPageIds
    .map((oldId) => pageIdMap.get(oldId))
    .filter((id): id is string => Boolean(id));

  const duplicatedProject: Project = {
    ...original,
    id: newProjectId,
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
    pages: duplicatedPages,
    rootPageIds: newRootPageIds,
  };

  const duplicatedAssets: Asset[] = originalAssets.map((asset) => ({
    id: nanoid(),
    projectId: newProjectId,
    filename: asset.filename,
    mime: asset.mime,
    blob: new Blob([asset.blob], { type: asset.mime }),
    createdAt: now,
  }));

  const pageRecords: PageRecord[] = Object.values(duplicatedPages).map((page) => ({
    ...page,
    projectId: newProjectId,
  }));

  await db.transaction('rw', db.projects, db.pages, db.assets, async () => {
    await db.projects.add(duplicatedProject);
    if (pageRecords.length > 0) {
      await db.pages.bulkAdd(pageRecords);
    }
    if (duplicatedAssets.length > 0) {
      await db.assets.bulkAdd(duplicatedAssets);
    }
  });

  return duplicatedProject;
}

/**
 * Permanently deletes a project and all associated pages and assets.
 * @param id Unique project ID.
 */
export async function deleteProject(id: string): Promise<void> {
  await db.transaction('rw', db.projects, db.pages, db.assets, async () => {
    await db.projects.delete(id);
    await db.pages.where('projectId').equals(id).delete();
    await db.assets.where('projectId').equals(id).delete();
  });
}

/**
 * Retrieves all pages for a given project ID.
 * @param projectId Unique project ID.
 * @returns Array of page records.
 */
export async function getPagesByProjectId(projectId: string): Promise<PageRecord[]> {
  return db.pages.where('projectId').equals(projectId).toArray();
}

/**
 * Saves or updates a single page record in the database.
 * @param page Page record to save.
 */
export async function savePage(page: PageRecord): Promise<void> {
  await db.pages.put(page);
}

/**
 * Deletes a single page by its ID.
 * @param id Unique page ID.
 */
export async function deletePage(id: string): Promise<void> {
  await db.pages.delete(id);
}

/**
 * Retrieves all assets belonging to a project.
 * @param projectId Unique project ID.
 * @returns Array of assets.
 */
export async function getAssetsByProjectId(projectId: string): Promise<Asset[]> {
  return db.assets.where('projectId').equals(projectId).toArray();
}

/**
 * Saves a new or updated asset.
 * @param asset Asset object with blob data.
 */
export async function saveAsset(asset: Asset): Promise<void> {
  await db.assets.put(asset);
}

/**
 * Deletes an asset by its ID.
 * @param id Unique asset ID.
 */
export async function deleteAsset(id: string): Promise<void> {
  await db.assets.delete(id);
}

/**
 * Retrieves an application setting value from IndexedDB.
 * @param key Setting identifier.
 * @param defaultValue Fallback value if setting not found.
 * @returns Stored setting value or defaultValue.
 */
export async function getSetting<T>(key: string, defaultValue?: T): Promise<T | undefined> {
  const item = await db.settings.get(key);
  if (!item) return defaultValue;
  return item.value as T;
}

/**
 * Stores an application setting value in IndexedDB.
 * @param key Setting identifier.
 * @param value Setting value to store.
 */
export async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}
