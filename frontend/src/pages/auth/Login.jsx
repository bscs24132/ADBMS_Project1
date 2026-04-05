import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container, Box, TextField, Button,
    Typography, Paper, Alert, Divider,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        return () => { if (setError) setError(null); };
    }, [setError]);

    const handleLogin = async () => {
        if (!identifier || !password) {
            if (setError) setError('Please enter username/email and password');
            return;
        }
        setLoading(true);
        const credentials = {
            [identifier.includes('@') ? 'email' : 'username']: identifier,
            password,
        };
        const result = await login(credentials);
        if (result.success) {
            const role = result.user?.role || result.role;
            if (role === 'admin') navigate('/admin', { replace: true });
            else if (role === 'writer') navigate('/writer', { replace: true });
            else navigate('/dashboard', { replace: true });
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}>
                    <Paper elevation={0} sx={{
                        p: { xs: 3, sm: 5 },
                        border: '1px solid #E8C99A',
                        borderTop: '4px solid #E6A341',
                        bgcolor: '#FFF8F0',
                        borderRadius: 2,
                        boxShadow: '0 4px 24px rgba(45,1,0,0.1)',
                    }}>
                        {/* Logo mark */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center',
                                justifyContent: 'center',
                                width: 56, height: 56, borderRadius: '50%',
                                bgcolor: '#2D0100', mb: 2,
                                border: '2px solid #E6A341',
                            }}>
                                <AutoStoriesIcon sx={{ color: '#E6A341', fontSize: 26 }} />
                            </Box>
                            <Typography variant="h4" sx={{
                                fontFamily: '"Playfair Display", serif',
                                fontWeight: 700, color: '#2D0100',
                                letterSpacing: '0.02em',
                            }}>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: '#7A3B2E', mt: 0.5,
                                fontFamily: '"Lato", sans-serif',
                                letterSpacing: '0.06em',
                            }}>
                                Sign in to your InkVio account
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, fontFamily: '"Lato", sans-serif' }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth label="Username or Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            onKeyDown={handleKeyDown}
                            margin="normal"
                        />
                        <TextField
                            fullWidth type="password" label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            margin="normal"
                        />

                        <Button
                            fullWidth variant="contained" size="large"
                            disabled={loading}
                            onClick={handleLogin}
                            sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link
                                to="/forgot-password"
                                style={{
                                    color: '#8C0902',
                                    fontSize: '0.85rem',
                                    fontFamily: '"Lato", sans-serif',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em',
                                    textDecoration: 'none',
                                    borderBottom: '1px dotted #E6A341',
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Divider sx={{ my: 2.5, borderColor: '#E8C99A' }}>
                            <Typography sx={{
                                px: 1, color: '#C4956A', fontSize: '0.75rem',
                                fontFamily: '"Lato", sans-serif', letterSpacing: '0.08em',
                            }}>
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{
                                fontFamily: '"Lato", sans-serif', color: '#7A3B2E',
                            }}>
                                Don't have an account?{' '}
                                <Link to="/register" style={{
                                    color: '#8C0902', fontWeight: 700,
                                    textDecoration: 'none',
                                    borderBottom: '1px solid #E6A341',
                                }}>
                                    Register here
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default Login;