import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'pluspix_lang_chosen';

export const LanguageSelectionDialog: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'ru'>('en');

  useEffect(() => {
    try {
      const alreadyChosen = localStorage.getItem(STORAGE_KEY);
      if (!alreadyChosen) {
        // Detect initial language or default to en
        const detected = i18n.language && i18n.language.startsWith('ru') ? 'ru' : 'en';
        setSelectedLang(detected);
        setOpen(true);
      }
    } catch {
      // If localStorage is unavailable, do nothing
    }
  }, [i18n.language]);

  const handleLangChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLang: 'en' | 'ru' | null
  ) => {
    if (newLang) {
      setSelectedLang(newLang);
      i18n.changeLanguage(newLang);
    }
  };

  const handleConfirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('settings.lang', selectedLang);
    } catch {
      // ignore
    }
    i18n.changeLanguage(selectedLang);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6,
            p: 2,
            textAlign: 'center',
          },
        },
      }}
    >
      <DialogTitle sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        {/* Globe icon */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
            public
          </span>
        </Box>

        <Typography variant="h5" component="div" sx={{ fontWeight: 700, mt: 1 }}>
          {selectedLang === 'ru' ? 'Выберите язык' : 'Choose your language'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {selectedLang === 'ru'
            ? 'Вы сможете переключить его в любой момент в правом верхнем углу.'
            : 'You can switch it at any time in the top-right corner.'}
        </Typography>

        {/* Language selector toggle */}
        <ToggleButtonGroup
          value={selectedLang}
          exclusive
          onChange={handleLangChange}
          fullWidth
          aria-label="Language selection"
          sx={{
            height: 52,
            bgcolor: 'action.hover',
            borderRadius: 3,
            p: 0.5,
            '& .MuiToggleButton-root': {
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="en">
            🇺🇸 English (EN)
          </ToggleButton>
          <ToggleButton value="ru">
            🇷🇺 Русский (RU)
          </ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 2, pt: 2 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleConfirm}
          sx={{
            borderRadius: 3,
            py: 1.2,
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {selectedLang === 'ru' ? 'Продолжить' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
