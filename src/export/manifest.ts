import { Project, Asset } from '@/project/types';

export interface ManifestAssetItem {
  id: string;
  filename: string;
  mime: string;
}

export interface PlusPixManifest {
  version: number;
  generator: string;
  project: Project;
  assets: ManifestAssetItem[];
}

/**
 * Builds the manifest object and serialized JSON for ZIP export/import.
 * @param project The Project object to export.
 * @param assets Project assets.
 * @returns Serialized JSON string of the manifest.
 */
export function buildManifestJson(project: Project, assets: Asset[]): string {
  const manifestAssets: ManifestAssetItem[] = assets.map((a) => ({
    id: a.id,
    filename: a.filename,
    mime: a.mime,
  }));

  const manifest: PlusPixManifest = {
    version: 1,
    generator: 'pluspix',
    project,
    assets: manifestAssets,
  };

  return JSON.stringify(manifest, null, 2);
}
