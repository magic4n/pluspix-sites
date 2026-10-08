import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { Puck } from '@measured/puck';
import '@measured/puck/dist/index.css';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { TopBar } from './TopBar';
import { PageTree } from './PageTree';
import { PageSettingsPanel } from './PageSettingsPanel';
import { SiteThemePanel } from './SiteThemePanel';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';
import { getPuckConfig } from './puck/config';
import { ProjectContextProvider } from './puck/context';
import { applyTheme, getGoogleFontsHref } from '@/site/applyTheme';
import { openPreviewTab } from '@/preview/previewBuilder';

export const EditorScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentProject, activePageId, updatePuckData, closeProject, saveNow } = useProjectStore();
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
  const [siteThemeOpen, setSiteThemeOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const activePage = currentProject && activePageId ? currentProject.pages[activePageId] : null;

  // Localized Puck config reacting to language switch
  const puckConfig = useMemo(() => getPuckConfig(t), [t, i18n.language]);

  const showToast = useCallback((message: string, severity: 'success' | 'info' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox');

      // Ctrl+S / Cmd+S: Save project
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
        showToast(t('notifications.projectSaved', 'Project saved successfully'));
        return;
      }

      // Ctrl+Shift+P / Cmd+Shift+P: Preview whole site
      if (mod && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (currentProject) {
          openPreviewTab(currentProject, 'all');
        }
        return;
      }

      // Ctrl+P / Cmd+P: Preview current page
      if (mod && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (currentProject && activePage) {
          openPreviewTab(currentProject, activePage);
        }
        return;
      }

      // Shortcuts modal: '?' (when outside inputs) or 'F1' or Ctrl+/
      if ((e.key === '?' && !isInput) || e.key === 'F1' || (mod && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject, activePage, saveNow, showToast, t]);

  // Translate Puck's hardcoded internal shell UI strings reactively
  useEffect(() => {
    const isRu = i18n.language?.startsWith('ru');

    const updatePuckText = () => {
      // 1. Sidebar section titles
      const headings = document.querySelectorAll(
        '._SidebarSection-heading_8boj8_82 h2, [class*="SidebarSection-heading"] h2'
      );
      headings.forEach((h) => {
        const text = h.textContent?.trim();
        if (isRu) {
          if (text === 'Components') h.textContent = t('puck.ui.components', 'Компоненты');
          else if (text === 'Outline') h.textContent = t('puck.ui.outline', 'Структура страницы');
          else if (text === 'Page') h.textContent = t('puck.ui.page', 'Страница');
        } else {
          if (text === 'Компоненты') h.textContent = 'Components';
          else if (text === 'Структура страницы') h.textContent = 'Outline';
          else if (text === 'Страница') h.textContent = 'Page';
        }
      });

      // 2. Action bar buttons tooltips
      const actionButtons = document.querySelectorAll<HTMLButtonElement>(
        'button[class*="ActionBar-action"], button[title="Duplicate"], button[title="Delete"], button[title="Select parent"], button[title="Дублировать"], button[title="Удалить"], button[title="Выбрать родителя"]'
      );
      actionButtons.forEach((btn) => {
        const title = btn.getAttribute('title');
        if (isRu) {
          if (title === 'Duplicate') btn.setAttribute('title', t('puck.ui.duplicate', 'Дублировать'));
          else if (title === 'Delete') btn.setAttribute('title', t('puck.ui.delete', 'Удалить'));
          else if (title === 'Select parent') btn.setAttribute('title', t('puck.ui.selectParent', 'Выбрать родителя'));
        } else {
          if (title === 'Дублировать') btn.setAttribute('title', 'Duplicate');
          else if (title === 'Удалить') btn.setAttribute('title', 'Delete');
          else if (title === 'Выбрать родителя') btn.setAttribute('title', 'Select parent');
        }
      });
    };

    updatePuckText();
    const observer = new MutationObserver(updatePuckText);
    const container = document.querySelector('._Puck_') || document.body;
    observer.observe(container, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [i18n.language, t]);

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
        onOpenShortcuts={() => setShortcutsOpen(true)}
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
                key={`${activePage.id}-${i18n.language}`}
                config={puckConfig}
                data={activePage.puckData || { content: [], root: {} }}
                onChange={(data) => {
                  updatePuckData(activePage.id, data);
                }}
                headerTitle={activePage.title}
                renderHeaderActions={() => <></>}
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

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity || 'success'}
          sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
