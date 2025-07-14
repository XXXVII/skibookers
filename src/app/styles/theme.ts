import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F', // AirBnB coral
      dark: '#E04848', // Darker coral for hover
    },
    secondary: {
      main: '#008489', // AirBnB teal
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222222',
      secondary: '#717171', // Slightly darker secondary text
    },
    grey: {
      50: '#F7F7F7',
      100: '#EBEBEB',
      200: '#DDDDDD',
      300: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#222222',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#222222',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#222222',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#222222',
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#222222',
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#717171',
    },
  },
  shape: {
    borderRadius: 12, // AirBnB rounded corners
  },
  spacing: 8,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
          transition: 'none',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            // Remove all hover effects
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '14px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#E04848',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '40px !important',
          paddingRight: '40px !important',
          maxWidth: '1120px !important',
          '@media (max-width: 600px)': {
            paddingLeft: '24px !important',
            paddingRight: '24px !important',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingBottom: '8px !important',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '8px !important',
          paddingLeft: '24px !important',
          paddingRight: '24px !important',
          paddingBottom: '24px !important',
        },
      },
    },
  },
});
