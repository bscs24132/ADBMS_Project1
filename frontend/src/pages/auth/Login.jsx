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
    Link as MuiLink,
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
        console.log("1. Login clicked");
        
        if (!identifier || !password) {
            console.log("2. Missing fields");
            if (setError) setError('Please enter username/email and password');
            return;
        }
        
        setLoading(true);
        
        const credentials = {
            [identifier.includes('@') ? 'email' : 'username']: identifier,
            password
        };
        
        console.log("3. Sending credentials:", credentials);
        
        const result = await login(credentials);
        console.log("4. Login result:", result);
        
        if (result.success) {
            console.log("5. Navigating to dashboard");
            navigate('/dashboard', { replace: true });
        } else {
            console.log("5. Failed - showing error");
        }
        setLoading(false);
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
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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