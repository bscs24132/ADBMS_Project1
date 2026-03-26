import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import PostsFeed from '../../components/Post/PostsFeed';

const UserDashboard = () => {
    useEffect(() => {
        const savedPosition = sessionStorage.getItem('feedScrollPosition');
        if (savedPosition) {
            // Small delay to ensure content is loaded
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
                sessionStorage.removeItem('feedScrollPosition');
            }, 100);
        }
    }, []);

    return (
        <Layout>
            <Container maxWidth="md">
                <PostsFeed />
            </Container>
        </Layout>
    );
};

export default UserDashboard;