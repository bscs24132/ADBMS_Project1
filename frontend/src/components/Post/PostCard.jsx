import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Box,
    Divider,
    Collapse,
    TextField,
    Button,
    CircularProgress,
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

    // Extract data based on backend format
    const postId = post.id;
    const authorId = post.author_id;
    const authorName = post.author_name || post.author?.username || 'Unknown';
    const authorAvatar = post.profile_picture || post.author?.profile_picture || '';
    const content = post.content;
    const image = post.image;
    const createdAt = post.created_at;
    
    // State for likes and comments
    const [liked, setLiked] = useState(post.is_liked_by_user || false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);
    const [commentCount, setCommentCount] = useState(post.comment_count || 0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    // Fetch initial like and comment counts if not provided
    // Fetch stats when postId changes or when post is updated via onLikeUpdate
useEffect(() => {
    fetchPostStats();
    fetchLikeStatus();
}, [postId, user?.id]); // Re-fetch when postId or user changes
const fetchLikeStatus = async () => {
    try {
        const response = await api.get(`/posts/${postId}/likes/`);
        const data = response.data;
        
        console.log('📊 LIKE STATUS RESPONSE:', data);
        
        // Get likes count
        const likesCount = data.likes_count || 0;
        setLikeCount(likesCount);
        
        // Check if current user liked this post
        let userLiked = false;
        
        // Check if likes array exists and has data
        if (data.likes && Array.isArray(data.likes) && user) {
            userLiked = data.likes.some(like => like.id === user.id || like.user_id === user.id);
            console.log('User ID:', user.id);
            console.log('Likes array:', data.likes);
            console.log('User liked:', userLiked);
        }
        
        setLiked(userLiked);
        
    } catch (error) {
        console.error('❌ Error fetching like status:', error);
    }
};
    const fetchPostStats = async () => {
    try {
        // Fetch like data
        const likesResponse = await api.get(`/posts/${postId}/likes/`);
        const likesData = likesResponse.data;
        
        // Get likes count
        const likesCount = likesData.likes_count || likesData.likes?.length || likesData.length || 0;
        setLikeCount(likesCount);
        
        // Check if current user liked this post
        if (user) {
            // If the response has a list of likes
            if (likesData.likes) {
                const userLiked = likesData.likes.some(like => like.user_id === user.id);
                setLiked(userLiked);
            } 
            // If the response has a direct is_liked field
            else if (likesData.is_liked !== undefined) {
                setLiked(likesData.is_liked);
            }
            // If the response is an array of likes
            else if (Array.isArray(likesData)) {
                const userLiked = likesData.some(like => like.user_id === user.id);
                setLiked(userLiked);
            }
        }
        
        // Fetch comment count
        const commentsResponse = await api.get(`/posts/${postId}/comments/list/`);
        const commentsData = commentsResponse.data;
        const commentsCount = commentsData.comments?.length || commentsData.length || 0;
        setCommentCount(commentsCount);
        
    } catch (error) {
        console.error('Error fetching post stats:', error);
    }
};

    const handleProfileClick = () => {
        if (authorId) {
            navigate(`/profile/${authorId}`);
        }
    };

    const handleLike = async () => {
    console.log('Like button clicked for post:', postId);
    console.log('Current liked state:', liked);
    
    try {
        const response = await api.post(`/posts/${postId}/like/`);
        console.log('Like API response:', response.data);
        
        if (response.data.liked) {
            setLiked(true);
            setLikeCount(prev => prev + 1);
        } else {
            setLiked(false);
            setLikeCount(prev => prev - 1);
        }
        if (onLikeUpdate) onLikeUpdate();
    } catch (error) {
        console.error('Like error:', error);
        console.error('Error response:', error.response);
    }
};

    const handleLoadComments = async () => {
        if (commentsLoaded) {
            setShowComments(!showComments);
            return;
        }
        
        setLoadingComments(true);
        try {
            const response = await api.get(`/posts/${postId}/comments/list`);
            let commentsData = response.data.comments || response.data || [];
            
            // Update comment count
            setCommentCount(commentsData.length);
            
            // Add author info to each comment (if missing)
            commentsData = commentsData.map(comment => {
                if (!comment.author && comment.user_id) {
                    return {
                        ...comment,
                        author: {
                            id: comment.user_id,
                            username: comment.author_name || 'User',
                            profile_picture: comment.profile_picture
                        }
                    };
                }
                return comment;
            });
            
            setComments(commentsData);
            setCommentsLoaded(true);
            setShowComments(true);
        } catch (error) {
            console.error('Load comments error:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        
        setSubmitting(true);
        try {
            const response = await api.post(`/posts/${postId}/comments/`, {
                content: commentText
            });
            
            const newComment = response.data;
            
            // Add author info to new comment
            newComment.author = {
                id: user?.id,
                username: user?.username,
                profile_picture: user?.profile_picture
            };
            newComment.author_name = user?.username;
            newComment.user_id = user?.id;
            
            setComments([newComment, ...comments]);
            setCommentCount(prev => prev + 1);
            setCommentText('');
            
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error('Add comment error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader
                avatar={
                    <Avatar 
                        src={authorAvatar}
                        sx={{ cursor: 'pointer' }}
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
                            cursor: 'pointer', 
                            '&:hover': { textDecoration: 'underline', color: 'primary.main' } 
                        }}
                        onClick={handleProfileClick}
                    >
                        {authorName}
                    </Typography>
                }
                subheader={createdAt ? new Date(createdAt).toLocaleString() : ''}
            />
            
            <CardContent>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {content}
                </Typography>
                {image && (
                    <Box 
                        component="img" 
                        src={image} 
                        sx={{ mt: 2, maxWidth: '100%', borderRadius: 2, cursor: 'pointer' }} 
                        alt="post"
                    />
                )}
            </CardContent>
            
            <CardActions disableSpacing>
                <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {likeCount}
                    </Typography>
                </IconButton>
                
                <IconButton onClick={handleLoadComments}>
                    <CommentIcon />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {commentCount}
                    </Typography>
                </IconButton>
            </CardActions>
            
            <Collapse in={showComments}>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={submitting}
                            multiline
                            rows={1}
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleAddComment}
                            disabled={!commentText.trim() || submitting}
                            sx={{ minWidth: 80 }}
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Post'}
                        </Button>
                    </Box>
                    
                    {/* Comments List */}
                    {loadingComments ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
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