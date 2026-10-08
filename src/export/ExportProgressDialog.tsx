import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Project } from '@/project/types';
import { db } from '@/db/schema';
import { renderSite } from './renderSite';
import { buildZip } from './buildZip';
import { downloadZip } from './downloadZip';

export interface ExportProgressDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export const ExportProgressDialog: React.FC<ExportProgressDialogProps> = ({
  open,
  onClose,
  project,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [renderedPages, setRenderedPages] = useState<string[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setStatusText('');
      setRenderedPages([]);
      setZipBlob(null);
      setIsDone(false);
      return;
    }

    let isMounted = true;

    async function runExport() {
      setStatusText(t('export.inProgress'));
      const assets = await db.assets.where('projectId').equals(project.id).toArray();

      const files = await renderSite({
        project,
        assets,
        onProgress: (pageTitle, index, total) => {
          if (!isMounted) return;
          const pct = Math.round((index / total) * 70);
          setProgress(pct);
          setRenderedPages((prev) => [...prev, pageTitle]);
        },
      });

      if (!isMounted) return;
      setStatusText(t('export.packaging'));
      setProgress(85);

      const blob = await buildZip(files);

      if (!isMounted) return;
      setProgress(100);
      setStatusText(t('export.complete'));
      setZipBlob(blob);
      setIsDone(true);

      // Auto-trigger download
      downloadZip(blob, `${project.name}.zip`);
    }

    runExport().catch((err) => {
      console.error('Export error:', err);
      if (isMounted) {
        setStatusText('Export failed. See console for details.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [open, project, t]);

  const handleManualDownload = () => {
    if (zipBlob) {
      downloadZip(zipBlob, `${project.name}.zip`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isDone ? onClose : undefined}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1,
            minWidth: { xs: 320, sm: 460 },
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {t('export.title')}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('export.desc')}
        </Typography>

        <Box sx={{ width: '100%', my: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
          {statusText}
        </Typography>

        {renderedPages.length > 0 && (
          <List dense sx={{ maxHeight: 160, overflowY: 'auto', mt: 1, bgcolor: 'action.hover', borderRadius: 2 }}>
            {renderedPages.map((pageTitle, idx) => (
              <ListItem key={idx} sx={{ py: 0.3 }}>
                <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    check_circle
                  </span>
                </ListItemIcon>
                <ListItemText
                  primary={pageTitle}
                  primaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {isDone ? (
          <>
            <Button onClick={onClose} color="inherit">
              {t('common.cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={handleManualDownload}
              startIcon={<span className="material-symbols-outlined">download</span>}
            >
              {t('export.downloadBtn')}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="inherit">
            {t('common.cancel')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
