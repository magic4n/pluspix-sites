import { createTheme, Theme } from '@mui/material/styles';
import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surfaceVariant: {
      main: string;
      contrastText: string;
    };
    outline: string;
    outlineVariant: string;
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surfaceVariant?: {
      main: string;
      contrastText: string;
    };
    outline?: string;
    outlineVariant?: string;
  }
}

/**
 * Safely parses a hex color string into ARGB integer.
 * Falls back to default M3 purple (0xff6750a4) if invalid.
 */
function safeArgbFromHex(hex: string): number {
  try {
    const trimmed = hex.trim();
    const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (/^#[0-9a-fA-F]{6}$/.test(formatted)) {
      return argbFromHex(formatted);
    }
  } catch {
    // ignore parse error, return fallback
  }
  return 0xff6750a4;
}

/**
 * Generates an M3-compliant MUI Theme from a seed color hex and dark mode boolean.
 */
export function createM3Theme(seedColorHex: string, isDark: boolean): Theme {
  const argb = safeArgbFromHex(seedColorHex);
  const m3Theme = themeFromSourceColor(argb);
  const scheme = isDark ? m3Theme.schemes.dark : m3Theme.schemes.light;

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: hexFromArgb(scheme.primary),
        contrastText: hexFromArgb(scheme.onPrimary),
      },
      secondary: {
        main: hexFromArgb(scheme.secondary),
        contrastText: hexFromArgb(scheme.onSecondary),
      },
      tertiary: {
        main: hexFromArgb(scheme.tertiary),
        contrastText: hexFromArgb(scheme.onTertiary),
      },
      error: {
        main: hexFromArgb(scheme.error),
        contrastText: hexFromArgb(scheme.onError),
      },
      background: {
        default: hexFromArgb(scheme.background),
        paper: hexFromArgb(scheme.surface),
      },
      text: {
        primary: hexFromArgb(scheme.onSurface),
        secondary: hexFromArgb(scheme.onSurfaceVariant),
      },
      divider: hexFromArgb(scheme.outlineVariant),
      outline: hexFromArgb(scheme.outline),
      outlineVariant: hexFromArgb(scheme.outlineVariant),
      surfaceVariant: {
        main: hexFromArgb(scheme.surfaceVariant),
        contrastText: hexFromArgb(scheme.onSurfaceVariant),
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 28,
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundColor: hexFromArgb(scheme.surface),
            color: hexFromArgb(scheme.onSurface),
            borderBottom: `1px solid ${hexFromArgb(scheme.outlineVariant)}`,
          },
        },
      },
    },
  });
}
