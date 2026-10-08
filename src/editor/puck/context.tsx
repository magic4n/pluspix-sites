import React, { createContext, useContext } from 'react';
import { Project, Page } from '@/project/types';

export interface ProjectContextValue {
  project: Project | null;
  pages: Record<string, Page>;
  rootPages: Page[];
  activePageId: string | null;
}

export const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  pages: {},
  rootPages: [],
  activePageId: null,
});

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider: React.FC<{
  project: Project | null;
  activePageId: string | null;
  children: React.ReactNode;
}> = ({ project, activePageId, children }) => {
  const pages = project?.pages || {};
  const rootPageIds = project?.rootPageIds || [];
  const rootPages = rootPageIds.map((id) => pages[id]).filter((p): p is Page => Boolean(p));

  return (
    <ProjectContext.Provider value={{ project, pages, rootPages, activePageId }}>
      {children}
    </ProjectContext.Provider>
  );
};
