import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import api from '../../api/axiosConfig';

const CreatePostDialog = ({ open, onClose, onPostCreated }) => {
    const [postContent, setPostContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleCreatePost = async () => {
        if (!postContent.trim()) return;
        setSubmitting(true);
        setError('');
        
        try {
            const postData = {
                content: postContent,
                image: imageUrl || null
            };
            
            await api.post('/posts/', postData);
            
            setPostContent('');
            setImageUrl('');
            onClose();
            if (onPostCreated) onPostCreated();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setPostContent('');
        setImageUrl('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    sx={{ mb: 2 }}
                    disabled={submitting}
                />
                
                <TextField
                    fullWidth
                    label="Image URL (optional)"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={submitting}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ImageIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    helperText="Enter a direct link to an image"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCreatePost}
                    disabled={submitting || !postContent.trim()}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Post'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePostDialog;