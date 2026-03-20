import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import PostsFeed from '../../components/Post/PostsFeed';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Welcome back, {user?.username}! 📖
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's what's happening in your feed
                        </Typography>
                    </Box>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/profile')}
                    >
                        View Profile
                    </Button>
                </Box>
                
                <PostsFeed />
            </Container>
        </Layout>
    );
};

export default UserDashboard;