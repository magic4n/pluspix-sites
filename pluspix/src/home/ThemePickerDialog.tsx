import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import i18n from '../i18n';
import type { ThemeMode } from '../theme/seedStore';

interface Props {
  open: boolean;
  seed: string;
  mode: ThemeMode;
  onClose: () => void;
  onSeedChange: (hex: string) => void;
  onModeChange: (mode: ThemeMode) => void;
}

/**
 * Material You settings dialog: pick the builder UI seed color and theme mode.
 * A live preview strip shows primary / container / surface tones.
 */
export default function ThemePickerDialog({
  open,
  seed,
  mode,
  onClose,
  onSeedChange,
  onModeChange,
}: Props) {
  // Local draft so typing in the native picker doesn't thrash global state.
  const [draft, setDraft] = useState(seed);
  useEffect(() => setDraft(seed), [seed, open]);

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { minWidth: 360 } }}>
      <DialogTitle>{i18n.t('topbar.seedColor')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label={i18n.t('topbar.seedColor')}
              style={{ width: 56, height: 40, border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <input
              className="hex-input"
              value={draft}
              maxLength={7}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="HEX"
            />
          </Stack>
          <div
            className="m3-preview-strip"
            style={{ ['--preview-seed' as string]: draft } as React.CSSProperties}
          >
            <span className="tone tone-primary" />
            <span className="tone tone-container" />
            <span className="tone tone-surface" />
          </div>
          <Typography variant="body2">{i18n.t('topbar.themeMode')}</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={(_, m) => m && onModeChange(m as ThemeMode)}
          >
            <ToggleButton value="auto">{i18n.t('topbar.modeAuto')}</ToggleButton>
            <ToggleButton value="light">{i18n.t('topbar.modeLight')}</ToggleButton>
            <ToggleButton value="dark">{i18n.t('topbar.modeDark')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{i18n.t('common.close')}</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (/^#[0-9a-fA-F]{6}$/.test(draft)) onSeedChange(draft.toUpperCase());
            onClose();
          }}
        >
          {i18n.t('common.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

