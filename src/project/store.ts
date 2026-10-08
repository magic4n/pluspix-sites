import { create } from 'zustand';
import { Project } from './types';
import * as api from '@/db/api';

export type Screen = 'home' | 'editor';

export interface ProjectStoreState {
  currentProject: Project | null;
  activePageId: string | null;
  screen: Screen;

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
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  currentProject: null,
  activePageId: null,
  screen: 'home',

  setScreen: (screen: Screen) => set({ screen }),

  openProject: (project: Project) => {
    const firstPageId = project.rootPageIds[0] || Object.keys(project.pages)[0] || null;
    set({
      currentProject: project,
      activePageId: firstPageId,
      screen: 'editor',
    });
  },

  closeProject: () => {
    set({
      currentProject: null,
      activePageId: null,
      screen: 'home',
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
    await api.updateProject(updated);
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
}));
