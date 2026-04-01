import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Box, Paper, Typography, TextField,
    Button, Alert, CircularProgress,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // POST to backend to create a password reset request
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.detail;
            if (err.response?.status === 404) {
                setError('No account found with that email address.');
            } else if (err.response?.status === 400) {
                setError(msg || 'A reset request is already pending for this account.');
            } else {
                setError(msg || 'Failed to send request. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>

                        {!submitted ? (
                            <>
                                {/* Header */}
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Box sx={{
                                        display: 'inline-flex', p: 2, borderRadius: '50%',
                                        bgcolor: 'primary.light', mb: 2,
                                    }}>
                                        <LockResetIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight={700}>Forgot Password?</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Enter your email address and we'll send a reset request to the admin.
                                        Once approved, you'll be able to set a new password.
                                    </Typography>
                                </Box>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    placeholder="Enter the email linked to your account"
                                    autoFocus
                                />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading || !email.trim()}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Send Reset Request'}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        startIcon={<ArrowBackIcon />}
                                        onClick={() => navigate('/login')}
                                        color="inherit"
                                        size="small"
                                    >
                                        Back to Login
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            /* Success state */
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Box sx={{
                                    display: 'inline-flex', p: 2, borderRadius: '50%',
                                    bgcolor: 'success.light', mb: 2,
                                }}>
                                    <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                </Box>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                                    Request Sent!
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                    Your password reset request has been submitted.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    The admin will review your request. Once approved, your new password
                                    will be sent to your email address. Please check your inbox.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/login')}
                                    startIcon={<ArrowBackIcon />}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default ForgotPasswordPage;