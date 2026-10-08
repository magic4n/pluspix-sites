import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { computePagePath, isValidSlug, slugify } from '@/shared/slug';

export interface PageSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const PageSettingsPanel: React.FC<PageSettingsPanelProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { currentProject, activePageId, updatePageSettings } = useProjectStore();

  const activePage = currentProject && activePageId ? currentProject.pages[activePageId] : null;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (activePage) {
      setTitle(activePage.title);
      setSlug(activePage.slug);
      setMetaDescription(activePage.metaDescription || '');
      setSlugError(null);
    }
  }, [activePage?.id, activePage?.title, activePage?.slug, activePage?.metaDescription]);

  if (!currentProject || !activePageId || !activePage) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    updatePageSettings(activePageId, { title: val });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Lowercase and remove invalid characters
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(sanitized);

    if (sanitized && !isValidSlug(sanitized)) {
      setSlugError(t('pageSettings.slugInvalid'));
    } else {
      setSlugError(null);
    }

    if (sanitized) {
      updatePageSettings(activePageId, { slug: sanitized });
    }
  };

  const handleSlugBlur = () => {
    const cleaned = slugify(slug);
    const finalSlug = cleaned || 'page';
    setSlug(finalSlug);
    setSlugError(null);
    updatePageSettings(activePageId, { slug: finalSlug });
  };

  const handleMetaDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMetaDescription(val);
    updatePageSettings(activePageId, { metaDescription: val });
  };

  const pagePath = computePagePath(currentProject.pages, activePageId);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 380 },
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
          {t('pageSettings.title')}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label={t('common.cancel')}>
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Page Title */}
        <TextField
          label={t('pageSettings.pageTitle')}
          value={title}
          onChange={handleTitleChange}
          fullWidth
          size="small"
        />

        {/* Page Slug */}
        <Box>
          <TextField
            label={t('pageSettings.slug')}
            value={slug}
            onChange={handleSlugChange}
            onBlur={handleSlugBlur}
            error={Boolean(slugError)}
            helperText={slugError || t('pageSettings.slugHelp')}
            fullWidth
            size="small"
          />
        </Box>

        {/* Live URL Path Preview */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
            {t('pageSettings.pathPreview')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              bgcolor: 'background.default',
              p: 1,
              borderRadius: 1,
              wordBreak: 'break-all',
              border: '1px solid',
              borderColor: 'outlineVariant',
            }}
          >
            /{pagePath}
          </Typography>
        </Paper>

        {/* Meta Description */}
        <TextField
          label={t('pageSettings.metaDescription')}
          value={metaDescription}
          onChange={handleMetaDescChange}
          multiline
          rows={4}
          fullWidth
          size="small"
          placeholder={t('pageSettings.metaPlaceholder')}
          helperText={t('pageSettings.metaHelp')}
        />

        {activePage.parentId === null && activePage.slug === 'index' && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            {t('pageSettings.rootNotice')}
          </Alert>
        )}
      </Box>
    </Drawer>
  );
};
