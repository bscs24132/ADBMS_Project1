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
    MenuItem,
    Link as MuiLink,
    FormHelperText,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();
     useEffect(() => {
        return () => {
            if (setError) setError(null);
        };
    }, [setError]);
    // Password validation function
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!hasMinLength) return 'Password must be at least 8 characters';
        if (!hasNumber) return 'Password must contain at least one number';
        if (!hasSymbol) return 'Password must contain at least one symbol (!@#$%^&* etc.)';
        return '';
    };

    // Email validation function
    const validateEmail = (email) => {
        if (!email.endsWith('@gmail.com')) {
            return 'Email must end with @gmail.com';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear field errors
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        
        // Clear global auth error
        if (setError) setError(null);
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        
        // Email validation
        const emailError = validateEmail(formData.email);
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (emailError) {
            newErrors.email = emailError;
        }
        
        // Password validation
        const passwordError = validatePassword(formData.password);
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (passwordError) {
            newErrors.password = passwordError;
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);

        const { confirmPassword, ...userData } = formData;
        const result = await register(userData);

        if (result.success) {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Register
                        </Typography>
                        
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            {/* Username Field */}
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                margin="normal"
                                required
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                            
                            {/* Email Field */}
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                                error={!!errors.email}
                                helperText={errors.email || "Must end with @gmail.com"}
                            />
                            
                            {/* Password Field */}
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                required
                                error={!!errors.password}
                                helperText={errors.password || "At least 8 chars, 1 number, 1 symbol"}
                            />
                            
                            {/* Confirm Password Field */}
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                margin="normal"
                                required
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                            
                            {/* Role Selection */}
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                margin="normal"
                            >
                                <MenuItem value="user">Reader</MenuItem>
                                <MenuItem value="writer">Writer</MenuItem>
                            </TextField>
                            
                            <FormHelperText>
                                Writers can create books and notebooks. Readers can purchase and read books.
                            </FormHelperText>
                            
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? 'Creating account...' : 'Register'}
                            </Button>
                        </form>
                        
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <MuiLink component={Link} to="/login">
                                    Login
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default Register;  // ← THIS LINE IS CRITICAL