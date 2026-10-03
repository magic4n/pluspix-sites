/**
 * Material You (M3) palette generation for the BUILDER UI.
 *
 * Uses @material/material-color-utilities `themeFromSourceColor` to derive a
 * full tonal palette from a single seed color, then maps the resulting roles
 * onto an MUI v6 theme. The exported sites are styled by separate "site
 * themes" (see src/site/themes/) — they never touch this code.
 */

import { createTheme, type Theme } from '@mui/material/styles';
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  MaterialDynamicColors,
  type DynamicScheme,
} from '@material/material-color-utilities';

export type Mode = 'light' | 'dark';

/** Cache so re-resolving the same seed+mode is cheap (called on every render). */
const cache = new Map<string, Theme>();

function buildRoleMap(scheme: DynamicScheme) {
  const D = MaterialDynamicColors;
  return {
    primary: D.primary.getArgb(scheme),
    onPrimary: D.onPrimary.getArgb(scheme),
    primaryContainer: D.primaryContainer.getArgb(scheme),
    onPrimaryContainer: D.onPrimaryContainer.getArgb(scheme),
    secondary: D.secondary.getArgb(scheme),
    onSecondary: D.onSecondary.getArgb(scheme),
    secondaryContainer: D.secondaryContainer.getArgb(scheme),
    onSecondaryContainer: D.onSecondaryContainer.getArgb(scheme),
    tertiary: D.tertiary.getArgb(scheme),
    onTertiary: D.onTertiary.getArgb(scheme),
    tertiaryContainer: D.tertiaryContainer.getArgb(scheme),
    onTertiaryContainer: D.onTertiaryContainer.getArgb(scheme),
    error: D.error.getArgb(scheme),
    onError: D.onError.getArgb(scheme),
    errorContainer: D.errorContainer.getArgb(scheme),
    onErrorContainer: D.onErrorContainer.getArgb(scheme),
    background: D.background.getArgb(scheme),
    onBackground: D.onBackground.getArgb(scheme),
    surface: D.surface.getArgb(scheme),
    onSurface: D.onSurface.getArgb(scheme),
    surfaceVariant: D.surfaceVariant.getArgb(scheme),
    onSurfaceVariant: D.onSurfaceVariant.getArgb(scheme),
    surfaceContainerLowest: D.surfaceContainerLowest.getArgb(scheme),
    surfaceContainerLow: D.surfaceContainerLow.getArgb(scheme),
    surfaceContainer: D.surfaceContainer.getArgb(scheme),
    surfaceContainerHigh: D.surfaceContainerHigh.getArgb(scheme),
    surfaceContainerHighest: D.surfaceContainerHighest.getArgb(scheme),
    outline: D.outline.getArgb(scheme),
    outlineVariant: D.outlineVariant.getArgb(scheme),
    inverseSurface: D.inverseSurface.getArgb(scheme),
    inverseOnSurface: D.inverseOnSurface.getArgb(scheme),
    inversePrimary: D.inversePrimary.getArgb(scheme),
  };
}

type RoleKey = keyof ReturnType<typeof buildRoleMap>;

function buildM3Theme(seedHex: string, mode: Mode): Theme {
  // M3 "tonal spot" is the standard Material You variant.
  const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seedHex)), mode === 'dark', 0.0);
  const roles = buildRoleMap(scheme);
  const c = (key: RoleKey) => hexFromArgb(roles[key]);

  const base = createTheme({
    palette: {
      mode,
      primary: { main: c('primary'), contrastText: c('onPrimary') },
      secondary: { main: c('secondary'), contrastText: c('onSecondary') },
      error: { main: c('error'), contrastText: c('onError') },
      warning: { main: '#F9A825' },
      info: { main: c('tertiary'), contrastText: c('onTertiary') },
      success: { main: '#2E7D32' },
      background: { default: c('background'), paper: c('surfaceContainerLow') },
      text: { primary: c('onSurface'), secondary: c('onSurfaceVariant') },
      divider: c('outlineVariant'),
    },
    shape: {
      borderRadius: 12, // M3 baseline for cards/buttons containers
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 400 },
      h2: { fontWeight: 400 },
      h3: { fontWeight: 400 },
      h4: { fontWeight: 400 },
      h5: { fontWeight: 400 },
      h6: { fontWeight: 500 },
      subtitle1: { fontWeight: 400 },
      body1: { fontWeight: 400 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shadows: [
      'none',
      '0px 1px 2px rgba(0,0,0,.30), 0px 1px 3px 1px rgba(0,0,0,.15)',
      '0px 1px 2px rgba(0,0,0,.30), 0px 2px 6px 2px rgba(0,0,0,.15)',
      '0px 1px 3px rgba(0,0,0,.30), 0px 4px 8px 3px rgba(0,0,0,.15)',
      '0px 2px 3px rgba(0,0,0,.30), 0px 6px 10px 4px rgba(0,0,0,.15)',
      '0px 4px 4px rgba(0,0,0,.30), 0px 8px 12px 6px rgba(0,0,0,.15)',
      ...Array<string>(14).fill(
        '0px 4px 4px rgba(0,0,0,.30), 0px 8px 12px 6px rgba(0,0,0,.15)',
      ),
    ] as Theme['shadows'],
  });

  // M3 component styling: rounded pills, subtle elevation, tonal surfaces.
  base.components = {
    ...base.components,
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          backgroundImage: 'none',
          ...(ownerState.variant === 'outlined' && {
            borderColor: c('outlineVariant'),
          }),
          ...(ownerState.elevation === 1 && {
            backgroundColor: c('surfaceContainerLow'),
          }),
        }),
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'default' },
      styleOverrides: {
        root: {
          backgroundColor: c('surfaceContainer'),
          color: c('onSurface'),
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 9999 },
        containedPrimary: { backgroundColor: c('primary'), color: c('onPrimary') },
        containedSecondary: { backgroundColor: c('secondaryContainer'), color: c('onSecondaryContainer') },
        outlined: { borderColor: c('outline') },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 9999 } },
    },
    MuiFab: {
      defaultProps: { color: 'primary' },
      styleOverrides: {
        root: {
          backgroundColor: c('primaryContainer'),
          color: c('onPrimaryContainer'),
          boxShadow: base.shadows[3],
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: c('surfaceContainerLow'),
          border: `1px solid ${c('outlineVariant')}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
        filled: {
          backgroundColor: c('secondaryContainer'),
          color: c('onSecondaryContainer'),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 28, backgroundColor: c('surfaceContainerHigh') },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: c('surfaceContainer'),
          boxShadow: base.shadows[3],
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: c('inverseSurface'),
          color: c('inverseOnSurface'),
          borderRadius: 8,
        },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { '& .MuiSwitch-track': { borderRadius: 9999 } },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: c('inverseSurface'),
          color: c('inverseOnSurface'),
          borderRadius: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: { root: { borderRadius: 8, minHeight: 48 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: c('surfaceContainerLow'),
          borderRight: `1px solid ${c('outlineVariant')}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 9999 } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { colorScheme: mode },
        body: { overscrollBehavior: 'none' },
        '.material-symbols-outlined': {
          fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        },
      },
    },
  };

  // Expose raw M3 roles for custom chrome that needs them directly.
  (base as unknown as Record<string, unknown>).m3 = {
    roles,
    mode,
    seed: seedHex,
  };

  return base;
}

/**
 * Get (or lazily build) the MUI theme for a seed color + resolved mode.
 * Results are memoized per (seed, mode) pair.
 */
export function getM3Theme(seedHex: string, mode: Mode): Theme {
  const key = `${seedHex.toLowerCase()}:${mode}`;
  let theme = cache.get(key);
  if (!theme) {
    theme = buildM3Theme(seedHex, mode);
    cache.set(key, theme);
  }
  return theme;
}

/** Type-safe accessor for the M3 role map attached to the theme. */
export function m3Roles(theme: Theme): Record<RoleKey, number> {
  return (theme as unknown as { m3: { roles: Record<RoleKey, number> } }).m3.roles;
}
