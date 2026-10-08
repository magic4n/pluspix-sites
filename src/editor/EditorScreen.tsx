import React, { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { TopBar } from './TopBar';
import { PageTree } from './PageTree';
import { PageSettingsPanel } from './PageSettingsPanel';

export const EditorScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentProject, activePageId, closeProject } = useProjectStore();
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);

  const activePage = currentProject && activePageId ? currentProject.pages[activePageId] : null;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }}>
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
          onOpenSiteTheme={() => alert('Site theme panel will be available in milestone M5.')}
        />

        {/* Center column: Editor canvas placeholder (Puck in M4) */}
        <Box
          sx={{
            flexGrow: 1,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {activePage ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                maxWidth: 640,
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                  auto_fix_high
                </span>
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {activePage.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip
                  label={`slug: /${activePage.slug}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace' }}
                />
                <Chip
                  label={`id: ${activePage.id}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace' }}
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 440 }}>
                {t('editor.placeholder.desc')}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {t('pageTree.noPages')}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side: PageSettingsPanel Drawer */}
      <PageSettingsPanel
        open={pageSettingsOpen}
        onClose={() => setPageSettingsOpen(false)}
      />
    </Box>
  );
};
