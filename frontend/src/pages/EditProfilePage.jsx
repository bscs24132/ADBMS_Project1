import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Paper, Typography, TextField,
    Button, Avatar, CircularProgress, Alert, IconButton,
    InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({ username: '', bio: '', profile_picture: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setFormData({
                username: response.data.username || '',
                bio: response.data.bio || '',
                profile_picture: response.data.profile_picture || '',
            });
            setPreviewUrl(response.data.profile_picture || '');
            setImageUrl(response.data.profile_picture || '');
        } catch (err) {
            if (!user) {
                setError('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setPreviewUrl(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await api.put('/users/profile', {
                bio: formData.bio,
                profile_picture: imageUrl || null
            });

            if (response.data) {
                setSuccess('Profile updated successfully!');
                if (setUser) {
                    setUser(prev => ({
                        ...prev,
                        bio: response.data.bio,
                        profile_picture: response.data.profile_picture,
                    }));
                }
                setTimeout(() => navigate('/profile'), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
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
                        <Typography variant="h5" fontWeight={600}>Edit Profile</Typography>
                    </Box>

                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                        <form onSubmit={handleSubmit}>
                            {/* Avatar Preview */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Avatar
                                    src={previewUrl}
                                    sx={{
                                        width: 110, height: 110,
                                        bgcolor: 'primary.main', fontSize: 44,
                                    }}
                                >
                                    {formData.username?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Box>

                            {/* Image URL Input */}
                            <TextField
                                fullWidth
                                label="Profile Picture URL"
                                value={imageUrl}
                                onChange={handleUrlChange}
                                margin="normal"
                                placeholder="https://example.com/avatar.jpg"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Enter a direct link to an image"
                            />

                            <TextField
                                fullWidth
                                label="Username"
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
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                margin="normal"
                                multiline
                                rows={4}
                                placeholder="Tell us about yourself..."
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