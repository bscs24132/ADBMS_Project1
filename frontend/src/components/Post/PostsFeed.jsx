import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Chip, Divider } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../api/axiosConfig';
import PostCard from './PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const PostsFeed = ({ userId = null }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [authorCache, setAuthorCache] = useState({});
    const [totalCount, setTotalCount] = useState(0);

    const fetchAuthorDetails = async (authorId) => {
        if (authorCache[authorId]) return authorCache[authorId];
        try {
            const response = await api.get(`/users/${authorId}`);
            const authorData = {
                id: authorId,
                username: response.data.username,
                profile_picture: response.data.profile_picture,
                role: response.data.role,
            };
            setAuthorCache(prev => ({ ...prev, [authorId]: authorData }));
            return authorData;
        } catch {
            return { id: authorId, username: 'Unknown User', profile_picture: null, role: 'user' };
        }
    };

    const enrichPostsWithAuthors = async (posts) => {
        return Promise.all(
            posts.map(async (post) => {
                const author = await fetchAuthorDetails(post.author_id);
                return {
                    ...post,
                    author,
                    author_name: author.username,
                    profile_picture: author.profile_picture,
                };
            })
        );
    };

    const fetchPosts = useCallback(async (pageNum = 1) => {
        try {
            let data = [];

            if (userId) {
                // Profile page — specific user's posts
                const res = await api.get(`/users/${userId}/posts?page=${pageNum}&page_size=10`);
                data = res.data.results || res.data;
                setTotalCount(res.data.count || data.length);
            } else {
                // Dashboard — following feed only, no For You
                const res = await api.get(`/posts/feed/following?page=${pageNum}&page_size=10`);
                data = res.data.results || res.data;
                setTotalCount(res.data.count || data.length);
            }

            const enriched = await enrichPostsWithAuthors(data);

            if (pageNum === 1) {
                setPosts(enriched);
            } else {
                setPosts(prev => [...prev, ...enriched]);
            }

            setHasMore(data.length === 10);
        } catch (err) {
            console.error('Feed error:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId]);

    useEffect(() => {
        setLoading(true);
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchPosts(1);
    }, [userId, fetchPosts]);

    useEffect(() => {
        if (page > 1) {
            setLoadingMore(true);
            fetchPosts(page);
        }
    }, [page]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 600 &&
                hasMore && !loadingMore && !loading
            ) {
                setPage(prev => prev + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore, loading]);

    if (loading && page === 1) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    // ── Profile page view ──
    if (userId) {
        if (posts.length === 0) {
            return (
                <Box sx={{
                    textAlign: 'center', py: 8,
                    border: '2px dashed', borderColor: 'divider',
                    borderRadius: 3,
                }}>
                    <AutoStoriesIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                        No posts yet.
                    </Typography>
                </Box>
            );
        }
        return (
            <Box>
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onLikeUpdate={() => fetchPosts(1)} />
                ))}
                {loadingMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                )}
            </Box>
        );
    }

    // ── Dashboard feed — Following only ──
    return (
        <Box>
            {/* Feed header */}
            <Box sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', mb: 2,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        Feed
                    </Typography>
                </Box>
                {posts.length > 0 && (
                    <Chip
                        label={`${posts.length} post${posts.length !== 1 ? 's' : ''}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: 11 }}
                    />
                )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {posts.length === 0 ? (
                /* Empty state */
                <Box sx={{
                    textAlign: 'center', py: 8,
                    border: '2px dashed', borderColor: 'divider',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                }}>
                    <AutoStoriesIcon sx={{ fontSize: 56, color: 'primary.light', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        Your feed is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 320, mx: 'auto' }}>
                        Follow some writers to see their posts here. Use Search to discover authors you love.
                    </Typography>
                </Box>
            ) : (
                <>
                    {posts.map((post, index) => (
                        <Box
                            key={post.id}
                            sx={{
                                animation: 'fadeSlideIn 0.3s ease forwards',
                                animationDelay: `${Math.min(index, 5) * 0.05}s`,
                                opacity: 0,
                                '@keyframes fadeSlideIn': {
                                    from: { opacity: 0, transform: 'translateY(12px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <PostCard
                                post={post}
                                onLikeUpdate={() => fetchPosts(1)}
                            />
                        </Box>
                    ))}

                    {loadingMore && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Divider sx={{ mb: 2 }}>
                                <Chip
                                    label="You're all caught up ✨"
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                />
                            </Divider>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default PostsFeed;