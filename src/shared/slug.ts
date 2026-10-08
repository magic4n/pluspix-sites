import { Page } from '@/project/types';

/**
 * Validates whether a slug matches [a-z0-9-] format without consecutive hyphens.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  // Allows lowercase alphanumeric and hyphens, no leading/trailing hyphen, no double hyphen
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Converts any string into a URL-friendly slug.
 */
export function slugify(input: string): string {
  if (!input) return '';

  return input
    .toLowerCase()
    .trim()
    // Transliterate Russian / Cyrillic characters to Latin
    .replace(/[а-яё]/g, (char) => {
      const cyrillicMap: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo',
        ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
        н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
        ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
        ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
      };
      return cyrillicMap[char] ?? char;
    })
    // Replace non-alphanumeric chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Strip leading & trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Computes the exported or preview URL path for a given page by walking up its ancestor tree.
 * Root page with slug === 'index' -> index.html
 * Other pages -> {slug}/index.html
 * Nested -> {parent}/{child}/index.html
 */
export function computePagePath(pages: Record<string, Page>, pageId: string): string {
  const page = pages[pageId];
  if (!page) return '';

  // Root index page special case
  if (page.parentId === null && page.slug === 'index') {
    return 'index.html';
  }

  const segments: string[] = [page.slug || 'untitled'];
  let currentParentId = page.parentId;

  while (currentParentId) {
    const parent = pages[currentParentId];
    if (!parent) break;
    // Don't include root 'index' slug as a directory segment
    if (!(parent.parentId === null && parent.slug === 'index')) {
      segments.unshift(parent.slug || 'untitled');
    }
    currentParentId = parent.parentId;
  }

  return `${segments.join('/')}/index.html`;
}
