import JSZip from 'jszip';
import { RenderedFile } from './renderSite';

/**
 * Packages all rendered files into a zip archive blob.
 * @param files Array of files with relative paths and contents.
 * @returns Compressed ZIP Blob.
 */
export async function buildZip(files: RenderedFile[]): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
