import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Avatar,
    Typography,
    Grid,
    Chip,
    Button,
    Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../../components/Layout/Layout';
import FollowButton from '../../components/Common/FollowButton';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import PostsFeed from '../../components/Post/PostsFeed';

const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const targetId = userId || currentUser?.id;
            const response = await api.get(`/users/${targetId}`);
            setProfile(response.data);
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Box sx={{ mt: 4 }}>
                        <Skeleton variant="circular" width={100} height={100} />
                        <Skeleton variant="text" width={200} height={40} />
                        <Skeleton variant="text" width={300} height={20} />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (error || !profile) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Typography color="error" sx={{ mt: 4 }}>
                        {error || 'User not found'}
                    </Typography>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                {/* Back button */}
                <Box sx={{ mb: 2 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate(-1)}
                        size="small"
                    >
                        Back
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={profile.profile_picture}
                                sx={{ width: 100, height: 100 }}
                            >
                                {profile.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="h4">
                                    {profile.username}
                                </Typography>
                                <Chip 
                                    label={profile.role === 'writer' ? '✍️ Writer' : '📚 Reader'}
                                    color={profile.role === 'writer' ? 'primary' : 'default'}
                                    size="small"
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                {profile.bio || 'No bio yet.'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Joined {new Date(profile.date_joined).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {!isOwnProfile && (
                                <FollowButton 
                                    userId={profile.id} 
                                    username={profile.username}
                                    onFollowChange={() => fetchProfile()}
                                />
                            )}
                            {isOwnProfile && (
                                <Button 
                                    variant="outlined" 
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Posts by {profile.username}
                </Typography>
                {/* Pass userId to show only this user's posts */}
                <PostsFeed userId={profile.id} />
            </Container>
        </Layout>
    );
};

export default ProfilePage;