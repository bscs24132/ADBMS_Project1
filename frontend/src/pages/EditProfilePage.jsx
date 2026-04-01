import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Paper, Typography, TextField,
    Button, Avatar, CircularProgress, Alert, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({ username: '', bio: '', profile_picture: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageFile, setImageFile] = useState(null); // actual File object

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Try user from context first, then fallback to API
            if (user) {
                setFormData({
                    username: user.username || '',
                    bio: user.bio || '',
                    profile_picture: user.profile_picture || '',
                });
                setPreviewUrl(user.profile_picture || '');
                setLoading(false);
            }
            // Always fetch fresh from API to get latest data
            const response = await api.get('/users/profile');
            setFormData({
                username: response.data.username || '',
                bio: response.data.bio || '',
                profile_picture: response.data.profile_picture || '',
            });
            setPreviewUrl(response.data.profile_picture || '');
        } catch (err) {
            // If API fails but we have context data, don't show error
            if (!user) {
                setError('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        // Show preview immediately using object URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            // Use FormData so profile picture is sent as actual file (multipart)
            const payload = new FormData();
            payload.append('bio', formData.bio);

            if (imageFile) {
                // New image selected — send as file
                payload.append('profile_picture', imageFile);
            }
            // If no new image, don't resend the old URL — backend keeps existing

            const response = await api.put('/users/profile', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data) {
                setSuccess('Profile updated successfully!');
                // Update auth context so header avatar refreshes
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
                            {/* Avatar with click-to-upload */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={previewUrl}
                                        sx={{
                                            width: 110, height: 110,
                                            bgcolor: 'primary.main', fontSize: 44,
                                            cursor: 'pointer',
                                            border: '3px solid',
                                            borderColor: 'primary.light',
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {formData.username?.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            position: 'absolute', bottom: 4, right: 4,
                                            bgcolor: 'primary.main', borderRadius: '50%',
                                            width: 32, height: 32,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', border: '2px solid white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        }}
                                    >
                                        <PhotoCameraIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        onClick={(e) => { e.target.value = null; }}
                                    />
                                </Box>
                            </Box>

                            <Typography variant="caption" color="text.secondary"
                                sx={{ display: 'block', textAlign: 'center', mb: 3 }}>
                                Click on your avatar to upload a new photo
                            </Typography>

                            {imageFile && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    New photo selected: {imageFile.name}
                                </Alert>
                            )}

                            <TextField
                                fullWidth label="Username"
                                value={formData.username}
                                disabled margin="normal"
                                helperText="Username cannot be changed"
                            />

                            <TextField
                                fullWidth label="Bio" name="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                margin="normal" multiline rows={4}
                                placeholder="Tell us about yourself..."
                            />

                            <Button
                                fullWidth type="submit" variant="contained"
                                size="large" disabled={saving} sx={{ mt: 3 }}
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