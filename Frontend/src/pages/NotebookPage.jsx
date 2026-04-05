import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Divider,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const NotebookPage = () => {
    const { notebookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notebook, setNotebook] = useState(null);
    const [writings, setWritings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotebookData();
    }, [notebookId]);

    const fetchNotebookData = async () => {
        setLoading(true);
        try {
            // Fetch notebook details
            const notebookRes = await api.get(`/notebooks/${notebookId}`);
            setNotebook(notebookRes.data);
            
            // Fetch posts for this notebook
            const postsRes = await api.get(`/posts/notebooks/${notebookId}/posts/`);
            setWritings(postsRes.data || []);
        } catch (error) {
            console.error('Error fetching notebook:', error);
            setError('Failed to load notebook');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
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

    if (error || !notebook) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Typography color="error" sx={{ mt: 4 }}>
                        {error || 'Notebook not found'}
                    </Typography>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        size="small"
                        sx={{ mb: 3 }}
                    >
                        Back
                    </Button>

                    {/* Notebook Header */}
                    <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Typography variant="h4">
                                {notebook.title}
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {notebook.description || 'No description available.'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Chip
                                label={`${writings.length} writings`}
                                size="small"
                                color="primary"
                            />
                            {notebook.created_at && (
                                <Chip
                                    label={`Created: ${formatDate(notebook.created_at)}`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Paper>

                    {/* Writings Section */}
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Writings
                    </Typography>
                    
                    {writings.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No writings in this notebook yet.
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {writings.map((writing) => (
                                <Grid item xs={12} key={writing.id}>
                                    <Card 
                                        sx={{ 
                                            borderRadius: 2,
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {writing.content}
                                            </Typography>
                                            {writing.image && (
                                                <Box 
                                                    component="img" 
                                                    src={writing.image} 
                                                    sx={{ mt: 2, maxWidth: '100%', borderRadius: 2 }} 
                                                    alt="writing"
                                                />
                                            )}
                                        </CardContent>
                                        <Divider />
                                        <Box sx={{ p: 2 }}>
                                            <Chip 
                                                label={formatDate(writing.created_at)} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        </Box>
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

export default NotebookPage;