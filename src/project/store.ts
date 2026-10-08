import { create } from 'zustand';
import { Project, Page, PuckData } from './types';
import * as api from '@/db/api';
import * as treeOps from './pageTree';

export type Screen = 'home' | 'editor';

export interface ProjectStoreState {
  currentProject: Project | null;
  activePageId: string | null;
  screen: Screen;
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Screen navigation
  setScreen: (screen: Screen) => void;
  openProject: (project: Project) => void;
  closeProject: () => void;

  // Project CRUD actions
  createProject: (name: string) => Promise<Project>;
  updateCurrentProject: (updates: Partial<Project>) => Promise<void>;
  renameProject: (id: string, name: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;

  // Page selection
  setActivePageId: (pageId: string | null) => void;

  // Puck data updates
  updatePuckData: (pageId: string, data: PuckData) => void;

  // Page Tree operations
  addPage: (params: { title: string; parentId?: string | null }) => string;
  renamePage: (pageId: string, newTitle: string) => void;
  updatePageSettings: (
    pageId: string,
    settings: Partial<Pick<Page, 'slug' | 'title' | 'metaDescription'>>
  ) => void;
  movePage: (pageId: string, newOrder: number) => void;
  nestPage: (pageId: string, newParentId: string | null, targetOrder?: number) => void;
  deletePage: (pageId: string) => void;
  deleteSubtree: (pageId: string) => void;
  promoteChildren: (pageId: string) => void;

  // Autosave
  saveNow: () => Promise<void>;
}

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleAutosave(get: () => ProjectStoreState, set: (partial: Partial<ProjectStoreState>) => void) {
  set({ hasUnsavedChanges: true });
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
  }
  autosaveTimer = setTimeout(async () => {
    await get().saveNow();
  }, 500);
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  currentProject: null,
  activePageId: null,
  screen: 'home',
  isSaving: false,
  hasUnsavedChanges: false,

  setScreen: (screen: Screen) => set({ screen }),

  openProject: (project: Project) => {
    const firstPageId = project.rootPageIds[0] || Object.keys(project.pages)[0] || null;
    set({
      currentProject: project,
      activePageId: firstPageId,
      screen: 'editor',
      hasUnsavedChanges: false,
      isSaving: false,
    });
  },

  closeProject: () => {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
    }
    set({
      currentProject: null,
      activePageId: null,
      screen: 'home',
      hasUnsavedChanges: false,
      isSaving: false,
    });
  },

  createProject: async (name: string) => {
    const newProject = await api.createProject({ name });
    get().openProject(newProject);
    return newProject;
  },

  updateCurrentProject: async (updates: Partial<Project>) => {
    const current = get().currentProject;
    if (!current) return;

    const updated: Project = {
      ...current,
      ...updates,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  renameProject: async (id: string, name: string) => {
    await api.renameProject(id, name);
    const current = get().currentProject;
    if (current && current.id === id) {
      set({ currentProject: { ...current, name, updatedAt: Date.now() } });
    }
  },

  duplicateProject: async (id: string) => {
    return api.duplicateProject(id);
  },

  deleteProject: async (id: string) => {
    await api.deleteProject(id);
    const current = get().currentProject;
    if (current && current.id === id) {
      get().closeProject();
    }
  },

  setActivePageId: (activePageId: string | null) => set({ activePageId }),

  updatePuckData: (pageId: string, data: PuckData) => {
    const current = get().currentProject;
    if (!current) return;

    const targetPage = current.pages[pageId];
    if (!targetPage) return;

    const updatedPages: Record<string, Page> = {
      ...current.pages,
      [pageId]: {
        ...targetPage,
        puckData: data,
        updatedAt: Date.now(),
      },
    };

    const updated: Project = {
      ...current,
      pages: updatedPages,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  addPage: (params) => {
    const current = get().currentProject;
    if (!current) return '';

    const { pages, rootPageIds, newPageId } = treeOps.addPage(
      current.pages,
      current.rootPageIds,
      params
    );

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated, activePageId: newPageId });
    scheduleAutosave(get, set);
    return newPageId;
  },

  renamePage: (pageId, newTitle) => {
    const current = get().currentProject;
    if (!current) return;

    const pages = treeOps.renamePage(current.pages, pageId, newTitle);
    const updated: Project = {
      ...current,
      pages,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  updatePageSettings: (pageId, settings) => {
    const current = get().currentProject;
    if (!current) return;

    const pages = treeOps.updatePageSettings(current.pages, pageId, settings);
    const updated: Project = {
      ...current,
      pages,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  movePage: (pageId, newOrder) => {
    const current = get().currentProject;
    if (!current) return;

    const { pages, rootPageIds } = treeOps.movePage(
      current.pages,
      current.rootPageIds,
      pageId,
      newOrder
    );

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  nestPage: (pageId, newParentId, targetOrder) => {
    const current = get().currentProject;
    if (!current) return;

    const { pages, rootPageIds } = treeOps.nestPage(
      current.pages,
      current.rootPageIds,
      pageId,
      newParentId,
      targetOrder
    );

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated });
    scheduleAutosave(get, set);
  },

  deletePage: (pageId) => {
    const current = get().currentProject;
    if (!current) return;

    const { pages, rootPageIds } = treeOps.deletePage(
      current.pages,
      current.rootPageIds,
      pageId
    );

    let nextActiveId = get().activePageId;
    if (nextActiveId === pageId) {
      nextActiveId = rootPageIds[0] || Object.keys(pages)[0] || null;
    }

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated, activePageId: nextActiveId });
    scheduleAutosave(get, set);
  },

  deleteSubtree: (pageId) => {
    const current = get().currentProject;
    if (!current) return;

    const { pages, rootPageIds } = treeOps.deleteSubtree(
      current.pages,
      current.rootPageIds,
      pageId
    );

    let nextActiveId = get().activePageId;
    if (nextActiveId === pageId || !pages[nextActiveId || '']) {
      nextActiveId = rootPageIds[0] || Object.keys(pages)[0] || null;
    }

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated, activePageId: nextActiveId });
    scheduleAutosave(get, set);
  },

  promoteChildren: (pageId) => {
    const current = get().currentProject;
    if (!current) return;

    const { pages, rootPageIds } = treeOps.promoteChildren(
      current.pages,
      current.rootPageIds,
      pageId
    );

    let nextActiveId = get().activePageId;
    if (nextActiveId === pageId) {
      nextActiveId = rootPageIds[0] || Object.keys(pages)[0] || null;
    }

    const updated: Project = {
      ...current,
      pages,
      rootPageIds,
      updatedAt: Date.now(),
    };

    set({ currentProject: updated, activePageId: nextActiveId });
    scheduleAutosave(get, set);
  },

  saveNow: async () => {
    const current = get().currentProject;
    if (!current) return;

    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
      autosaveTimer = null;
    }

    set({ isSaving: true });
    try {
      await api.updateProject(current);
      set({ hasUnsavedChanges: false });
    } finally {
      set({ isSaving: false });
    }
  },
}));
