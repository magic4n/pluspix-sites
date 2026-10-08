import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Project } from '@/project/types';
import { formatRelativeTime } from '@/shared/formatTime';

export interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedName(project.name);
  }, [project.name]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonAnchor(null);
    setMenuAnchor(
      menuAnchor === null
        ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
        : null
    );
  };

  const handleKebabClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(null);
    setButtonAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setButtonAnchor(null);
  };

  const startInlineRename = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    handleCloseMenu();
    setIsEditing(true);
  };

  const submitInlineRename = () => {
    setIsEditing(false);
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    } else {
      setEditedName(project.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitInlineRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(project.name);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCloseMenu();
    onDuplicate(project.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCloseMenu();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    onDelete(project.id);
  };

  const isMenuOpen = Boolean(menuAnchor || buttonAnchor);

  return (
    <>
      <Card
        onContextMenu={handleContextMenu}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'outlineVariant',
          bgcolor: 'background.paper',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
            boxShadow: 2,
          },
          display: 'flex',
          flexDirection: 'column',
          height: 220,
        }}
      >
        {/* Preview banner area */}
        <CardActionArea
          onClick={() => onOpen(project)}
          sx={{
            flexGrow: 1,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 90,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'outlineVariant',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: 0.85,
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 6, borderRadius: 0.5, bgcolor: 'primary.main' }} />
              <Box sx={{ width: 40, height: 4, borderRadius: 0.5, bgcolor: 'divider' }} />
              <Box sx={{ width: 25, height: 4, borderRadius: 0.5, bgcolor: 'divider' }} />
            </Box>
            <Box sx={{ width: '70%', height: 10, borderRadius: 1, bgcolor: 'action.selected', mt: 1 }} />
            <Box sx={{ width: '90%', height: 6, borderRadius: 0.5, bgcolor: 'action.hover' }} />
            <Box sx={{ width: '40%', height: 14, borderRadius: 1, bgcolor: 'primary.main', opacity: 0.3, mt: 0.5 }} />
          </Box>
        </CardActionArea>

        {/* Card info footer */}
        <CardContent
          sx={{
            p: 2,
            pb: '16px !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ minWidth: 0, flexGrow: 1, mr: 1 }}>
            {isEditing ? (
              <TextField
                inputRef={inputRef}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={submitInlineRename}
                onKeyDown={handleKeyDown}
                size="small"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    p: '2px 6px',
                  },
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                component="div"
                onDoubleClick={startInlineRename}
                title={t('home.card.doubleClickToRename')}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                }}
              >
                {project.name}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
              {t('home.card.lastEdited', {
                time: formatRelativeTime(project.updatedAt, i18n.language),
              })}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleKebabClick}
            aria-label={t('home.card.menu')}
            sx={{ flexShrink: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              more_vert
            </span>
          </IconButton>
        </CardContent>
      </Card>

      {/* Context Menu (Right Click & Kebab Button) */}
      <Menu
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorReference={menuAnchor ? 'anchorPosition' : 'anchorEl'}
        anchorPosition={
          menuAnchor ? { top: menuAnchor.mouseY, left: menuAnchor.mouseX } : undefined
        }
        anchorEl={buttonAnchor}
        slotProps={{
          paper: {
            sx: { borderRadius: 3, minWidth: 160, boxShadow: 3 },
          },
        }}
      >
        <MenuItem onClick={startInlineRename}>
          <ListItemIcon>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              edit
            </span>
          </ListItemIcon>
          <ListItemText>{t('home.card.rename')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDuplicateClick}>
          <ListItemIcon>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              content_copy
            </span>
          </ListItemIcon>
          <ListItemText>{t('home.card.duplicate')}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            alert(t('export.stubNotice'));
          }}
        >
          <ListItemIcon>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              download
            </span>
          </ListItemIcon>
          <ListItemText>{t('topbar.export')}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              delete
            </span>
          </ListItemIcon>
          <ListItemText>{t('home.card.delete')}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: { sx: { borderRadius: 4, p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>{t('home.dialog.deleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('home.dialog.deleteMessage', { name: project.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {t('home.card.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
