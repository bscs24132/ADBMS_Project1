import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Divider } from '@mui/material';

const CommentList = ({ comments }) => {
    const navigate = useNavigate();

    const handleProfileClick = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    if (!comments || comments.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" align="center">
                No comments yet. Be the first to comment!
            </Typography>
        );
    }

    return (
        <Box>
            {comments.map((comment, index) => {
                // Handle both formats: author object or separate fields
                const userId = comment.author_id || comment.user_id || comment.author?.id;
                const username = comment.author_name || comment.author?.username || comment.username || 'User';
                const avatar = comment.profile_picture || comment.author?.profile_picture;
                const content = comment.content;
                const createdAt = comment.created_at;

                return (
                    <Box key={comment.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar 
                                src={avatar}
                                sx={{ width: 32, height: 32, cursor: 'pointer' }}
                                onClick={() => handleProfileClick(userId)}
                            >
                                {username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline', color: 'primary.main' }
                                    }}
                                    onClick={() => handleProfileClick(userId)}
                                >
                                    {username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {createdAt ? new Date(createdAt).toLocaleString() : ''}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {content}
                                </Typography>
                            </Box>
                        </Box>
                        {index < comments.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                );
            })}
        </Box>
    );
};

export default CommentList;