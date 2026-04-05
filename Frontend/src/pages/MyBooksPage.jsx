import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Button,
    CircularProgress,
    Paper,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyBooksPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPurchasedBooks();
    }, []);

    const fetchPurchasedBooks = async () => {
        setLoading(true);
        try {
            // Get all transactions to find purchased books
            const transactionsRes = await api.get('/wallet/transactions');
            const transactions = transactionsRes.data || [];
            
            // Get unique book IDs from transactions
            const bookIds = [...new Set(transactions.map(tx => tx.book_id))];
            
            if (bookIds.length === 0) {
                setBooks([]);
                setLoading(false);
                return;
            }
            
            // Fetch details for each purchased book
            const bookPromises = bookIds.map(bookId => 
                api.get(`/books/${bookId}`).catch(err => {
                    console.error(`Error fetching book ${bookId}:`, err);
                    return null;
                })
            );
            
            const bookResponses = await Promise.all(bookPromises);
            const purchasedBooks = bookResponses
                .filter(res => res && res.data)
                .map(res => res.data);
            
            setBooks(purchasedBooks);
        } catch (error) {
            console.error('Error fetching purchased books:', error);
            setError('Failed to load your books');
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            size="small"
                            sx={{ mr: 2 }}
                        >
                            Back
                        </Button>
                        <Typography variant="h4">
                            My Library
                        </Typography>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Books you've purchased and can read
                    </Typography>
                    
                    {error && (
                        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', mb: 3 }}>
                            <Typography>{error}</Typography>
                        </Paper>
                    )}
                    
                    {books.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <MenuBookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Your library is empty
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Purchase books to add them to your library
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 3 }}
                                onClick={() => navigate('/search')}
                            >
                                Browse Books
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {books.map((book) => (
                                <Grid item xs={12} sm={6} md={4} key={book.id}>
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
                                        onClick={() => navigate(`/books/${book.id}`)}
                                    >
                                        {book.cover_image ? (
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={book.cover_image}
                                                alt={book.title}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ 
                                                height: 180, 
                                                bgcolor: 'primary.light', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center' 
                                            }}>
                                                <MenuBookIcon sx={{ fontSize: 60, color: 'white' }} />
                                            </Box>
                                        )}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" noWrap>
                                                {book.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                by {book.author_username || `Author ID: ${book.author_id}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                                {book.description?.substring(0, 100)}
                                                {book.description?.length > 100 ? '...' : ''}
                                            </Typography>
                                            <Chip 
                                                icon={<MenuBookIcon />}
                                                label="In Library"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        </CardContent>
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

export default MyBooksPage;