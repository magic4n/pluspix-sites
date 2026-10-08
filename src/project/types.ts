import { Data as PuckData } from '@measured/puck';

export type { PuckData };

export interface SiteTheme {
  id: string;
  customOverrides?: Record<string, string>;
}

export interface Page {
  id: string;
  parentId: string | null;
  order: number;
  slug: string;
  title: string;
  metaDescription?: string;
  puckData: PuckData;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  theme: SiteTheme;
  pages: Record<string, Page>;
  rootPageIds: string[];
  fontPairId: string;
}

export interface Asset {
  id: string;
  projectId: string;
  filename: string;
  mime: string;
  blob: Blob;
  createdAt: number;
}

export interface SettingItem {
  key: string;
  value: unknown;
}
