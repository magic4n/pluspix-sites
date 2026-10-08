import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSeedStore, ThemeMode } from '@/theme/seedStore';
import { useProjectStore } from '@/project/store';
import { openPreviewTab } from '@/preview/previewBuilder';

export interface TopBarProps {
  screen: 'home' | 'editor';
  projectName?: string;
  onNavigateHome?: () => void;
  onOpenPageSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  screen,
  projectName = 'Untitled Project',
  onNavigateHome,
}) => {
  const { t, i18n } = useTranslation();
  const { seedColor, mode, setSeedColor, setMode } = useSeedStore();
  const {
    currentProject,
    activePageId,
    renameProject,
    isSaving,
    hasUnsavedChanges,
    saveNow,
  } = useProjectStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  const [previewAnchor, setPreviewAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setEditedName(projectName);
  }, [projectName]);

  const handleLanguageChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLang: string | null
  ) => {
    if (newLang) {
      i18n.changeLanguage(newLang);
    }
  };

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ThemeMode | null
  ) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  const handleFinishNameEdit = () => {
    setIsEditingName(false);
    const trimmed = editedName.trim();
    if (trimmed && currentProject && trimmed !== currentProject.name) {
      renameProject(currentProject.id, trimmed);
    } else {
      setEditedName(projectName);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishNameEdit();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(projectName);
    }
  };

  const handlePreviewThisPage = async () => {
    setPreviewAnchor(null);
    if (!currentProject) return;
    const activePage = activePageId ? currentProject.pages[activePageId] : Object.values(currentProject.pages)[0];
    if (activePage) {
      await openPreviewTab(currentProject, activePage);
    }
  };

  const handlePreviewWholeSite = async () => {
    setPreviewAnchor(null);
    if (!currentProject) return;
    await openPreviewTab(currentProject, 'all');
  };

  const currentLang = i18n.language && i18n.language.startsWith('ru') ? 'ru' : 'en';

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ gap: 1.5, minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Logo & Brand */}
        <Box
          onClick={screen === 'editor' ? onNavigateHome : undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            cursor: screen === 'editor' ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              dashboard_customize
            </span>
          </Box>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
            {t('app.title')}
          </Typography>
        </Box>

        {/* Editor Screen Info & Actions */}
        {screen === 'editor' && (
          <>
            {/* Inline Project Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              {isEditingName ? (
                <TextField
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleFinishNameEdit}
                  onKeyDown={handleNameKeyDown}
                  size="small"
                  autoFocus
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      py: 0.5,
                      px: 1,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="subtitle1"
                  onDoubleClick={() => setIsEditingName(true)}
                  title={t('home.card.doubleClickToRename')}
                  sx={{
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  {projectName}
                </Typography>
              )}
            </Box>

            {/* Editor Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Button
                variant={hasUnsavedChanges ? 'contained' : 'text'}
                size="small"
                onClick={() => saveNow()}
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <span className="material-symbols-outlined">save</span>
                  )
                }
              >
                {isSaving ? t('common.saving') : t('topbar.save')}
              </Button>

              {/* Preview Button with Dropdown Menu */}
              <Button
                variant="text"
                size="small"
                onClick={(e) => setPreviewAnchor(e.currentTarget)}
                startIcon={<span className="material-symbols-outlined">visibility</span>}
                endIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_drop_down</span>}
              >
                {t('topbar.preview')}
              </Button>

              <Menu
                anchorEl={previewAnchor}
                open={Boolean(previewAnchor)}
                onClose={() => setPreviewAnchor(null)}
                slotProps={{
                  paper: { sx: { borderRadius: 3, minWidth: 220, mt: 0.5 } },
                }}
              >
                <MenuItem onClick={handlePreviewThisPage}>
                  <ListItemIcon>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      description
                    </span>
                  </ListItemIcon>
                  <ListItemText>{t('preview.thisPage')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handlePreviewWholeSite}>
                  <ListItemIcon>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      public
                    </span>
                  </ListItemIcon>
                  <ListItemText>{t('preview.wholeSite')}</ListItemText>
                </MenuItem>
              </Menu>

              <Button
                variant="outlined"
                size="small"
                onClick={() => alert(t('export.stubNotice'))}
                startIcon={<span className="material-symbols-outlined">download</span>}
              >
                {t('topbar.export')}
              </Button>
            </Box>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Seed Color Picker */}
        <Tooltip title={t('topbar.seedColor')}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              p: 0.5,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              component="input"
              type="color"
              value={seedColor}
              onChange={(e) => setSeedColor(e.target.value)}
              aria-label={t('topbar.seedColor')}
              sx={{
                width: 28,
                height: 28,
                p: 0,
                m: 0,
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                '&::-webkit-color-swatch-wrapper': { p: 0 },
                '&::-webkit-color-swatch': { border: 'none', borderRadius: '50%' },
                '&::-moz-color-swatch': { border: 'none', borderRadius: '50%' },
              }}
            />
          </Box>
        </Tooltip>

        {/* Theme Mode Toggle (Auto / Light / Dark) */}
        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label={t('topbar.themeMode')}
          sx={{ height: 36 }}
        >
          <ToggleButton value="auto" aria-label={t('topbar.modeAuto')}>
            <Tooltip title={t('topbar.modeAuto')}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                brightness_auto
              </span>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="light" aria-label={t('topbar.modeLight')}>
            <Tooltip title={t('topbar.modeLight')}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                light_mode
              </span>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="dark" aria-label={t('topbar.modeDark')}>
            <Tooltip title={t('topbar.modeDark')}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                dark_mode
              </span>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Language Toggle (EN / RU) */}
        <ToggleButtonGroup
          size="small"
          value={currentLang}
          exclusive
          onChange={handleLanguageChange}
          aria-label={t('topbar.language')}
          sx={{ height: 36 }}
        >
          <ToggleButton value="en" sx={{ px: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
            EN
          </ToggleButton>
          <ToggleButton value="ru" sx={{ px: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
            RU
          </ToggleButton>
        </ToggleButtonGroup>

        {screen === 'editor' && (
          <Tooltip title={t('topbar.backToHome')}>
            <IconButton onClick={onNavigateHome} size="small" sx={{ ml: 0.5 }}>
              <span className="material-symbols-outlined">close</span>
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
};
