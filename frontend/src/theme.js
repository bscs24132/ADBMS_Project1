import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#6c5ce7',      // Bookish purple
            light: '#a29bfe',
            dark: '#4834d4',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00b894',      // Coin green
            light: '#55efc4',
            dark: '#00a87e',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d63031',
        },
        warning: {
            main: '#fdcb6e',
        },
        info: {
            main: '#0984e3',
        },
        success: {
            main: '#00b894',
        },
        background: {
            default: '#f5f6fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#2d3436',
            secondary: '#636e72',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 600 },
        h2: { fontSize: '2rem', fontWeight: 600 },
        h3: { fontSize: '1.75rem', fontWeight: 500 },
        h4: { fontSize: '1.5rem', fontWeight: 500 },
        h5: { fontSize: '1.25rem', fontWeight: 500 },
        h6: { fontSize: '1rem', fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});