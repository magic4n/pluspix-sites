import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { THEME_LIST } from '@/site/themes';
import { FONT_PAIRS } from '@/site/fonts';

export interface SiteThemePanelProps {
  open: boolean;
  onClose: () => void;
}

export const SiteThemePanel: React.FC<SiteThemePanelProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { currentProject, updateCurrentProject } = useProjectStore();

  if (!currentProject) return null;

  const activeThemeId = currentProject.theme?.id || 'minimal-light';
  const activeFontPairId = currentProject.fontPairId || 'inter-playfair';

  const handleSelectTheme = (themeId: string) => {
    updateCurrentProject({
      theme: {
        id: themeId,
        customOverrides: currentProject.theme?.customOverrides || {},
      },
    });
  };

  const handleSelectFontPair = (fontPairId: string) => {
    updateCurrentProject({
      fontPairId,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: 4,
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('siteTheme.title')}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label={t('common.cancel')}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Color Themes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
          {t('siteTheme.themesSection')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          {THEME_LIST.map((th) => {
            const isSelected = activeThemeId === th.id;
            const bg = th.vars['--ppx-bg'] || '#ffffff';
            const fg = th.vars['--ppx-fg'] || '#000000';
            const accent = th.vars['--ppx-accent'] || '#3b82f6';
            const border = th.vars['--ppx-border'] || '#e5e7eb';

            return (
              <Paper
                key={th.id}
                onClick={() => handleSelectTheme(th.id)}
                elevation={isSelected ? 2 : 0}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'outlineVariant',
                  bgcolor: 'background.default',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Mini theme swatch preview */}
                <Box
                  sx={{
                    height: 52,
                    borderRadius: 2,
                    bgcolor: bg,
                    border: `1px solid ${border}`,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Box sx={{ width: 14, height: 6, borderRadius: 0.5, bgcolor: accent }} />
                    <Box sx={{ width: 30, height: 4, borderRadius: 0.5, bgcolor: fg, opacity: 0.8 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Box sx={{ width: 22, height: 4, borderRadius: 0.5, bgcolor: fg, opacity: 0.4 }} />
                    <Box sx={{ width: 18, height: 4, borderRadius: 0.5, bgcolor: fg, opacity: 0.4 }} />
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    color: isSelected ? 'primary.main' : 'text.primary',
                  }}
                >
                  {th.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* Font Pairing Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
          {t('siteTheme.fontsSection')}
        </Typography>

        <RadioGroup value={activeFontPairId} onChange={(e) => handleSelectFontPair(e.target.value)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {FONT_PAIRS.map((pair) => {
              const isSelected = activeFontPairId === pair.id;

              return (
                <Paper
                  key={pair.id}
                  onClick={() => handleSelectFontPair(pair.id)}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'action.selected' : 'background.paper',
                    '&:hover': { bgcolor: isSelected ? 'action.selected' : 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      value={pair.id}
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                          {pair.name}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      pl: 3.5,
                      fontStyle: 'italic',
                      opacity: 0.85,
                    }}
                  >
                    Heading: {pair.heading} • Body: {pair.body}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </RadioGroup>
      </Box>
    </Drawer>
  );
};
