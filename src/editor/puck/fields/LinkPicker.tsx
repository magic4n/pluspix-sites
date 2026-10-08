import { useState } from 'react';
import { CustomField } from '@measured/puck';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';

export const LinkPicker: CustomField<any> = {
  type: 'custom',
  render: ({ value, onChange }) => {
    const { t } = useTranslation();
    const { currentProject } = useProjectStore();
    const isInternal = Boolean(value && value.startsWith('page:'));
    const [mode, setMode] = useState<'internal' | 'external'>(isInternal ? 'internal' : 'external');

    const pages = currentProject ? Object.values(currentProject.pages) : [];

    const handleModeChange = (
      _e: React.MouseEvent<HTMLElement>,
      newMode: 'internal' | 'external' | null
    ) => {
      if (newMode) {
        setMode(newMode);
        if (newMode === 'internal' && pages.length > 0) {
          onChange(`page:${pages[0].id}`);
        } else if (newMode === 'external') {
          onChange('');
        }
      }
    };

    const handlePageSelect = (pageId: string) => {
      onChange(`page:${pageId}`);
    };

    const handleExternalChange = (url: string) => {
      onChange(url);
    };

    const selectedPageId = isInternal && value ? value.replace('page:', '') : (pages[0]?.id || '');

    return (
      <Box sx={{ width: '100%', my: 0.5 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={handleModeChange}
          fullWidth
          sx={{ mb: 1 }}
        >
          <ToggleButton value="internal" sx={{ fontSize: '0.75rem', py: 0.4 }}>
            {t('puck.fields.linkInternal', 'Page')}
          </ToggleButton>
          <ToggleButton value="external" sx={{ fontSize: '0.75rem', py: 0.4 }}>
            {t('puck.fields.linkExternal', 'URL')}
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === 'internal' ? (
          <Select
            size="small"
            fullWidth
            value={selectedPageId}
            onChange={(e) => handlePageSelect(e.target.value)}
          >
            {pages.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <Typography variant="body2">{p.title} (/{p.slug})</Typography>
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            size="small"
            fullWidth
            placeholder={t('puck.fields.linkPlaceholder', 'https://example.com or #anchor')}
            value={value && !isInternal ? value : ''}
            onChange={(e) => handleExternalChange(e.target.value)}
          />
        )}
      </Box>
    );
  },
};
