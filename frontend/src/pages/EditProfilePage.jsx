import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        profile_picture: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            console.log('Profile data:', response.data);
            setFormData({
                username: response.data.username,
                bio: response.data.bio || '',
                profile_picture: response.data.profile_picture || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    console.log('Sending update:', {
        bio: formData.bio,
        profile_picture: formData.profile_picture,
    });

    try {
        const response = await api.put('/users/profile', {
            bio: formData.bio,
            profile_picture: formData.profile_picture,
        });
        
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Response status:', response.status);
        
        // Check if response.data exists
        if (response.data) {
            setSuccess('Profile updated successfully!');
            
            // Update user in context
            setUser({
                ...user,
                bio: response.data.bio,
                profile_picture: response.data.profile_picture,
            });
            
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } else {
            setError('No data received from server');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        console.error('Error response:', error.response);
        setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
        setSaving(false);
    }
};

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5">Edit Profile</Typography>
                    </Box>

                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {success}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={formData.profile_picture}
                                        sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                                    >
                                        {formData.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <IconButton
                                        sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper' }}
                                        size="small"
                                        component="label"
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                        <input
                                            type="text"
                                            hidden
                                            onChange={(e) => {
                                                setFormData({ ...formData, profile_picture: e.target.value });
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                disabled
                                margin="normal"
                                helperText="Username cannot be changed"
                            />

                            <TextField
                                fullWidth
                                label="Bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={4}
                                placeholder="Tell us about yourself..."
                            />

                            <TextField
                                fullWidth
                                label="Profile Picture URL"
                                name="profile_picture"
                                value={formData.profile_picture}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="https://example.com/avatar.jpg"
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={saving}
                                sx={{ mt: 3 }}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                            </Button>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default EditProfilePage;