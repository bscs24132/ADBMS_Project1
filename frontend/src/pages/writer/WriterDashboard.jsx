import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Grid, Card, CardContent,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress, Chip, Paper,
    Tab, Tabs, Alert, MenuItem,
} from '@mui/material';
import CreatePostDialog from '../../components/Dialogs/CreatePostDialog';
import AddIcon from '@mui/icons-material/Add';
import BookIcon from '@mui/icons-material/MenuBook';
import EditIcon from '@mui/icons-material/Edit';
import NotebookIcon from '@mui/icons-material/LibraryBooks';
import PostIcon from '@mui/icons-material/Article';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import Layout from '../../components/Layout/Layout';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6c5ce7', '#00b894', '#fdcb6e', '#d63031', '#0984e3', '#e17055'];

const WriterDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);

    const [posts, setPosts] = useState([]);
    const [books, setBooks] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Dialog states
    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const [bookDialog, setBookDialog] = useState(false);
    const [notebookDialog, setNotebookDialog] = useState(false);
    const [writingDialog, setWritingDialog] = useState(false);
    const [selectedNotebook, setSelectedNotebook] = useState(null);

    const [bookForm, setBookForm] = useState({ title: '', description: '', content: '', coin_price: 0, cover_image: '' });
    const [notebookForm, setNotebookForm] = useState({ title: '', description: '' });
    const [writingContent, setWritingContent] = useState('');
    const [writingImageUrl, setWritingImageUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        fetchAllData();
    }, [user]);

    const fetchAllData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [postsRes, booksRes, notebooksRes] = await Promise.all([
                api.get(`/users/${user.id}/posts/`),
                api.get(`/books/writer/${user.id}/`),
                api.get(`/notebooks/writer/${user.id}/`),
            ]);
            const fetchedPosts = postsRes.data || [];
            const fetchedBooks = booksRes.data || [];
            setPosts(fetchedPosts);
            setBooks(fetchedBooks);
            setNotebooks(notebooksRes.data || []);

            // Build transactions/sales data from books
            const approvedBooks = fetchedBooks.filter(b => b.is_approved);
            const txData = approvedBooks.map(book => ({
                book_id: book.id,
                title: book.title,
                sales: book.no_of_sales || 0,
                revenue: book.total_revenue || 0,
                coin_price: book.coin_price,
            }));
            setTransactions(txData);

            // Fetch likes/comments for posts
            let likes = 0;
            let comments = 0;
            await Promise.all(
                fetchedPosts.slice(0, 10).map(async (post) => {
                    try {
                        const likesRes = await api.get(`/posts/${post.id}/likes/`);
                        likes += likesRes.data.likes_count || likesRes.data.likes?.length || 0;
                        const commentsRes = await api.get(`/posts/${post.id}/comments/list/`);
                        const cd = commentsRes.data.comments || commentsRes.data || [];
                        comments += Array.isArray(cd) ? cd.length : 0;
                    } catch (e) {}
                })
            );
            setTotalLikes(likes);
            setTotalComments(comments);
        } catch (err) {
            setError('Failed to load your data');
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(''), 3000);
    };

    const refreshPosts = () => {
        fetchAllData();
        showSuccess('Post created successfully!');
    };

    const handleUploadBook = async () => {
        if (!bookForm.title.trim() || !bookForm.content.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/books/', { ...bookForm, coin_price: parseInt(bookForm.coin_price) || 0 });
            setBookForm({ title: '', description: '', content: '', coin_price: 0, cover_image: '' });
            setBookDialog(false);
            showSuccess('Book uploaded! Waiting for admin approval.');
            fetchAllData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload book');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateNotebook = async () => {
        if (!notebookForm.title.trim()) return;
        setSubmitting(true);
        try {
            await api.post('/notebooks/', notebookForm);
            setNotebookForm({ title: '', description: '' });
            setNotebookDialog(false);
            showSuccess('Notebook created successfully!');
            fetchAllData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create notebook');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePostWriting = async () => {
        if (!writingContent.trim() || !selectedNotebook) return;
        setSubmitting(true);
        try {
            await api.post(`/notebooks/${selectedNotebook.id}/posts`, { 
                content: writingContent,
                image: writingImageUrl || null
            });
            setWritingContent('');
            setWritingImageUrl('');
            setWritingDialog(false);
            setSelectedNotebook(null);
            showSuccess('Writing posted to notebook!');
            fetchAllData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post writing');
        } finally {
            setSubmitting(false);
        }
    };

    const approvedBooks = books.filter(b => b.is_approved);
    const pendingBooks = books.filter(b => !b.is_approved);
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.revenue || 0), 0);
    const totalSales = transactions.reduce((sum, t) => sum + (t.sales || 0), 0);
    const bestSellers = [...transactions].sort((a, b) => b.sales - a.sales).slice(0, 5);
    const salesByBook = transactions.map(t => ({
        name: t.title.length > 15 ? t.title.substring(0, 15) + '...' : t.title,
        sales: t.sales,
        revenue: t.revenue,
    }));
    const bookStatusData = [
        { name: 'Approved', value: approvedBooks.length },
        { name: 'Pending', value: pendingBooks.length },
    ].filter(d => d.value > 0);
    const contentPieData = [
        { name: 'Posts', value: posts.length },
        { name: 'Books', value: books.length },
        { name: 'Notebooks', value: notebooks.length },
    ].filter(d => d.value > 0);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={600}>✍️ Writer Dashboard</Typography>
                        <Typography variant="body1" color="text.secondary">Welcome back, {user?.username}!</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    {/* Quick Stats */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                            { label: 'Total Posts', value: posts.length, icon: <PostIcon />, color: '#6c5ce7' },
                            { label: 'Total Books', value: books.length, icon: <BookIcon />, color: '#00b894' },
                            { label: 'Notebooks', value: notebooks.length, icon: <NotebookIcon />, color: '#fdcb6e' },
                            { label: 'Total Sales', value: totalSales, icon: <MonetizationOnIcon />, color: '#0984e3' },
                            { label: 'Total Revenue', value: `${totalRevenue} coins`, icon: <TrendingUpIcon />, color: '#e17055' },
                            { label: 'Total Likes', value: totalLikes, icon: <FavoriteIcon />, color: '#d63031' },
                        ].map((stat, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                                        <Typography variant="h5" fontWeight={700} color={stat.color}>{stat.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Action Buttons */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setPostDialogOpen(true)}>New Post</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setBookDialog(true)}>Upload Book</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setNotebookDialog(true)}>New Notebook</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" startIcon={<EditIcon />}
                                onClick={() => {
                                    if (notebooks.length === 0) { setError('Create a notebook first.'); return; }
                                    setSelectedNotebook(notebooks[0]);
                                    setWritingDialog(true);
                                }}>
                                Post Writing
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }} variant="scrollable">
                        <Tab label={`My Posts (${posts.length})`} icon={<PostIcon />} iconPosition="start" />
                        <Tab label={`My Books (${books.length})`} icon={<BookIcon />} iconPosition="start" />
                        <Tab label={`Notebooks (${notebooks.length})`} icon={<NotebookIcon />} iconPosition="start" />
                        <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
                    </Tabs>

                    {/* Posts Tab */}
                    {activeTab === 0 && (
                        posts.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No posts yet.</Typography>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setPostDialogOpen(true)}>Create Post</Button>
                            </Paper>
                        ) : (
                            <Grid container spacing={2}>
                                {posts.map(post => (
                                    <Grid item xs={12} key={post.id}>
                                        <Card sx={{ borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography variant="body1">{post.content}</Typography>
                                                {post.image && (
                                                    <Box 
                                                        component="img" 
                                                        src={post.image} 
                                                        sx={{ mt: 2, maxWidth: '100%', borderRadius: 2 }} 
                                                        alt="post"
                                                    />
                                                )}
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                    {new Date(post.created_at).toLocaleString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}

                    {/* Books Tab */}
                    {activeTab === 1 && (
                        books.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No books uploaded yet.</Typography>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setBookDialog(true)}>Upload Book</Button>
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                {books.map(book => (
                                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                                        <Card sx={{ borderRadius: 2, height: '100%' }}>
                                            {book.cover_image && (
                                                <Box 
                                                    component="img" 
                                                    src={book.cover_image} 
                                                    sx={{ height: 140, objectFit: 'cover', width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} 
                                                    alt={book.title}
                                                />
                                            )}
                                            <CardContent>
                                                <Typography variant="h6" noWrap>{book.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                                    {book.description?.substring(0, 100)}...
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Chip icon={book.is_approved ? <CheckCircleIcon /> : <PendingIcon />}
                                                        label={book.is_approved ? 'Approved' : 'Pending'}
                                                        color={book.is_approved ? 'success' : 'warning'} size="small" />
                                                    <Chip label={`${book.coin_price} coins`} size="small" variant="outlined" />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}

                    {/* Notebooks Tab */}
                    {activeTab === 2 && (
                        notebooks.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No notebooks yet.</Typography>
                                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setNotebookDialog(true)}>Create Notebook</Button>
                            </Paper>
                        ) : (
                            <Grid container spacing={3}>
                                {notebooks.map(notebook => (
                                    <Grid item xs={12} sm={6} md={4} key={notebook.id}>
                                        <Card sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                                            onClick={() => navigate(`/notebooks/${notebook.id}`)}>
                                            <CardContent>
                                                <Typography variant="h6">{notebook.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    {notebook.description || 'No description'}
                                                </Typography>
                                                <Button size="small" variant="outlined" sx={{ mt: 2 }}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedNotebook(notebook); setWritingDialog(true); }}>
                                                    Add Writing
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 3 && (
                        <Box>
                            {/* Revenue Summary Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                                        <TrendingUpIcon sx={{ fontSize: 40 }} />
                                        <Typography variant="h4" fontWeight={700}>{totalRevenue}</Typography>
                                        <Typography>Total Revenue (coins)</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                                        <MonetizationOnIcon sx={{ fontSize: 40 }} />
                                        <Typography variant="h4" fontWeight={700}>{totalSales}</Typography>
                                        <Typography>Total Books Sold</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                                        <FavoriteIcon sx={{ fontSize: 40 }} />
                                        <Typography variant="h4" fontWeight={700}>{totalLikes}</Typography>
                                        <Typography>Total Likes</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Sales by Book Bar Chart */}
                            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>📊 Sales Analytics by Book</Typography>
                                {salesByBook.length === 0 ? (
                                    <Typography color="text.secondary" textAlign="center" py={4}>
                                        No sales data yet. Get your books approved first!
                                    </Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={salesByBook}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="sales" name="Books Sold" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="revenue" name="Revenue (coins)" fill="#00b894" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Paper>

                            {/* Best Selling Books */}
                            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>🏆 Best Selling Books</Typography>
                                {bestSellers.length === 0 ? (
                                    <Typography color="text.secondary" textAlign="center" py={2}>No sales yet.</Typography>
                                ) : (
                                    bestSellers.map((book, i) => (
                                        <Box key={book.book_id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box sx={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                bgcolor: i === 0 ? '#fdcb6e' : i === 1 ? '#b2bec3' : '#e17055',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 700, fontSize: 14,
                                            }}>
                                                {i + 1}
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1" fontWeight={500}>{book.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {book.sales} sold · {book.revenue} coins revenue
                                                </Typography>
                                            </Box>
                                            <EmojiEventsIcon sx={{ color: i === 0 ? '#fdcb6e' : 'text.disabled' }} />
                                        </Box>
                                    ))
                                )}
                            </Paper>

                            {/* Pie Charts */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>📚 Books Status</Typography>
                                        {bookStatusData.length === 0 ? (
                                            <Typography color="text.secondary" textAlign="center" py={4}>No books yet</Typography>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={bookStatusData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                                                        label={({ name, value }) => `${name}: ${value}`}>
                                                        {bookStatusData.map((entry, index) => (
                                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>📝 Content Overview</Typography>
                                        {contentPieData.length === 0 ? (
                                            <Typography color="text.secondary" textAlign="center" py={4}>No content yet</Typography>
                                        ) : (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={contentPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                                                        label={({ name, value }) => `${name}: ${value}`}>
                                                        {contentPieData.map((entry, index) => (
                                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Container>

            {/* Create Post Dialog - Using Component */}
            <CreatePostDialog
                open={postDialogOpen}
                onClose={() => setPostDialogOpen(false)}
                onPostCreated={refreshPosts}
            />

            {/* Upload Book Dialog */}
            <Dialog open={bookDialog} onClose={() => setBookDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload New Book</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} sx={{ mt: 1, mb: 2 }} />
                    <TextField fullWidth label="Description" multiline rows={2} value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Content" multiline rows={4} value={bookForm.content} onChange={(e) => setBookForm({ ...bookForm, content: e.target.value })} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Cover Image URL (optional)" value={bookForm.cover_image} onChange={(e) => setBookForm({ ...bookForm, cover_image: e.target.value })} sx={{ mb: 2 }} />
                    <TextField fullWidth type="number" label="Price (coins)" value={bookForm.coin_price} onChange={(e) => setBookForm({ ...bookForm, coin_price: e.target.value })} inputProps={{ min: 0 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBookDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUploadBook} disabled={submitting || !bookForm.title.trim()}>
                        {submitting ? <CircularProgress size={20} /> : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Notebook Dialog */}
            <Dialog open={notebookDialog} onClose={() => setNotebookDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Notebook</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Title" value={notebookForm.title} onChange={(e) => setNotebookForm({ ...notebookForm, title: e.target.value })} sx={{ mt: 1, mb: 2 }} />
                    <TextField fullWidth label="Description (optional)" multiline rows={2} value={notebookForm.description} onChange={(e) => setNotebookForm({ ...notebookForm, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNotebookDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateNotebook} disabled={submitting || !notebookForm.title.trim()}>
                        {submitting ? <CircularProgress size={20} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Post Writing Dialog */}
            <Dialog open={writingDialog} onClose={() => setWritingDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Post Writing in Notebook</DialogTitle>
                <DialogContent>
                    {notebooks.length > 0 && (
                        <TextField fullWidth select label="Select Notebook" value={selectedNotebook?.id || ''}
                            onChange={(e) => setSelectedNotebook(notebooks.find(n => n.id === parseInt(e.target.value)))}
                            sx={{ mt: 1, mb: 2 }}>
                            {notebooks.map(nb => <MenuItem key={nb.id} value={nb.id}>{nb.title}</MenuItem>)}
                        </TextField>
                    )}
                    <TextField fullWidth multiline rows={5} label="Your writing..." value={writingContent}
                        onChange={(e) => setWritingContent(e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Image URL (optional)" value={writingImageUrl}
                        onChange={(e) => setWritingImageUrl(e.target.value)} sx={{ mb: 2 }}
                        placeholder="https://example.com/image.jpg" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWritingDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePostWriting} disabled={submitting || !writingContent.trim()}>
                        {submitting ? <CircularProgress size={20} /> : 'Post Writing'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default WriterDashboard;