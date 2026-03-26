import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    Paper,
    Avatar,
    Typography,
    Chip,
    CircularProgress,
    InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../../api/axiosConfig';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.length >= 2) {
                performSearch();
            } else if (searchTerm.length === 0 && searchPerformed) {
                setUsers([]);
                setSearchPerformed(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const performSearch = async () => {
    setLoading(true);
    try {
        // Use the new search endpoint
        const response = await api.get(`/users/search/?search=${encodeURIComponent(searchTerm)}`);
        setUsers(response.data || []);
        setSearchPerformed(true);
    } catch (error) {
        console.error('Error searching users:', error);
    } finally {
        setLoading(false);
    }
};

    const handleClear = () => {
        setSearchTerm('');
        setUsers([]);
        setSearchPerformed(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}
                onSubmit={(e) => e.preventDefault()}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search users by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <IconButton onClick={handleClear} size="small">
                        <ClearIcon />
                    </IconButton>
                )}
                <IconButton onClick={performSearch} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                </IconButton>
            </Paper>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && searchPerformed && users.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No users found matching "{searchTerm}"
                </Typography>
            )}

            {users.length > 0 && (
                <Grid container spacing={2}>
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Paper 
                                sx={{ 
                                    p: 2, 
                                    cursor: 'pointer', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                                }}
                                onClick={() => navigate(`/profile/${user.id}`)}
                            >
                                <Avatar src={user.profile_picture} sx={{ width: 50, height: 50 }}>
                                    {user.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6">
                                        {user.username}
                                    </Typography>
                                    <Chip 
                                        label={user.role === 'writer' ? '✍️ Writer' : '📚 Reader'}
                                        size="small"
                                        color={user.role === 'writer' ? 'primary' : 'default'}
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default UserSearch;