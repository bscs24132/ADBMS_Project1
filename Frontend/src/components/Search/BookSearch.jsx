import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    CircularProgress,
    Paper,
    InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BookIcon from '@mui/icons-material/Book';
import api from '../../api/axiosConfig';

const BookSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Debounce search
        const delayDebounce = setTimeout(() => {
            if (searchTerm.length >= 2) {
                performSearch();
            } else if (searchTerm.length === 0 && searchPerformed) {
                setBooks([]);
                setSearchPerformed(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/books?search=${encodeURIComponent(searchTerm)}`);
            const allBooks = response.data || [];
            // Filter approved books
            const approvedBooks = allBooks.filter(book => book.is_approved);
            setBooks(approvedBooks);
            setSearchPerformed(true);
        } catch (error) {
            console.error('Error searching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setBooks([]);
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
                    placeholder="Search books by title..."
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

            {!loading && searchPerformed && books.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No books found matching "{searchTerm}"
                </Typography>
            )}

            {books.length > 0 && (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
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
                                        height="160"
                                        image={book.cover_image}
                                        alt={book.title}
                                    />
                                ) : (
                                    <Box sx={{ height: 160, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                                    </Box>
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" noWrap>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        by {book.author_name || `Author ID: ${book.author_id}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {book.description?.substring(0, 100)}
                                        {book.description?.length > 100 ? '...' : ''}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Chip 
                                        label={`${book.coin_price} coins`} 
                                        color="primary" 
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
    );
};

export default BookSearch;