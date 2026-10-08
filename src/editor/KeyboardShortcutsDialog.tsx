import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      action: t('shortcuts.save', 'Save project'),
      keys: [`${modKey} + S`],
    },
    {
      action: t('shortcuts.preview', 'Preview active page'),
      keys: [`${modKey} + P`],
    },
    {
      action: t('shortcuts.previewSite', 'Preview entire site'),
      keys: [`${modKey} + Shift + P`],
    },
    {
      action: t('shortcuts.undo', 'Undo change'),
      keys: [`${modKey} + Z`],
    },
    {
      action: t('shortcuts.redo', 'Redo change'),
      keys: [`${modKey} + Shift + Z`, `${modKey} + Y`],
    },
    {
      action: t('shortcuts.help', 'Keyboard shortcuts'),
      keys: ['?', 'F1', `${modKey} + /`],
    },
    {
      action: t('shortcuts.escape', 'Close dialogs / panels'),
      keys: ['Esc'],
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="shortcuts-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        id="shortcuts-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            keyboard
          </span>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {t('shortcuts.title', 'Keyboard Shortcuts')}
          </Typography>
        </Box>
        <IconButton
          aria-label={t('common.cancel', 'Close')}
          onClick={onClose}
          size="small"
        >
          <span className="material-symbols-outlined">close</span>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600 }}>{t('shortcuts.actionHeader', 'Action')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{t('shortcuts.shortcutHeader', 'Shortcut')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shortcuts.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell component="th" scope="row" sx={{ py: 1.2 }}>
                    {item.action}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.2 }}>
                    <Box sx={{ display: 'inline-flex', gap: 0.8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {item.keys.map((k, kIdx) => (
                        <Chip
                          key={kIdx}
                          label={k}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            height: 24,
                            bgcolor: 'action.selected',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" size="small">
          {t('common.close', 'Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
