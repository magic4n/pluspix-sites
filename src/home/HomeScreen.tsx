import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { useProjectStore } from '@/project/store';
import { TopBar } from '@/editor/TopBar';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/project/types';

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const projects = useLiveQuery(() => db.projects.orderBy('updatedAt').reverse().toArray());

  const {
    openProject,
    createProject,
    renameProject,
    duplicateProject,
    deleteProject,
  } = useProjectStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreateDialog = () => {
    setNewProjectName('');
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newProjectName.trim();
    setIsSubmitting(true);
    try {
      await createProject(trimmed || 'Untitled Project');
      setCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    await renameProject(id, newName);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProject(id);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  const handleOpen = (project: Project) => {
    openProject(project);
  };

  const isLoading = projects === undefined;
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <TopBar screen="home" />

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : !hasProjects ? (
          /* Empty state */
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 6,
                bgcolor: 'background.paper',
                border: '1px dashed',
                borderColor: 'outlineVariant',
                maxWidth: 520,
                width: '100%',
              }}
            >
              <Box sx={{ mb: 4, color: 'primary.main', display: 'flex', justifyContent: 'center' }}>
                <svg
                  width="140"
                  height="140"
                  viewBox="0 0 140 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="20"
                    y="30"
                    width="100"
                    height="80"
                    rx="16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    fill="none"
                    opacity="0.5"
                  />
                  <rect
                    x="32"
                    y="42"
                    width="76"
                    height="22"
                    rx="6"
                    fill="currentColor"
                    fillOpacity="0.12"
                  />
                  <rect
                    x="32"
                    y="72"
                    width="34"
                    height="26"
                    rx="6"
                    fill="currentColor"
                    fillOpacity="0.12"
                  />
                  <rect
                    x="74"
                    y="72"
                    width="34"
                    height="26"
                    rx="6"
                    fill="currentColor"
                    fillOpacity="0.12"
                  />
                  <circle cx="70" cy="70" r="22" fill="currentColor" />
                  <path
                    d="M70 60V80M60 70H80"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Box>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {t('home.empty.title')}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 380 }}
              >
                {t('home.empty.subtitle')}
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleOpenCreateDialog}
                startIcon={<span className="material-symbols-outlined">add</span>}
                sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: 7 }}
              >
                {t('home.empty.cta')}
              </Button>
            </Paper>
          </Box>
        ) : (
          /* Projects grid */
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {t('topbar.backToHome')}
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenCreateDialog}
                startIcon={<span className="material-symbols-outlined">add</span>}
              >
                {t('home.newProject')}
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {/* "+ New project" large dashed tile */}
              <Card
                sx={{
                  borderRadius: 4,
                  border: '2px dashed',
                  borderColor: 'outlineVariant',
                  bgcolor: 'transparent',
                  height: 220,
                  display: 'flex',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={handleOpenCreateDialog}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                      add
                    </span>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {t('home.newProjectTile')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('home.newProjectSubtitle')}
                  </Typography>
                </CardActionArea>
              </Card>

              {/* Grid of project cards */}
              {projects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onOpen={handleOpen}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* New Project Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => !isSubmitting && setCreateDialogOpen(false)}
        slotProps={{
          paper: { sx: { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } } },
        }}
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: 600 }}>
            {t('home.dialog.createTitle')}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('home.dialog.nameLabel')}
              placeholder={t('home.dialog.namePlaceholder')}
              fullWidth
              variant="outlined"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              disabled={isSubmitting}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setCreateDialogOpen(false)}
              color="inherit"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {t('common.create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
