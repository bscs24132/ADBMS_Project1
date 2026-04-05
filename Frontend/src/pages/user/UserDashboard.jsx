import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Grid, Card, CardContent,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, Alert, Avatar, Paper, Tooltip,
    IconButton, MenuItem, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Layout from '../../components/Layout/Layout';
import PostsFeed from '../../components/Post/PostsFeed';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [postDialog, setPostDialog] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);   // actual File object
    const [imagePreview, setImagePreview] = useState('');
    const [selectedWriterForPost, setSelectedWriterForPost] = useState('');
    const [submitting, setSubmitting] = useState(false);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPostImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleCreatePost = async () => {
        if (!postContent.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            // Use FormData so the image is sent as multipart (file upload)
            const formData = new FormData();
            formData.append('content', postContent);
            if (postImageFile) formData.append('image', postImageFile);
            if (selectedWriterForPost) formData.append('writer_id', selectedWriterForPost);

            await api.post('/posts/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setPostContent('');
            setPostImageFile(null);
            setImagePreview('');
            setSelectedWriterForPost('');
            setPostDialog(false);
            setSuccess('Post created!');
            setTimeout(() => setSuccess(''), 3000);
            setFeedKey(prev => prev + 1);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    const closePostDialog = () => {
        setPostDialog(false);
        setImagePreview('');
        setPostImageFile(null);
        setSelectedWriterForPost('');
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
                                <Card onClick={() => setPostDialog(true)} sx={{
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
                                            <Avatar src={writer.profile_picture} sx={{
                                                width: 52, height: 52,
                                                border: '3px solid',
                                                borderColor: selectedWriter?.id === writer.id ? 'primary.main' : 'transparent',
                                                bgcolor: 'primary.light',
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'scale(1.08)' },
                                            }}>
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

            {/* Create Post Dialog */}
            <Dialog open={postDialog} onClose={closePostDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight={700}>Create New Post</Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth multiline rows={4}
                        label="What's on your mind?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        sx={{ mt: 1, mb: 2 }} autoFocus
                    />

                    {followedWriters.length > 0 && (
                        <TextField
                            fullWidth select
                            label="Post in which writer's community? (optional)"
                            value={selectedWriterForPost}
                            onChange={(e) => setSelectedWriterForPost(e.target.value)}
                            sx={{ mb: 2 }}
                            helperText="Leave empty to post on general feed"
                        >
                            <MenuItem value="">General Feed (no specific writer)</MenuItem>
                            {followedWriters.map(w => (
                                <MenuItem key={w.id} value={w.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar src={w.profile_picture} sx={{ width: 24, height: 24, fontSize: 12 }}>
                                            {w.username?.charAt(0)}
                                        </Avatar>
                                        @{w.username}'s community
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    {/* Image Upload — sends as File, not base64 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="post-image-upload"
                            type="file"
                            onChange={handleImageChange}
                            // Reset value so same file can be re-selected
                            onClick={(e) => { e.target.value = null; }}
                        />
                        <label htmlFor="post-image-upload">
                            <Button component="span" variant="outlined" startIcon={<ImageIcon />} size="small">
                                Add Photo
                            </Button>
                        </label>
                        {imagePreview && (
                            <Typography variant="caption" color="success.main" fontWeight={600}>✓ Image selected</Typography>
                        )}
                    </Box>

                    {imagePreview && (
                        <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                            <Box
                                component="img"
                                src={imagePreview}
                                sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 2, display: 'block' }}
                                alt="preview"
                            />
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute', top: 4, right: 4,
                                    bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                }}
                                onClick={() => { setImagePreview(''); setPostImageFile(null); }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closePostDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreatePost}
                        disabled={submitting || !postContent.trim()}
                    >
                        {submitting ? <CircularProgress size={20} /> : 'Post'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default UserDashboard;