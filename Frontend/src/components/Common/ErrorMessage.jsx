import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorMessage = ({ message, severity = 'error' }) => {
    if (!message) return null;
    
    return (
        <Box sx={{ mb: 2 }}>
            <Alert severity={severity}>{message}</Alert>
        </Box>
    );
};

export default ErrorMessage;