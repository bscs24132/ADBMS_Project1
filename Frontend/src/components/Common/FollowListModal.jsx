import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const FollowListModal = ({ open, onClose, userId, title }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && userId) {
            fetchUsers();
        }
    }, [open, userId]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const endpoint = title === 'Followers' 
                ? `/users/${userId}/followers` 
                : `/users/${userId}/following`;
            const response = await api.get(endpoint);
            setUsers(response.data.followers || response.data.following || response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (userId) => {
        onClose();
        navigate(`/profile/${userId}`);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {title}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : users.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                        No {title.toLowerCase()} yet.
                    </Typography>
                ) : (
                    <List>
                        {users.map((user) => (
                            <ListItem
                                key={user.id}
                                button
                                onClick={() => handleUserClick(user.id)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={user.profile_picture}>
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.role === 'writer' ? '✍️ Writer' : '📚 Reader'}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FollowListModal;