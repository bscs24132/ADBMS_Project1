import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Paper,
    Chip,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const GroupChatsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await api.get('/groupchats');
            const allGroups = response.data || [];
            
            // Filter groups where user is a member
            const userGroups = [];
            
            for (const group of allGroups) {
                try {
                    const membersRes = await api.get(`/groupchats/${group.id}/members/`);
                    const members = membersRes.data || [];
                    const isMember = members.some(m => m.user_id === user?.id);
                    if (isMember) {
                        userGroups.push(group);
                    }
                } catch (err) {
                    console.error(`Error checking membership for group ${group.id}:`, err);
                }
            }
            
            setGroups(userGroups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError('Failed to load your groups');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            size="small"
                        >
                            Back
                        </Button>
                        <Typography variant="h4">
                            My Group Chats
                        </Typography>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Groups you've joined
                    </Typography>
                    
                    {error && (
                        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', mb: 3 }}>
                            <Typography>{error}</Typography>
                        </Paper>
                    )}
                    
                    {groups.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No groups yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Visit a writer's profile to join their group chats
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {groups.map((group) => (
                                <Grid item xs={12} sm={6} md={4} key={group.id}>
                                    <Card 
                                        sx={{ 
                                            cursor: 'pointer', 
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6,
                                            },
                                            borderRadius: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                        onClick={() => navigate(`/groupchats/${group.id}`)}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <GroupIcon color="primary" />
                                                <Typography variant="h6">
                                                    {group.name}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {group.description || 'No description'}
                                            </Typography>
                                            <Chip 
                                                label={`${group.member_count || 0} members`} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                            {group.created_by === user?.id && (
                                                <Chip 
                                                    label="Admin" 
                                                    size="small" 
                                                    color="primary" 
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button size="small" onClick={() => navigate(`/groupchats/${group.id}`)}>
                                                Open Chat
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Container>
        </Layout>
    );
};

export default GroupChatsPage;