import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import api from '../../api/axiosConfig';
import PostCard from './PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const PostsFeed = ({ userId = null }) => {
    const [followedPosts, setFollowedPosts] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMoreFollowed, setHasMoreFollowed] = useState(true);
    const [hasMoreOther, setHasMoreOther] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showingFollowed, setShowingFollowed] = useState(true);
    const [authorCache, setAuthorCache] = useState({});

    // Fetch author details by ID
    const fetchAuthorDetails = async (authorId) => {
        if (authorCache[authorId]) return authorCache[authorId];
        
        try {
            const response = await api.get(`/users/${authorId}`);
            const authorData = {
                id: authorId,
                username: response.data.username,
                profile_picture: response.data.profile_picture,
                role: response.data.role
            };
            setAuthorCache(prev => ({ ...prev, [authorId]: authorData }));
            return authorData;
        } catch (error) {
            console.error('Error fetching author:', error);
            return {
                id: authorId,
                username: 'Unknown User',
                profile_picture: null,
                role: 'user'
            };
        }
    };

    // Enrich posts with author details
    const enrichPostsWithAuthors = async (posts) => {
    const enriched = await Promise.all(
        posts.map(async (post) => {
            const author = await fetchAuthorDetails(post.author_id);
            return {
                ...post,  // This preserves all original fields including like_count and comment_count
                author: author,
                author_name: author.username,
                profile_picture: author.profile_picture
            };
        })
    );
    return enriched;
};

    useEffect(() => {
        fetchPosts();
    }, [page, userId]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('access_token');
            
            // If userId is provided (profile page), fetch only that user's posts
            if (userId) {
                const response = await api.get(`/users/${userId}/posts?page=${page}&page_size=10`);
                let data = response.data.results || response.data;
                
                // Enrich with author details
                const enrichedPosts = await enrichPostsWithAuthors(data);
                
                if (page === 1) {
                    setOtherPosts(enrichedPosts);
                } else {
                    setOtherPosts(prev => [...prev, ...enrichedPosts]);
                }
                setHasMoreOther(data.length === 10);
                setLoading(false);
                setLoadingMore(false);
                return;
            }
            
            // Normal feed for dashboard
            if (token) {
                // Fetch followed users' posts
                const followedResponse = await api.get(`/posts/feed/following?page=${page}&page_size=10`);
                let followedData = followedResponse.data.results || followedResponse.data;
                const enrichedFollowed = await enrichPostsWithAuthors(followedData);
                
                if (page === 1) {
                    setFollowedPosts(enrichedFollowed);
                } else {
                    setFollowedPosts(prev => [...prev, ...enrichedFollowed]);
                }
                setHasMoreFollowed(followedData.length === 10);
                
                // Fetch posts from other writers
                const otherResponse = await api.get(`/posts?page=${page}&page_size=10&exclude_followed=true`);
                let otherData = otherResponse.data.results || otherResponse.data;
                const enrichedOther = await enrichPostsWithAuthors(otherData);
                
                if (page === 1) {
                    setOtherPosts(enrichedOther);
                } else {
                    setOtherPosts(prev => [...prev, ...enrichedOther]);
                }
                setHasMoreOther(otherData.length === 10);
            } else {
                // Guest user
                const response = await api.get(`/posts?page=${page}&page_size=10`);
                let data = response.data.results || response.data;
                const enrichedPosts = await enrichPostsWithAuthors(data);
                setOtherPosts(enrichedPosts);
                setHasMoreOther(data.length === 10);
            }
        } catch (err) {
            console.error('Feed error:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (userId) {
            if (hasMoreOther && !loadingMore) {
                setLoadingMore(true);
                setPage(prev => prev + 1);
            }
        } else if (showingFollowed && hasMoreFollowed && !loadingMore) {
            setLoadingMore(true);
            setPage(prev => prev + 1);
        } else if (!showingFollowed && hasMoreOther && !loadingMore) {
            setLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= 
                document.documentElement.offsetHeight - 500) {
                loadMore();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMoreFollowed, hasMoreOther, loadingMore, showingFollowed, userId]);

    if (loading && page === 1) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    // Profile page view
    if (userId) {
        if (otherPosts.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        No posts yet.
                    </Typography>
                </Box>
            );
        }
        
        return (
            <Box>
                {otherPosts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onLikeUpdate={() => fetchPosts()}
                    />
                ))}
                
                {loadingMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        );
    }

    // Dashboard view with tabs
    const token = localStorage.getItem('access_token');
    const currentPosts = showingFollowed ? followedPosts : otherPosts;
    const hasMore = showingFollowed ? hasMoreFollowed : hasMoreOther;

    if (!token) {
        // Guest view
        return (
            <Box>
                {otherPosts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onLikeUpdate={() => fetchPosts()}
                    />
                ))}
                
                {loadingMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box>
            {/* Tab Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    variant="h6"
                    sx={{
                        cursor: 'pointer',
                        pb: 1,
                        borderBottom: showingFollowed ? 2 : 0,
                        borderColor: 'primary.main',
                        color: showingFollowed ? 'primary.main' : 'text.secondary',
                    }}
                    onClick={() => setShowingFollowed(true)}
                >
                    Following ({followedPosts.length})
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        cursor: 'pointer',
                        pb: 1,
                        borderBottom: !showingFollowed ? 2 : 0,
                        borderColor: 'primary.main',
                        color: !showingFollowed ? 'primary.main' : 'text.secondary',
                    }}
                    onClick={() => setShowingFollowed(false)}
                >
                    For You ({otherPosts.length})
                </Typography>
            </Box>

            {/* Posts Display */}
            {currentPosts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        {showingFollowed 
                            ? "You're not following anyone yet! Check out the 'For You' tab to find writers to follow."
                            : "No posts available. Check back later!"}
                    </Typography>
                </Box>
            ) : (
                <>
                    {currentPosts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onLikeUpdate={() => fetchPosts()}
                        />
                    ))}
                </>
            )}
            
            {loadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default PostsFeed;