import Dexie, { Table } from 'dexie';
import { Project, Page, Asset, SettingItem } from '@/project/types';

export interface PageRecord extends Page {
  projectId: string;
}

export class PlusPixDB extends Dexie {
  projects!: Table<Project, string>;
  pages!: Table<PageRecord, string>;
  assets!: Table<Asset, string>;
  settings!: Table<SettingItem, string>;

  constructor() {
    super('PlusPixDB');
    this.version(1).stores({
      projects: 'id, updatedAt',
      pages: 'id, projectId',
      assets: 'id, projectId',
      settings: 'key',
    });
  }
}

export const db = new PlusPixDB();
