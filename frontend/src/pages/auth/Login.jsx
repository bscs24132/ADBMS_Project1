import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    Divider,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (setError) setError(null);
        };
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
            // Redirect based on role
            const role = result.user?.role || result.role;
            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'writer') {
                navigate('/writer', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Login
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Username or Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            onKeyDown={handleKeyDown}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            onClick={handleLogin}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link
                                to="/forgot-password"
                                style={{
                                    textDecoration: 'none',
                                    color: '#6c5ce7',
                                    fontSize: '0.875rem',
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ textDecoration: 'none' }}>
                                    Register
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