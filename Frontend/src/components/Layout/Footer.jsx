import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                mt: 'auto',
                backgroundColor: '#2D0100',
                borderTop: '3px solid #E6A341',
            }}
        >
            <Container maxWidth="lg">
                {/* Ornamental divider */}
                <Box sx={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 2, mb: 1.5,
                }}>
                    <Box sx={{ height: '1px', width: 60, bgcolor: 'rgba(230,163,65,0.4)' }} />
                    <AutoStoriesIcon sx={{ color: '#E6A341', fontSize: 16 }} />
                    <Box sx={{ height: '1px', width: 60, bgcolor: 'rgba(230,163,65,0.4)' }} />
                </Box>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        color: '#C4956A',
                        fontFamily: '"Lato", sans-serif',
                        fontSize: '0.8rem',
                        letterSpacing: '0.08em',
                    }}
                >
                    © 2024 InkVio — Readers & Writers Platform
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;