import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const BookDetailsPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState('');
    const [purchaseSuccess, setPurchaseSuccess] = useState('');
    const [balance, setBalance] = useState(0);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [checkingPurchase, setCheckingPurchase] = useState(true);

    useEffect(() => {
        fetchBookDetails();
        fetchWalletBalance();
        checkIfPurchased();
    }, [bookId]);

    const fetchBookDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/books/${bookId}`);
            setBook(response.data);
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const response = await api.get('/wallet');
            setBalance(response.data.coin_balance || 0);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const checkIfPurchased = async () => {
        setCheckingPurchase(true);
        try {
            const response = await api.get('/wallet/transactions');
            const transactions = response.data || [];
            const purchased = transactions.some(tx => tx.book_id === parseInt(bookId));
            setHasPurchased(purchased);
        } catch (error) {
            console.error('Error checking purchase status:', error);
            setHasPurchased(false);
        } finally {
            setCheckingPurchase(false);
        }
    };

    const handlePurchase = async () => {
        setPurchasing(true);
        setPurchaseError('');
        setPurchaseSuccess('');

        try {
            const response = await api.post(`/books/${bookId}/purchase/`);
            setPurchaseSuccess(`Successfully purchased "${book.title}"!`);
            setBalance(response.data.remaining_balance);
            setHasPurchased(true);
            fetchWalletBalance();
        } catch (error) {
            setPurchaseError(error.response?.data?.error || 'Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading || checkingPurchase) {
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

    if (!book) {
        return (
            <Layout>
                <Container maxWidth="lg">
                    <Typography color="error" sx={{ mt: 4 }}>
                        Book not found
                    </Typography>
                </Container>
            </Layout>
        );
    }

    const hasEnoughCoins = balance >= book.coin_price;
    const isOwnBook = book.author_id === user?.id;

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

                    <Grid container spacing={4}>
                        {/* Book Cover Section */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'grey.50',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 400,
                                }}
                            >
                                {book.cover_image ? (
                                    <img
                                        src={book.cover_image}
                                        alt={book.title}
                                        style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h1" sx={{ fontSize: 100, mb: 2 }}>
                                            📚
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            No cover image
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Book Details Section */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 4, borderRadius: 3 }}>
                                <Typography variant="h4" gutterBottom>
                                    {book.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={`By ${book.author_username || `Author ID: ${book.author_id}`}`}
                                        variant="outlined"
                                    />
                                    {!hasPurchased && !isOwnBook && (
                                        <Chip
                                            label={`${book.coin_price} coins`}
                                            color="primary"
                                        />
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>
                                    Description
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {book.description || 'No description available.'}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {/* If user already purchased, show book content */}
                                {hasPurchased && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Content
                                        </Typography>
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 3, 
                                                bgcolor: 'grey.50',
                                                maxHeight: 500,
                                                overflow: 'auto',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                fontSize: '1rem',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {book.content || 'No content available for this book.'}
                                        </Paper>
                                    </Box>
                                )}

                                {/* Purchase Section - Only show if not purchased and not own book */}
                                {!hasPurchased && !isOwnBook && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AccountBalanceWalletIcon color="primary" />
                                                    <Typography variant="body1">
                                                        Your balance: <strong>{balance} coins</strong>
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {hasEnoughCoins
                                                        ? `You have enough coins to purchase this book!`
                                                        : `Need ${book.coin_price - balance} more coins`}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={handlePurchase}
                                                    disabled={purchasing || !hasEnoughCoins}
                                                    sx={{ minWidth: 200 }}
                                                >
                                                    {purchasing ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        `Buy for ${book.coin_price} coins`
                                                    )}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {isOwnBook && !hasPurchased && (
                                    <Alert severity="info" sx={{ mt: 3 }}>
                                        You are the author of this book.
                                    </Alert>
                                )}

                                {purchaseError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {purchaseError}
                                    </Alert>
                                )}

                                {purchaseSuccess && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        {purchaseSuccess}
                                    </Alert>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Layout>
    );
};

export default BookDetailsPage;