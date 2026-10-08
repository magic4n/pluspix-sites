import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Puck } from '@measured/puck';
import '@measured/puck/dist/index.css';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { TopBar } from './TopBar';
import { PageTree } from './PageTree';
import { PageSettingsPanel } from './PageSettingsPanel';
import { SiteThemePanel } from './SiteThemePanel';
import { config } from './puck/config';
import { ProjectContextProvider } from './puck/context';
import { applyTheme, getGoogleFontsHref } from '@/site/applyTheme';

export const EditorScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentProject, activePageId, updatePuckData, closeProject } = useProjectStore();
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
  const [siteThemeOpen, setSiteThemeOpen] = useState(false);

  const activePage = currentProject && activePageId ? currentProject.pages[activePageId] : null;

  // Compute live CSS variables and fonts for the canvas
  const themeCss = useMemo(() => {
    return applyTheme(currentProject?.theme, currentProject?.fontPairId);
  }, [currentProject?.theme, currentProject?.fontPairId]);

  const googleFontsHref = useMemo(() => {
    return getGoogleFontsHref(currentProject?.fontPairId);
  }, [currentProject?.fontPairId]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Live Google Fonts & CSS variables for site theme */}
      <link rel="stylesheet" href={googleFontsHref} />
      <style>{themeCss}</style>

      <TopBar
        screen="editor"
        projectName={currentProject?.name || 'Untitled Project'}
        onNavigateHome={closeProject}
        onOpenPageSettings={() => setPageSettingsOpen(true)}
      />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left column: PageTree */}
        <PageTree
          onOpenPageSettings={() => setPageSettingsOpen(true)}
          onOpenSiteTheme={() => setSiteThemeOpen(true)}
        />

        {/* Center/Right column: Puck visual block editor */}
        <Box
          sx={{
            flexGrow: 1,
            height: 'calc(100vh - 64px)',
            position: 'relative',
            overflow: 'hidden',
            '& ._Puck_': {
              height: '100%',
            },
          }}
        >
          {activePage ? (
            <ProjectContextProvider
              project={currentProject}
              activePageId={activePageId}
            >
              <Puck
                key={activePage.id}
                config={config}
                data={activePage.puckData || { content: [], root: {} }}
                onChange={(data) => {
                  updatePuckData(activePage.id, data);
                }}
              />
            </ProjectContextProvider>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {t('pageTree.noPages')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right Drawer: PageSettingsPanel */}
      <PageSettingsPanel
        open={pageSettingsOpen}
        onClose={() => setPageSettingsOpen(false)}
      />

      {/* Right Drawer: SiteThemePanel */}
      <SiteThemePanel
        open={siteThemeOpen}
        onClose={() => setSiteThemeOpen(false)}
      />
    </Box>
  );
};
