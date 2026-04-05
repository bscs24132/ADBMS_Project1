import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#E6A341',        // Goldfinch — main actions, buttons
            light: '#FECE79',       // Butter — highlights, hover
            dark: '#B14A36',        // Indian Red — pressed/dark
            contrastText: '#2D0100',
        },
        secondary: {
            main: '#8C0902',        // Garnet — deep accents
            light: '#B14A36',       // Indian Red
            dark: '#2D0100',        // Bistre
            contrastText: '#FECE79',
        },
        error: {
            main: '#B14A36',
        },
        warning: {
            main: '#E6A341',
        },
        info: {
            main: '#8C0902',
        },
        success: {
            main: '#5C7A4E',        // muted olive green — readable on warm bg
        },
        background: {
            default: '#FDF6EC',     // warm cream page background
            paper: '#FFF8F0',       // slightly warmer white for cards
        },
        text: {
            primary: '#2D0100',     // Bistre — dark readable text
            secondary: '#7A3B2E',   // warm mid-tone for secondary text
            disabled: '#C4956A',
        },
        divider: '#E8C99A',
    },
    typography: {
        fontFamily: '"Playfair Display", "Georgia", serif',
        h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontSize: '2rem',   fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        h4: { fontSize: '1.5rem',  fontWeight: 600 },
        h5: { fontSize: '1.25rem', fontWeight: 600 },
        h6: { fontSize: '1rem',    fontWeight: 600 },
        body1: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.04em',
        },
        caption: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontSize: '0.75rem',
        },
        subtitle1: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontWeight: 600,
        },
        subtitle2: {
            fontFamily: '"Lato", "Helvetica", sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
        },
    },
    shape: {
        borderRadius: 4,           // more angular — vintage feel
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
            `,
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2D0100',  // Bistre — rich dark header
                    borderBottom: '3px solid #E6A341',  // Goldfinch accent line
                    boxShadow: '0 2px 12px rgba(45,1,0,0.4)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: '8px 24px',
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease',
                },
                contained: {
                    backgroundColor: '#E6A341',
                    color: '#2D0100',
                    boxShadow: 'none',
                    border: '2px solid #B14A36',
                    '&:hover': {
                        backgroundColor: '#FECE79',
                        boxShadow: '0 4px 12px rgba(230,163,65,0.4)',
                        transform: 'translateY(-1px)',
                    },
                },
                outlined: {
                    borderColor: '#E6A341',
                    color: '#8C0902',
                    borderWidth: '2px',
                    '&:hover': {
                        borderColor: '#8C0902',
                        backgroundColor: 'rgba(230,163,65,0.08)',
                        borderWidth: '2px',
                    },
                },
                text: {
                    color: '#8C0902',
                    '&:hover': {
                        backgroundColor: 'rgba(230,163,65,0.08)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    border: '1px solid #E8C99A',
                    backgroundColor: '#FFF8F0',
                    boxShadow: '0 2px 8px rgba(45,1,0,0.08)',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(45,1,0,0.14)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFF8F0',
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(45,1,0,0.08)',
                },
                elevation3: {
                    boxShadow: '0 4px 16px rgba(45,1,0,0.12)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        fontFamily: '"Lato", sans-serif',
                        backgroundColor: '#FFFDF8',
                        '& fieldset': {
                            borderColor: '#E8C99A',
                            borderWidth: '1.5px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#E6A341',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#8C0902',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontFamily: '"Lato", sans-serif',
                        color: '#7A3B2E',
                        '&.Mui-focused': {
                            color: '#8C0902',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                },
                colorPrimary: {
                    backgroundColor: 'rgba(230,163,65,0.15)',
                    color: '#8C0902',
                    border: '1px solid #E6A341',
                },
                colorSuccess: {
                    backgroundColor: 'rgba(92,122,78,0.12)',
                    color: '#3A5430',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: '#7A3B2E',
                    '&.Mui-selected': {
                        color: '#8C0902',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#E6A341',
                    height: 3,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontFamily: '"Lato", sans-serif',
                    borderRadius: 4,
                    border: '1px solid',
                },
                standardError: {
                    backgroundColor: 'rgba(177,74,54,0.08)',
                    borderColor: '#B14A36',
                    color: '#8C0902',
                },
                standardSuccess: {
                    backgroundColor: 'rgba(92,122,78,0.08)',
                    borderColor: '#5C7A4E',
                    color: '#3A5430',
                },
                standardInfo: {
                    backgroundColor: 'rgba(230,163,65,0.08)',
                    borderColor: '#E6A341',
                    color: '#7A3B2E',
                },
                standardWarning: {
                    backgroundColor: 'rgba(254,206,121,0.15)',
                    borderColor: '#E6A341',
                    color: '#7A3B2E',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#E8C99A',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#8C0902',
                    color: '#FECE79',
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#E6A341',
                    '&:hover': {
                        backgroundColor: 'rgba(230,163,65,0.12)',
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: '"Lato", sans-serif',
                    '&:hover': {
                        backgroundColor: 'rgba(230,163,65,0.08)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(230,163,65,0.15)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFF8F0',
                    border: '1px solid #E8C99A',
                    borderTop: '4px solid #E6A341',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    color: '#2D0100',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: '#E6A341',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(230,163,65,0.2)',
                },
                bar: {
                    backgroundColor: '#E6A341',
                },
            },
        },
    },
});