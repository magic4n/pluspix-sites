import { saveAs } from 'file-saver';

/**
 * Triggers the browser download dialog for the generated ZIP blob.
 * @param blob The generated ZIP Blob.
 * @param filename File name (e.g. "My-Site.zip").
 */
export function downloadZip(blob: Blob, filename: string): void {
  const safeName = filename.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'pluspix-site';
  const finalFilename = safeName.endsWith('.zip') ? safeName : `${safeName}.zip`;
  saveAs(blob, finalFilename);
}
