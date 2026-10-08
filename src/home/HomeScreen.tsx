import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TopBar } from '@/editor/TopBar';

export interface HomeScreenProps {
  onCreateProject: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateProject }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <TopBar screen="home" />

      <Container
        maxWidth="md"
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
          {/* Empty state SVG illustration */}
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
            onClick={onCreateProject}
            startIcon={<span className="material-symbols-outlined">add</span>}
            sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: 7 }}
          >
            {t('home.empty.cta')}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
