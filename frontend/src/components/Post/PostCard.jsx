import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, CardHeader, CardContent, CardActions,
    Avatar, IconButton, Typography, Box, Divider,
    Collapse, TextField, Button, CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import CommentList from './CommentList';

const PostCard = ({ post, onLikeUpdate, onCommentAdded }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const postId = post.id;
    const authorId = post.author_id;
    const authorName = post.author_name || post.author?.username || 'Unknown';
    const authorAvatar = post.profile_picture || post.author?.profile_picture || '';
    const content = post.content;
    const image = post.image;
    const createdAt = post.created_at;

    const [liked, setLiked] = useState(post.is_liked_by_user || false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);
    const [commentCount, setCommentCount] = useState(post.comment_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        fetchPostStats();
        fetchLikeStatus();
    }, [postId, user?.id]);

    const fetchLikeStatus = async () => {
        try {
            const response = await api.get(`/posts/${postId}/likes/`);
            const data = response.data;
            setLikeCount(data.likes_count || 0);
            let userLiked = false;
            if (data.likes && Array.isArray(data.likes) && user) {
                userLiked = data.likes.some(like => like.id === user.id || like.user_id === user.id);
            }
            setLiked(userLiked);
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };

    const fetchPostStats = async () => {
        try {
            const likesResponse = await api.get(`/posts/${postId}/likes/`);
            const likesData = likesResponse.data;
            const likesCount = likesData.likes_count || likesData.likes?.length || 0;
            setLikeCount(likesCount);
            if (user) {
                if (likesData.likes) setLiked(likesData.likes.some(l => l.user_id === user.id));
                else if (likesData.is_liked !== undefined) setLiked(likesData.is_liked);
                else if (Array.isArray(likesData)) setLiked(likesData.some(l => l.user_id === user.id));
            }
            const commentsResponse = await api.get(`/posts/${postId}/comments/list/`);
            const commentsData = commentsResponse.data;
            setCommentCount(commentsData.comments?.length || commentsData.length || 0);
        } catch (error) {
            console.error('Error fetching post stats:', error);
        }
    };

    const handleProfileClick = () => { if (authorId) navigate(`/profile/${authorId}`); };

    const handleLike = async () => {
        try {
            const response = await api.post(`/posts/${postId}/like/`);
            if (response.data.liked) { setLiked(true); setLikeCount(prev => prev + 1); }
            else { setLiked(false); setLikeCount(prev => prev - 1); }
            if (onLikeUpdate) onLikeUpdate();
        } catch (error) { console.error('Like error:', error); }
    };

    const handleLoadComments = async () => {
        if (commentsLoaded) { setShowComments(!showComments); return; }
        setLoadingComments(true);
        try {
            const response = await api.get(`/posts/${postId}/comments/list`);
            let commentsData = response.data.comments || response.data || [];
            setCommentCount(commentsData.length);
            commentsData = commentsData.map(comment => {
                if (!comment.author && comment.user_id) {
                    return { ...comment, author: { id: comment.user_id, username: comment.author_name || 'User', profile_picture: comment.profile_picture } };
                }
                return comment;
            });
            setComments(commentsData);
            setCommentsLoaded(true);
            setShowComments(true);
        } catch (error) { console.error('Load comments error:', error); }
        finally { setLoadingComments(false); }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const response = await api.post(`/posts/${postId}/comments/`, { content: commentText });
            const newComment = response.data;
            newComment.author = { id: user?.id, username: user?.username, profile_picture: user?.profile_picture };
            newComment.author_name = user?.username;
            newComment.user_id = user?.id;
            setComments([newComment, ...comments]);
            setCommentCount(prev => prev + 1);
            setCommentText('');
            if (onCommentAdded) onCommentAdded();
        } catch (error) { console.error('Add comment error:', error); }
        finally { setSubmitting(false); }
    };

    return (
        <Card sx={{
            mb: 2.5,
            border: '1px solid #E8C99A',
            bgcolor: '#FFF8F0',
            borderRadius: 2,
            overflow: 'hidden',
            '&:hover': { boxShadow: '0 6px 20px rgba(45,1,0,0.12)' },
        }}>
            {/* Thin top accent */}
            <Box sx={{ height: 3, bgcolor: '#E6A341', opacity: 0.6 }} />

            <CardHeader
                avatar={
                    <Avatar
                        src={authorAvatar}
                        sx={{
                            cursor: 'pointer',
                            width: 42, height: 42,
                            bgcolor: '#8C0902',
                            border: '2px solid #E6A341',
                            color: '#FECE79',
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: 700,
                        }}
                        onClick={handleProfileClick}
                    >
                        {authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={
                    <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{
                            cursor: 'pointer', fontWeight: 700,
                            fontFamily: '"Playfair Display", serif',
                            color: '#2D0100', fontSize: '0.95rem',
                            '&:hover': { color: '#8C0902', textDecoration: 'underline' },
                        }}
                        onClick={handleProfileClick}
                    >
                        {authorName}
                    </Typography>
                }
                subheader={
                    <Typography variant="caption" sx={{
                        color: '#C4956A', fontFamily: '"Lato", sans-serif',
                        fontSize: '0.75rem', letterSpacing: '0.04em',
                    }}>
                        {createdAt ? new Date(createdAt).toLocaleString() : ''}
                    </Typography>
                }
                sx={{ pb: 1 }}
            />

            <CardContent sx={{ pt: 0, pb: 1 }}>
                <Typography variant="body1" sx={{
                    whiteSpace: 'pre-wrap', color: '#2D0100',
                    fontFamily: '"Lato", sans-serif', lineHeight: 1.7,
                    fontSize: '0.95rem',
                }}>
                    {content}
                </Typography>
                {image && (
                    <Box
                        component="img" src={image}
                        sx={{
                            mt: 2, maxWidth: '100%', borderRadius: 1,
                            border: '1px solid #E8C99A', cursor: 'pointer',
                        }}
                        alt="post"
                    />
                )}
            </CardContent>

            <Divider sx={{ borderColor: '#F0DEC4', mx: 2 }} />

            <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
                <IconButton
                    onClick={handleLike}
                    sx={{
                        color: liked ? '#8C0902' : '#C4956A',
                        '&:hover': { color: '#8C0902', bgcolor: 'rgba(140,9,2,0.08)' },
                    }}
                >
                    {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    <Typography variant="caption" sx={{
                        ml: 0.5, fontFamily: '"Lato", sans-serif',
                        fontWeight: 600, color: liked ? '#8C0902' : '#C4956A',
                    }}>
                        {likeCount}
                    </Typography>
                </IconButton>

                <IconButton
                    onClick={handleLoadComments}
                    sx={{
                        color: '#C4956A',
                        '&:hover': { color: '#8C0902', bgcolor: 'rgba(140,9,2,0.08)' },
                    }}
                >
                    <CommentIcon fontSize="small" />
                    <Typography variant="caption" sx={{
                        ml: 0.5, fontFamily: '"Lato", sans-serif',
                        fontWeight: 600, color: '#C4956A',
                    }}>
                        {commentCount}
                    </Typography>
                </IconButton>
            </CardActions>

            <Collapse in={showComments}>
                <Divider sx={{ borderColor: '#F0DEC4' }} />
                <Box sx={{ p: 2, bgcolor: 'rgba(253,246,236,0.6)' }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            fullWidth size="small"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={submitting}
                            multiline rows={1}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddComment}
                            disabled={!commentText.trim() || submitting}
                            sx={{ minWidth: 80, py: 0.8 }}
                        >
                            {submitting ? <CircularProgress size={18} /> : 'Post'}
                        </Button>
                    </Box>
                    {loadingComments ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} sx={{ color: '#E6A341' }} />
                        </Box>
                    ) : (
                        <CommentList comments={comments} />
                    )}
                </Box>
            </Collapse>
        </Card>
    );
};

export default PostCard;