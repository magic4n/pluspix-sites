import { nanoid } from 'nanoid';
import { Page } from './types';
import { slugify } from '@/shared/slug';

/**
 * Returns direct children of a given parent ID, sorted by order ascending.
 */
export function getChildren(pages: Record<string, Page>, parentId: string | null): Page[] {
  return Object.values(pages)
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns all descendant page IDs of a given page recursively.
 */
export function getDescendantIds(pages: Record<string, Page>, pageId: string): string[] {
  const result: string[] = [];
  const queue = [pageId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    for (const page of Object.values(pages)) {
      if (page.parentId === currentId) {
        result.push(page.id);
        queue.push(page.id);
      }
    }
  }

  return result;
}

/**
 * Checks whether candidateChildId is a descendant of ancestorId.
 */
export function isDescendant(
  pages: Record<string, Page>,
  ancestorId: string,
  candidateChildId: string
): boolean {
  if (ancestorId === candidateChildId) return true;
  let currentParentId = pages[candidateChildId]?.parentId;
  while (currentParentId) {
    if (currentParentId === ancestorId) return true;
    currentParentId = pages[currentParentId]?.parentId;
  }
  return false;
}

/**
 * Ensures slug uniqueness among siblings.
 */
function ensureUniqueSlug(pages: Record<string, Page>, parentId: string | null, baseSlug: string, excludeId?: string): string {
  const siblings = getChildren(pages, parentId).filter((p) => p.id !== excludeId);
  const existingSlugs = new Set(siblings.map((p) => p.slug));

  let candidate = baseSlug || 'page';
  let counter = 1;
  while (existingSlugs.has(candidate)) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
  return candidate;
}

/**
 * Adds a new page to the tree.
 */
export function addPage(
  pages: Record<string, Page>,
  rootPageIds: string[],
  params: {
    title: string;
    slug?: string;
    parentId?: string | null;
  }
): { pages: Record<string, Page>; rootPageIds: string[]; newPageId: string } {
  const newPageId = nanoid();
  const parentId = params.parentId ?? null;
  const siblings = getChildren(pages, parentId);
  const now = Date.now();

  const rawSlug = params.slug ? slugify(params.slug) : slugify(params.title);
  const uniqueSlug = ensureUniqueSlug(pages, parentId, rawSlug || 'page');

  const newPage: Page = {
    id: newPageId,
    parentId,
    order: siblings.length,
    slug: uniqueSlug,
    title: params.title.trim() || 'Untitled Page',
    metaDescription: '',
    puckData: { content: [], root: {} },
    createdAt: now,
    updatedAt: now,
  };

  const nextPages = { ...pages, [newPageId]: newPage };
  const nextRootPageIds = parentId === null ? [...rootPageIds, newPageId] : [...rootPageIds];

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
    newPageId,
  };
}

/**
 * Renames a page.
 */
export function renamePage(
  pages: Record<string, Page>,
  pageId: string,
  newTitle: string
): Record<string, Page> {
  const target = pages[pageId];
  if (!target) return pages;

  return {
    ...pages,
    [pageId]: {
      ...target,
      title: newTitle.trim() || target.title,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Updates page settings (slug, title, metaDescription).
 */
export function updatePageSettings(
  pages: Record<string, Page>,
  pageId: string,
  settings: Partial<Pick<Page, 'slug' | 'title' | 'metaDescription'>>
): Record<string, Page> {
  const target = pages[pageId];
  if (!target) return pages;

  let newSlug = target.slug;
  if (settings.slug !== undefined) {
    const sanitized = slugify(settings.slug);
    newSlug = ensureUniqueSlug(pages, target.parentId, sanitized || 'page', pageId);
  }

  return {
    ...pages,
    [pageId]: {
      ...target,
      title: settings.title !== undefined ? settings.title.trim() : target.title,
      slug: newSlug,
      metaDescription: settings.metaDescription !== undefined ? settings.metaDescription : target.metaDescription,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Moves a page to a new order index among its current siblings.
 */
export function movePage(
  pages: Record<string, Page>,
  rootPageIds: string[],
  pageId: string,
  newOrder: number
): { pages: Record<string, Page>; rootPageIds: string[] } {
  const target = pages[pageId];
  if (!target) return { pages, rootPageIds };

  const siblings = getChildren(pages, target.parentId);
  const currentIndex = siblings.findIndex((s) => s.id === pageId);
  if (currentIndex === -1 || currentIndex === newOrder) return { pages, rootPageIds };

  // Reorder siblings array
  const reordered = [...siblings];
  const [removed] = reordered.splice(currentIndex, 1);
  const targetIndex = Math.max(0, Math.min(newOrder, reordered.length));
  reordered.splice(targetIndex, 0, removed);

  const nextPages = { ...pages };
  reordered.forEach((p, idx) => {
    nextPages[p.id] = { ...nextPages[p.id], order: idx };
  });

  let nextRootPageIds = rootPageIds;
  if (target.parentId === null) {
    nextRootPageIds = reordered.map((p) => p.id);
  }

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
  };
}

/**
 * Nests a page under a new parent or moves it to the root level.
 */
export function nestPage(
  pages: Record<string, Page>,
  rootPageIds: string[],
  pageId: string,
  newParentId: string | null,
  targetOrder?: number
): { pages: Record<string, Page>; rootPageIds: string[] } {
  const target = pages[pageId];
  if (!target) return { pages, rootPageIds };

  // Cannot nest into itself or any descendant
  if (newParentId !== null && isDescendant(pages, pageId, newParentId)) {
    return { pages, rootPageIds };
  }

  const oldParentId = target.parentId;
  const oldSiblings = getChildren(pages, oldParentId).filter((p) => p.id !== pageId);

  const nextPages = { ...pages };

  // Re-index old siblings
  oldSiblings.forEach((p, idx) => {
    nextPages[p.id] = { ...nextPages[p.id], order: idx };
  });

  // Calculate new siblings
  const newSiblings = getChildren(nextPages, newParentId);
  const insertIndex = targetOrder !== undefined
    ? Math.max(0, Math.min(targetOrder, newSiblings.length))
    : newSiblings.length;

  newSiblings.splice(insertIndex, 0, {
    ...target,
    parentId: newParentId,
    order: insertIndex,
  });

  // Re-index new siblings
  newSiblings.forEach((p, idx) => {
    nextPages[p.id] = {
      ...nextPages[p.id],
      parentId: newParentId,
      order: idx,
      updatedAt: p.id === pageId ? Date.now() : nextPages[p.id].updatedAt,
    };
  });

  // Update rootPageIds
  let nextRootPageIds = rootPageIds.filter((id) => id !== pageId);
  if (newParentId === null) {
    nextRootPageIds.splice(insertIndex, 0, pageId);
  }

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
  };
}

/**
 * Deletes a single page without children.
 */
export function deletePage(
  pages: Record<string, Page>,
  rootPageIds: string[],
  pageId: string
): { pages: Record<string, Page>; rootPageIds: string[] } {
  const target = pages[pageId];
  if (!target) return { pages, rootPageIds };

  const nextPages = { ...pages };
  delete nextPages[pageId];

  // Re-index siblings
  const siblings = getChildren(nextPages, target.parentId);
  siblings.forEach((p, idx) => {
    nextPages[p.id] = { ...nextPages[p.id], order: idx };
  });

  const nextRootPageIds = rootPageIds.filter((id) => id !== pageId);

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
  };
}

/**
 * Deletes a page and all its descendants.
 */
export function deleteSubtree(
  pages: Record<string, Page>,
  rootPageIds: string[],
  pageId: string
): { pages: Record<string, Page>; rootPageIds: string[] } {
  const target = pages[pageId];
  if (!target) return { pages, rootPageIds };

  const idsToDelete = new Set([pageId, ...getDescendantIds(pages, pageId)]);

  const nextPages = { ...pages };
  for (const id of idsToDelete) {
    delete nextPages[id];
  }

  // Re-index siblings of deleted root
  const siblings = getChildren(nextPages, target.parentId);
  siblings.forEach((p, idx) => {
    nextPages[p.id] = { ...nextPages[p.id], order: idx };
  });

  const nextRootPageIds = rootPageIds.filter((id) => !idsToDelete.has(id));

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
  };
}

/**
 * Promotes direct children of a deleted page to the deleted page's position in the hierarchy.
 */
export function promoteChildren(
  pages: Record<string, Page>,
  rootPageIds: string[],
  pageId: string
): { pages: Record<string, Page>; rootPageIds: string[] } {
  const target = pages[pageId];
  if (!target) return { pages, rootPageIds };

  const directChildren = getChildren(pages, pageId);
  const parentId = target.parentId;
  const siblings = getChildren(pages, parentId);

  const targetIndex = siblings.findIndex((p) => p.id === pageId);
  const nextPages = { ...pages };
  delete nextPages[pageId];

  // Replace target with directChildren in siblings list
  const reorderedSiblings = [...siblings.filter((p) => p.id !== pageId)];
  const insertAt = targetIndex === -1 ? reorderedSiblings.length : targetIndex;

  reorderedSiblings.splice(
    insertAt,
    0,
    ...directChildren.map((child) => ({
      ...child,
      parentId,
    }))
  );

  // Re-index orders
  reorderedSiblings.forEach((p, idx) => {
    nextPages[p.id] = {
      ...nextPages[p.id],
      parentId,
      order: idx,
      updatedAt: Date.now(),
    };
  });

  let nextRootPageIds = rootPageIds.filter((id) => id !== pageId);
  if (parentId === null) {
    nextRootPageIds.splice(insertAt, 0, ...directChildren.map((c) => c.id));
  }

  return {
    pages: nextPages,
    rootPageIds: nextRootPageIds,
  };
}
