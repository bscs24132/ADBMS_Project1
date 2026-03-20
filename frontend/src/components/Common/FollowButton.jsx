import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const FollowButton = ({ userId, username, onFollowChange }) => {
    const { user, isAuthenticated } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    // Move ALL hooks to the top before any conditionals
    useEffect(() => {
        if (userId && isAuthenticated && user?.id !== userId) {
            checkFollowStatus();
            fetchFollowersCount();
        }
    }, [userId, isAuthenticated, user?.id]);

    const checkFollowStatus = async () => {
        try {
            const response = await api.get(`/users/${userId}/followers`);
            const followers = response.data.followers || [];
            const following = followers.some(f => f.id === user?.id);
            setIsFollowing(following);
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const fetchFollowersCount = async () => {
        try {
            const response = await api.get(`/users/${userId}/followers`);
            setFollowersCount(response.data.followers_count || response.data.followers?.length || 0);
        } catch (error) {
            console.error('Error fetching followers count:', error);
        }
    };

    const handleFollow = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/users/${userId}/follow`);
            
            if (response.data.following) {
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            } else {
                setIsFollowing(false);
                setFollowersCount(prev => prev - 1);
            }
            
            if (onFollowChange) {
                onFollowChange(response.data.following);
            }
        } catch (error) {
            console.error('Error following/unfollowing:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't show follow button for yourself
    if (!userId || user?.id === userId) {
        return null;
    }

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            color={isFollowing ? "secondary" : "primary"}
            size="small"
            onClick={handleFollow}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : (isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />)}
            sx={{ minWidth: 100 }}
        >
            {loading ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
            {followersCount > 0 && ` (${followersCount})`}
        </Button>
    );
};

export default FollowButton;