import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostDialog from '../../components/Dialogs/CreatePostDialog';
import {
    Container, Box, Typography, Grid, Card, CardContent,
    Button, CircularProgress, Alert, Avatar, Paper, Tooltip,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Layout from '../../components/Layout/Layout';
import PostsFeed from '../../components/Post/PostsFeed';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [feedKey, setFeedKey] = useState(0);

    const [followedWriters, setFollowedWriters] = useState([]);
    const [selectedWriter, setSelectedWriter] = useState(null);

    useEffect(() => {
        const savedPosition = sessionStorage.getItem('feedScrollPosition');
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
                sessionStorage.removeItem('feedScrollPosition');
            }, 100);
        }
        if (user?.id) fetchFollowedWriters();
    }, [user]);

    const refreshFeed = () => {
        setFeedKey(prev => prev + 1);
        setSuccess('Post created successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const fetchFollowedWriters = async () => {
        try {
            const response = await api.get(`/users/${user.id}/following`);
            const following = response.data || [];
            const writers = following.filter(u => u.role === 'writer');
            setFollowedWriters(writers);
        } catch (err) {
            console.error('Failed to fetch followed writers:', err);
        }
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ py: 3 }}>
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                        👋 Welcome back, {user?.username}!
                    </Typography>

                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

                    {/* Quick Actions */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {user?.role !== 'admin' && (
                            <Grid item xs={6}>
                                <Card onClick={() => setPostDialogOpen(true)} sx={{
                                    cursor: 'pointer', borderRadius: 4,
                                    background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                                }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, p: 1.2, display: 'flex' }}>
                                            <AddIcon sx={{ fontSize: 28, color: 'white' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>New Post</Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Share your thoughts</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        <Grid item xs={user?.role !== 'admin' ? 6 : 12}>
                            <Card onClick={() => navigate('/groups')} sx={{
                                cursor: 'pointer', borderRadius: 4,
                                background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                            }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, p: 1.2, display: 'flex' }}>
                                        <GroupIcon sx={{ fontSize: 28, color: 'white' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>Groups</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Community chats</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Writer Avatars Strip */}
                    {followedWriters.length > 0 && (
                        <Paper sx={{
                            mb: 3, p: 2, borderRadius: 3,
                            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                            border: '1px solid', borderColor: 'primary.light',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <AutoStoriesIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="caption" color="primary.main" fontWeight={700} letterSpacing={0.5}>
                                    WRITERS YOU FOLLOW
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 0.5 }}>
                                <Box
                                    onClick={() => { setSelectedWriter(null); setFeedKey(k => k + 1); }}
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 56 }}
                                >
                                    <Avatar sx={{
                                        width: 52, height: 52, fontSize: 11, fontWeight: 700,
                                        bgcolor: selectedWriter === null ? 'primary.main' : 'grey.300',
                                        border: '3px solid',
                                        borderColor: selectedWriter === null ? 'primary.main' : 'transparent',
                                    }}>All</Avatar>
                                    <Typography variant="caption" sx={{
                                        mt: 0.5, fontSize: 10,
                                        fontWeight: selectedWriter === null ? 700 : 400,
                                        color: selectedWriter === null ? 'primary.main' : 'text.secondary',
                                    }}>All</Typography>
                                </Box>

                                {followedWriters.map(writer => (
                                    <Tooltip key={writer.id} title={`@${writer.username}`}>
                                        <Box
                                            onClick={() => { setSelectedWriter(writer); setFeedKey(k => k + 1); }}
                                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: 56 }}
                                        >
                                            <Avatar 
                                                src={writer.profile_picture} 
                                                sx={{
                                                    width: 52, height: 52,
                                                    border: '3px solid',
                                                    borderColor: selectedWriter?.id === writer.id ? 'primary.main' : 'transparent',
                                                    bgcolor: 'primary.light',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { transform: 'scale(1.08)' },
                                                }}
                                            >
                                                {writer.username?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Typography variant="caption" sx={{
                                                mt: 0.5, fontSize: 10, maxWidth: 56,
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                fontWeight: selectedWriter?.id === writer.id ? 700 : 400,
                                                color: selectedWriter?.id === writer.id ? 'primary.main' : 'text.secondary',
                                            }}>{writer.username}</Typography>
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </Paper>
                    )}

                    {/* Selected writer chip */}
                    {selectedWriter && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Showing posts in</Typography>
                            <Chip
                                avatar={<Avatar src={selectedWriter.profile_picture}>{selectedWriter.username?.charAt(0)}</Avatar>}
                                label={`@${selectedWriter.username}'s community`}
                                color="primary" size="small"
                                onDelete={() => { setSelectedWriter(null); setFeedKey(k => k + 1); }}
                            />
                        </Box>
                    )}

                    {/* Feed — Following only, no For You tab */}
                    <PostsFeed key={feedKey} userId={selectedWriter?.id || null} followingOnly={true} />
                </Box>
            </Container>

            {/* Create Post Dialog Component */}
            <CreatePostDialog
                open={postDialogOpen}
                onClose={() => setPostDialogOpen(false)}
                onPostCreated={refreshFeed}
            />
        </Layout>
    );
};

export default UserDashboard;