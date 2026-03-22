import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Avatar,
    Typography,
    Grid,
    Chip,
    Button,
    Skeleton,
    Tabs,
    Tab,
    Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from '../../components/Layout/Layout';
import FollowButton from '../../components/Common/FollowButton';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import PostsFeed from '../../components/Post/PostsFeed';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [books, setBooks] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [groupchats, setGroupchats] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [loadingNotebooks, setLoadingNotebooks] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const targetId = userId || currentUser?.id;
            const response = await api.get(`/users/${targetId}`);
            setProfile(response.data);
            
            // If writer, fetch additional data
            if (response.data.role === 'writer') {
                fetchWriterData(targetId);
            }
        } catch (err) {
            setError('Failed to load profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

   const fetchWriterData = async (writerId) => {
    const numericWriterId = parseInt(writerId);
    
    // Fetch books (filter on frontend)
    setLoadingBooks(true);
    try {
        const booksResponse = await api.get('/books');
        const allBooks = booksResponse.data || [];
        const writerBooks = allBooks.filter(book => book.author_id === numericWriterId);
        console.log('📚 Writer books:', writerBooks);
        setBooks(writerBooks);
    } catch (err) {
        console.error('Error fetching books:', err);
    } finally {
        setLoadingBooks(false);
    }

    // Fetch notebooks (filter on frontend)
    setLoadingNotebooks(true);
    try {
        const notebooksResponse = await api.get('/notebooks');
        const allNotebooks = notebooksResponse.data || [];
        const writerNotebooks = allNotebooks.filter(notebook => notebook.author_id === numericWriterId);
        console.log('📓 Writer notebooks:', writerNotebooks);
        setNotebooks(writerNotebooks);
    } catch (err) {
        console.error('Error fetching notebooks:', err);
    } finally {
        setLoadingNotebooks(false);
    }

    // Fetch groupchats
    setLoadingGroups(true);
    try {
        const groupsResponse = await api.get('/groupchats');
        const writerGroups = groupsResponse.data.filter(group => group.writer_id === numericWriterId);
        setGroupchats(writerGroups);
    } catch (err) {
        console.error('Error fetching groupchats:', err);
    } finally {
        setLoadingGroups(false);
    }
};

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;
    const isWriter = profile?.role === 'writer';

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Box sx={{ mt: 4 }}>
                        <Skeleton variant="circular" width={100} height={100} />
                        <Skeleton variant="text" width={200} height={40} />
                        <Skeleton variant="text" width={300} height={20} />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (error || !profile) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Typography color="error" sx={{ mt: 4 }}>
                        {error || 'User not found'}
                    </Typography>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                {/* Back button */}
                <Box sx={{ mb: 2 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate(-1)}
                        size="small"
                    >
                        Back
                    </Button>
                </Box>

                {/* Profile Header */}
                <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={profile.profile_picture}
                                sx={{ width: 100, height: 100 }}
                            >
                                {profile.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="h4">
                                    {profile.username}
                                </Typography>
                                <Chip 
                                    label={isWriter ? '✍️ Writer' : '📚 Reader'}
                                    color={isWriter ? 'primary' : 'default'}
                                    size="small"
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                {profile.bio || 'No bio yet.'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Joined {new Date(profile.date_joined).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {!isOwnProfile && (
                                <FollowButton 
                                    userId={profile.id} 
                                    username={profile.username}
                                    onFollowChange={() => fetchProfile()}
                                />
                            )}
                            {isOwnProfile && (
                                <Button 
                                    variant="outlined" 
                                    onClick={() => navigate('/profile/edit')}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs for Writers */}
                {isWriter ? (
                    <Box>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Posts" />
                            <Tab label="Books" />
                            <Tab label="Notebooks" />
                            <Tab label="Group Chats" />
                        </Tabs>

                        {/* Posts Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Posts by {profile.username}
                            </Typography>
                            <PostsFeed userId={profile.id} />
                        </TabPanel>

                        {/* Books Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Books by {profile.username}
                            </Typography>
                            {loadingBooks ? (
                                <Typography>Loading books...</Typography>
                            ) : books.length === 0 ? (
                                <Typography color="text.secondary">No books yet.</Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {books.map(book => (
                                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                                            <Paper sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/books/${book.id}`)}>
                                                <Typography variant="h6" noWrap>
                                                    {book.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {book.coin_price} coins
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </TabPanel>

                        {/* Notebooks Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Notebooks by {profile.username}
                            </Typography>
                            {loadingNotebooks ? (
                                <Typography>Loading notebooks...</Typography>
                            ) : notebooks.length === 0 ? (
                                <Typography color="text.secondary">No notebooks yet.</Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {notebooks.map(notebook => (
                                        <Grid item xs={12} sm={6} md={4} key={notebook.id}>
                                            <Paper sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/notebooks/${notebook.id}`)}>
                                                <Typography variant="h6" noWrap>
                                                    {notebook.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {notebook.description || 'No description'}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </TabPanel>

                        {/* Group Chats Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Group Chats by {profile.username}
                            </Typography>
                            {loadingGroups ? (
                                <Typography>Loading group chats...</Typography>
                            ) : groupchats.length === 0 ? (
                                <Typography color="text.secondary">No group chats yet.</Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {groupchats.map(group => (
                                        <Grid item xs={12} sm={6} md={4} key={group.id}>
                                            <Paper sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/groupchats/${group.id}`)}>
                                                <Typography variant="h6" noWrap>
                                                    {group.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {group.member_count || 0} members
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </TabPanel>
                    </Box>
                ) : (
                    // Reader Profile - Only show posts
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Posts by {profile.username}
                        </Typography>
                        <PostsFeed userId={profile.id} />
                    </Box>
                )}
            </Container>
        </Layout>
    );
};

export default ProfilePage;