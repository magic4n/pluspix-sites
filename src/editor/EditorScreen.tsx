import React from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { TopBar } from './TopBar';

export const EditorScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentProject, closeProject } = useProjectStore();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <TopBar
        screen="editor"
        projectName={currentProject?.name || 'Untitled Project'}
        onNavigateHome={closeProject}
      />

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 6,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
              auto_fix_high
            </span>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {t('editor.placeholder.title')} — {currentProject?.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('editor.placeholder.desc')}
          </Typography>

          <Button
            variant="outlined"
            onClick={closeProject}
            startIcon={<span className="material-symbols-outlined">arrow_back</span>}
          >
            {t('editor.placeholder.back')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
