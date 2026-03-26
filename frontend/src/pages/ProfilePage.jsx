import React, { useState, useEffect, useCallback } from 'react';
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
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout/Layout';
import FollowButton from '../components/Common/FollowButton';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import PostsFeed from '../components/Post/PostsFeed';
import FollowListModal from '../components/Common/FollowListModal';
import PersonIcon from '@mui/icons-material/Person';

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
    
    // Followers/Following State
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);
    
    // Create Group Dialog State
    const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [groupCreateError, setGroupCreateError] = useState('');
    
    // Join Group State
    const [joiningGroupId, setJoiningGroupId] = useState(null);
    const [joinError, setJoinError] = useState('');
    
    // ... rest of your code

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
        const targetId = userId || currentUser?.id;
        const response = await api.get(`/users/${targetId}`);
        setProfile(response.data);
        
        // Fetch followers and following counts
        try {
            const followersRes = await api.get(`/users/${targetId}/followers`);
            setFollowersCount(followersRes.data.followers_count || followersRes.data.followers?.length || 0);
            
            const followingRes = await api.get(`/users/${targetId}/following`);
            setFollowingCount(followingRes.data.following_count || followingRes.data.following?.length || 0);
        } catch (err) {
            console.error('Error fetching follow counts:', err);
        }
        
        if (response.data.role === 'writer') {
            fetchWriterData(targetId);
        }
    } catch (err) {
        setError('Failed to load profile');
        console.error(err);
    } finally {
        setLoading(false);
    }
}, [userId, currentUser?.id]);
    const fetchWriterData = useCallback(async (writerId) => {
    const numericWriterId = parseInt(writerId);
    
    // Fetch books
    setLoadingBooks(true);
    try {
        const booksResponse = await api.get('/books');
        const allBooks = booksResponse.data || [];
        const writerBooks = allBooks.filter(book => 
            book.author_id === numericWriterId && book.is_approved
        );
        setBooks(writerBooks);
    } catch (err) {
        console.error('Error fetching books:', err);
    } finally {
        setLoadingBooks(false);
    }

    // Fetch notebooks
    setLoadingNotebooks(true);
    try {
        const notebooksResponse = await api.get('/notebooks');
        const allNotebooks = notebooksResponse.data || [];
        const writerNotebooks = allNotebooks.filter(notebook => notebook.author_id === numericWriterId);
        setNotebooks(writerNotebooks);
    } catch (err) {
        console.error('Error fetching notebooks:', err);
    } finally {
        setLoadingNotebooks(false);
    }

    // Fetch groupchats with membership check
    // Fetch groupchats with membership check
setLoadingGroups(true);
try {
    const groupsResponse = await api.get('/groupchats');
    const writerGroups = groupsResponse.data.filter(group => group.writer_id === numericWriterId);
    
    console.log('📊 Writer groups:', writerGroups);
    console.log('📊 Current user ID:', currentUser?.id);
    
    // Check membership for each group
    const groupsWithMembership = await Promise.all(writerGroups.map(async (group) => {
        try {
            console.log(`🔍 Checking membership for group ${group.id}: ${group.name}`);
            const membersResponse = await api.get(`/groupchats/${group.id}/members/`);
            console.log(`📊 Members for group ${group.id}:`, membersResponse.data);
            
            const members = membersResponse.data || [];
            const isMember = members.some(m => m.user_id === currentUser?.id);
            const isAdmin = members.some(m => m.user_id === currentUser?.id && m.role === 'admin');
            
            console.log(`📊 Group ${group.id} - isMember: ${isMember}, isAdmin: ${isAdmin}`);
            
            return {
                ...group,
                user_role: isAdmin ? 'admin' : (isMember ? 'member' : null)
            };
        } catch (err) {
            console.error(`Error checking membership for group ${group.id}:`, err);
            return { ...group, user_role: null };
        }
    }));
    
    console.log('📊 Final groups with membership:', groupsWithMembership);
    setGroupchats(groupsWithMembership);
} catch (err) {
    console.error('Error fetching groupchats:', err);
} finally {
    setLoadingGroups(false);
}
}, [currentUser?.id]);

    const handleCreateGroup = async () => {
    console.log('Creating group...');
    console.log('Group name:', newGroupName);
    console.log('Writer ID:', profile?.id);
    
    if (!newGroupName.trim()) {
        setGroupCreateError('Group name is required');
        return;
    }

    setCreatingGroup(true);
    setGroupCreateError('');

    try {
        // Change this line from '/groupchats/' to '/groupchats/create/'
        const response = await api.post('/groupchats/create/', {
            name: newGroupName,
            description: newGroupDescription,
            writer_id: profile?.id
        });
        console.log('Group created:', response.data);
        
        setGroupchats([response.data, ...groupchats]);
        setCreateGroupDialogOpen(false);
        setNewGroupName('');
        setNewGroupDescription('');
    } catch (error) {
        console.error('Error creating group:', error);
        console.error('Error response:', error.response);
        setGroupCreateError(error.response?.data?.error || 'Failed to create group');
    } finally {
        setCreatingGroup(false);
    }
};
const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleJoinGroup = async (groupId) => {
    setJoiningGroupId(groupId);
    setJoinError('');
    
    try {
        await api.post(`/groupchats/${groupId}/join/`);  // ← This is correct
        fetchWriterData(profile.id);
    } catch (error) {
        console.error('Error joining group:', error);
        setJoinError(error.response?.data?.error || 'Failed to join group');
        setTimeout(() => setJoinError(''), 3000);
    } finally {
        setJoiningGroupId(null);
    }
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
            <Container maxWidth="lg">
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
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={profile.profile_picture}
                                sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
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
                            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
    <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setFollowersOpen(true)}>
        <Typography variant="h6">{followersCount}</Typography>
        <Typography variant="caption" color="text.secondary">Followers</Typography>
    </Box>
    <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setFollowingOpen(true)}>
        <Typography variant="h6">{followingCount}</Typography>
        <Typography variant="caption" color="text.secondary">Following</Typography>
    </Box>
</Box>
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
                                <Grid container spacing={3}>
                                    {[1, 2, 3].map((i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : books.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                    No books yet.
                                </Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {books.map((book) => (
                                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                                            <Card 
                                                sx={{ 
                                                    cursor: 'pointer', 
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                                    borderRadius: 2,
                                                }}
                                                onClick={() => navigate(`/books/${book.id}`)}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" noWrap>
                                                        {book.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {book.coin_price} coins
                                                    </Typography>
                                                </CardContent>
                                            </Card>
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
                                <Grid container spacing={3}>
                                    {[1, 2, 3].map((i) => (
                                        <Grid item xs={12} sm={6} md={4} key={i}>
                                            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : notebooks.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                    No notebooks yet.
                                </Typography>
                            ) : (
                                <Grid container spacing={3}>
                                    {notebooks.map((notebook) => (
                                        <Grid item xs={12} sm={6} md={4} key={notebook.id}>
                                            <Card 
                                                sx={{ 
                                                    cursor: 'pointer', 
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                                    borderRadius: 2,
                                                }}
                                                onClick={() => navigate(`/notebooks/${notebook.id}`)}
                                            >
                                                <CardContent>
                                                    <Typography variant="h6" noWrap>
                                                        {notebook.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {notebook.description || 'No description'}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${notebook.post_count || 0} writings`} 
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mt: 2 }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </TabPanel>

                        {/* Group Chats Tab */}
<TabPanel value={tabValue} index={3}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
            Group Chats
        </Typography>
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateGroupDialogOpen(true)}
        >
            Create Group
        </Button>
    </Box>
    
    {joinError && (
        <Alert severity="error" sx={{ mb: 2 }}>
            {joinError}
        </Alert>
    )}
    
    {loadingGroups ? (
        <Typography>Loading group chats...</Typography>
    ) : groupchats.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No group chats yet. Be the first to create one!
        </Typography>
    ) : (
        <Grid container spacing={3}>
            {groupchats.map((group) => {
                // Check if current user is a member
                const isMember = group.user_role === 'admin' || group.user_role === 'member';
                return (
                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <GroupIcon sx={{ color: 'primary.main' }} />
                                    <Typography variant="h6" noWrap>
                                        {group.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {group.description || 'No description'}
                                </Typography>
                                <Chip 
                                    label={`${group.member_count || 0} members`} 
                                    size="small"
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                />
                                {group.created_by === currentUser?.id && (
                                    <Chip 
                                        label="Admin" 
                                        size="small" 
                                        color="primary" 
                                        sx={{ ml: 1, mt: 2 }}
                                    />
                                )}
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                {isMember ? (
                                    <Button 
                                        size="small" 
                                        variant="contained"
                                        onClick={() => navigate(`/groupchats/${group.id}`)}
                                    >
                                        Open Chat
                                    </Button>
                                ) : (
                                    <Button 
                                        size="small" 
                                        variant="outlined"
                                        onClick={() => handleJoinGroup(group.id)}
                                        disabled={joiningGroupId === group.id}
                                    >
                                        {joiningGroupId === group.id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            'Join Group'
                                        )}
                                    </Button>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                );
            })}
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

            {/* Create Group Dialog */}
            <Dialog open={createGroupDialogOpen} onClose={() => setCreateGroupDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Create Group for {profile?.username}
                    <IconButton
                        aria-label="close"
                        onClick={() => setCreateGroupDialogOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {groupCreateError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {groupCreateError}
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        label="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        margin="normal"
                        required
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        label="Description (optional)"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        You will be added as the admin of this group
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setCreateGroupDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateGroup} 
                        disabled={creatingGroup}
                    >
                        {creatingGroup ? <CircularProgress size={24} /> : 'Create Group'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Followers Modal */}
<FollowListModal
    open={followersOpen}
    onClose={() => setFollowersOpen(false)}
    userId={profile?.id}
    title="Followers"
/>

{/* Following Modal */}
<FollowListModal
    open={followingOpen}
    onClose={() => setFollowingOpen(false)}
    userId={profile?.id}
    title="Following"
/>
        </Layout>
    );
};

export default ProfilePage;