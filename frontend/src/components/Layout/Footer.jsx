import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    © 2024 BookVerse - Readers & Writers Platform
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;