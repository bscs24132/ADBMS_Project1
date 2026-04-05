import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, Card, CardContent,
    Button, CircularProgress, Chip, Paper, Tab, Tabs,
    Alert, Avatar, Divider, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LockResetIcon from '@mui/icons-material/LockReset';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Layout from '../../components/Layout/Layout';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [pendingBooks, setPendingBooks] = useState([]);
    const [approvedBooks, setApprovedBooks] = useState([]);
    const [bookLoading, setBookLoading] = useState(false);
    const [resetRequests, setResetRequests] = useState([]);
    const [resetLoading, setResetLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Password approval dialog
    const [approveDialog, setApproveDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);

    // Success dialog showing the password to copy
    const [passwordResultDialog, setPasswordResultDialog] = useState(false);
    const [passwordResult, setPasswordResult] = useState(null);

    useEffect(() => { fetchAllData(); }, []);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchPendingBooks(), fetchApprovedBooks(), fetchResetRequests(), fetchAllPosts(), fetchAllGroups()]);
        setLoading(false);
    };

    const fetchPendingBooks = async () => { try { const res = await api.get('/books/admin/pending/'); setPendingBooks(res.data || []); } catch (err) { console.error(err); } };
    const fetchApprovedBooks = async () => { try { const res = await api.get('/books/admin/approved/'); setApprovedBooks(res.data || []); } catch (err) { console.error(err); } };
    const fetchResetRequests = async () => { try { const res = await api.get('/admin/password-reset-requests'); setResetRequests(res.data || []); } catch (err) { console.error(err); } };
    const fetchAllPosts = async () => { try { const res = await api.get('/posts?page=1&page_size=50'); setAllPosts(res.data || []); } catch (err) { console.error(err); } };
    const fetchAllGroups = async () => { try { const res = await api.get('/groupchats/'); setAllGroups(res.data || []); } catch (err) { console.error(err); } };

    const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); };

    const handleApproveBook = async (bookId) => {
        setBookLoading(true);
        try { await api.post(`/books/admin/${bookId}/approve/`); showSuccess('Book approved!'); fetchPendingBooks(); fetchApprovedBooks(); }
        catch (err) { setError(err.response?.data?.error || 'Failed to approve book'); }
        finally { setBookLoading(false); }
    };

    const handleRejectBook = async (bookId) => {
        setBookLoading(true);
        try { await api.post(`/books/admin/${bookId}/reject/`); showSuccess('Book rejected.'); fetchPendingBooks(); }
        catch (err) { setError(err.response?.data?.error || 'Failed to reject book'); }
        finally { setBookLoading(false); }
    };

    // Open dialog to type new password
    const openApproveDialog = (req) => {
        setSelectedRequest(req);
        setNewPassword('');
        setApproveDialog(true);
    };

    // Submit new password to backend
    const handleApproveReset = async () => {
        if (!newPassword.trim()) {
            setError('Please enter a new password');
            return;
        }
        setApproveLoading(true);
        try {
            const res = await api.post(
                `/admin/password-reset-requests/${selectedRequest.id}/process`,
                { action: 'approve', new_password: newPassword }
            );
            setApproveDialog(false);
            setNewPassword('');
            // Show the result so admin can copy and email it
            setPasswordResult({
                username: res.data.username,
                email: res.data.email,
                new_password: res.data.new_password,
            });
            setPasswordResultDialog(true);
            fetchResetRequests();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to approve request');
        } finally {
            setApproveLoading(false);
        }
    };

    const handleRejectReset = async (requestId) => {
        setResetLoading(true);
        try {
            await api.post(`/admin/password-reset-requests/${requestId}/process`, { action: 'reject' });
            showSuccess('Password request rejected.');
            fetchResetRequests();
        } catch (err) { setError(err.response?.data?.error || 'Failed to reject request'); }
        finally { setResetLoading(false); }
    };

    const confirmDelete = (type, id, title) => { setDeleteTarget({ type, id, title }); setDeleteDialog(true); };

    const handleConfirmDelete = async () => {
        if (deleteTarget.type === 'post') {
            setPostsLoading(true);
            try { await api.delete(`/posts/${deleteTarget.id}/`); showSuccess('Post deleted.'); setDeleteDialog(false); fetchAllPosts(); }
            catch (err) { setError(err.response?.data?.error || 'Failed to delete post'); }
            finally { setPostsLoading(false); }
        } else if (deleteTarget.type === 'group') {
            setGroupsLoading(true);
            try { await api.delete(`/groupchats/${deleteTarget.id}/`); showSuccess('Group deleted.'); setDeleteDialog(false); fetchAllGroups(); }
            catch (err) { setError(err.response?.data?.error || 'Failed to delete group'); }
            finally { setGroupsLoading(false); }
        }
    };

    const pendingResets = resetRequests.filter(r => r.status === 'pending');
    const processedResets = resetRequests.filter(r => r.status !== 'pending');

    if (loading) return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        </Layout>
    );

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
                            <Typography variant="body2" color="text.secondary">Welcome, {user?.username}</Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    {/* Stats */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                            { label: 'Pending Books', value: pendingBooks.length, color: '#fdcb6e', icon: <PendingIcon /> },
                            { label: 'Approved Books', value: approvedBooks.length, color: '#00b894', icon: <CheckCircleIcon /> },
                            { label: 'Pending Requests', value: pendingResets.length, color: '#d63031', icon: <LockResetIcon /> },
                            { label: 'Total Posts', value: allPosts.length, color: '#6c5ce7', icon: <ArticleIcon /> },
                            { label: 'Total Groups', value: allGroups.length, color: '#0984e3', icon: <GroupIcon /> },
                        ].map((stat, i) => (
                            <Grid item xs={12} sm={6} md={2.4} key={i}>
                                <Card sx={{ borderRadius: 3, borderLeft: `4px solid ${stat.color}` }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                                        <Box>
                                            <Typography variant="h5" fontWeight={700} color={stat.color}>{stat.value}</Typography>
                                            <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Tabs */}
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }} variant="scrollable">
                        <Tab label={`Pending Books (${pendingBooks.length})`} icon={<PendingIcon />} iconPosition="start" />
                        <Tab label={`Approved Books (${approvedBooks.length})`} icon={<CheckCircleIcon />} iconPosition="start" />
                        <Tab
                            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Password Requests{pendingResets.length > 0 && <Chip label={pendingResets.length} size="small" color="error" sx={{ height: 18, fontSize: 10 }} />}</Box>}
                            icon={<LockResetIcon />} iconPosition="start"
                        />
                        <Tab label={`All Posts (${allPosts.length})`} icon={<ArticleIcon />} iconPosition="start" />
                        <Tab label={`All Groups (${allGroups.length})`} icon={<GroupIcon />} iconPosition="start" />
                    </Tabs>

                    {/* Tab 0: Pending Books */}
                    {activeTab === 0 && (pendingBooks.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
                            <Typography variant="h6" color="text.secondary">No pending books!</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {pendingBooks.map(book => (
                                <Grid item xs={12} md={6} key={book.id}>
                                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'warning.light' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {book.cover_image ? <Box component="img" src={book.cover_image} alt={book.title} sx={{ width: 70, height: 100, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }} /> : <Box sx={{ width: 70, height: 100, borderRadius: 2, flexShrink: 0, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MenuBookIcon sx={{ color: 'white', fontSize: 30 }} /></Box>}
                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                    <Typography variant="h6" noWrap fontWeight={600}>{book.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>by @{book.author_name || book.author_username || `Writer #${book.author_id}`}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>{book.description || 'No description.'}</Typography>
                                                    <Chip label={`${book.coin_price} coins`} size="small" variant="outlined" color="primary" />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <Divider />
                                        <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
                                            <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleApproveBook(book.id)} disabled={bookLoading} sx={{ flex: 1 }}>Approve</Button>
                                            <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />} onClick={() => handleRejectBook(book.id)} disabled={bookLoading} sx={{ flex: 1 }}>Reject</Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))}

                    {/* Tab 1: Approved Books */}
                    {activeTab === 1 && (approvedBooks.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <MenuBookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="h6" color="text.secondary">No approved books yet.</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {approvedBooks.map(book => (
                                <Grid item xs={12} sm={6} md={4} key={book.id}>
                                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                                                {book.cover_image ? <Box component="img" src={book.cover_image} alt={book.title} sx={{ width: 50, height: 70, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} /> : <Box sx={{ width: 50, height: 70, borderRadius: 1, flexShrink: 0, bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MenuBookIcon sx={{ color: 'white', fontSize: 22 }} /></Box>}
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle1" noWrap fontWeight={600}>{book.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">by @{book.author_name || book.author_username || `Writer #${book.author_id}`}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip icon={<CheckCircleIcon />} label="Approved" color="success" size="small" />
                                                <Chip label={`${book.coin_price} coins`} size="small" variant="outlined" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))}

                    {/* Tab 2: Password Requests */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>🔴 Pending Requests ({pendingResets.length})</Typography>
                            {pendingResets.length === 0 ? (
                                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, mb: 3 }}>
                                    <Typography color="text.secondary">No pending password requests.</Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    {pendingResets.map(req => (
                                        <Grid item xs={12} md={6} key={req.id}>
                                            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'error.light' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle1" fontWeight={600}>{req.username || `User #${req.user_id}`}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{req.email}</Typography>
                                                        </Box>
                                                        <Chip label="Pending" color="warning" size="small" />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Requested: {new Date(req.requested_at).toLocaleString()}
                                                    </Typography>
                                                </CardContent>
                                                <Divider />
                                                <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
                                                    <Button variant="contained" color="success" size="small"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => openApproveDialog(req)}
                                                        disabled={resetLoading} sx={{ flex: 1 }}>
                                                        Approve & Set Password
                                                    </Button>
                                                    <Button variant="outlined" color="error" size="small"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => handleRejectReset(req.id)}
                                                        disabled={resetLoading} sx={{ flex: 1 }}>
                                                        Reject
                                                    </Button>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {processedResets.length > 0 && (
                                <>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>✅ Processed ({processedResets.length})</Typography>
                                    <Grid container spacing={2}>
                                        {processedResets.map(req => (
                                            <Grid item xs={12} md={6} key={req.id}>
                                                <Card sx={{ borderRadius: 3, opacity: 0.8 }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'grey.400' }}><PersonIcon /></Avatar>
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <Typography variant="subtitle2" fontWeight={600}>{req.username || `User #${req.user_id}`}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{req.email}</Typography>
                                                            </Box>
                                                            <Chip label={req.status === 'processed' ? 'Approved' : 'Rejected'} color={req.status === 'processed' ? 'success' : 'error'} size="small" />
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </Box>
                    )}

                    {/* Tab 3: All Posts */}
                    {activeTab === 3 && (allPosts.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="h6" color="text.secondary">No posts found.</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={2}>
                            {allPosts.map(post => (
                                <Grid item xs={12} key={post.id}>
                                    <Card sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                                <Box sx={{ display: 'flex', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
                                                    <Avatar src={post.profile_picture} sx={{ width: 36, height: 36, flexShrink: 0 }}>{(post.username || post.author_name)?.charAt(0).toUpperCase()}</Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="subtitle2" fontWeight={600}>@{post.username || post.author_name || `User #${post.author_id}`}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{post.created_at ? new Date(post.created_at).toLocaleString() : ''}</Typography>
                                                        <Typography variant="body2" sx={{ mt: 0.5 }}>{post.content?.substring(0, 150)}{post.content?.length > 150 ? '...' : ''}</Typography>
                                                    </Box>
                                                </Box>
                                                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => confirmDelete('post', post.id, post.content?.substring(0, 30))} sx={{ flexShrink: 0 }}>Delete</Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))}

                    {/* Tab 4: All Groups */}
                    {activeTab === 4 && (allGroups.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                            <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="h6" color="text.secondary">No groups found.</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {allGroups.map(group => (
                                <Grid item xs={12} sm={6} md={4} key={group.id}>
                                    <Card sx={{ borderRadius: 3, height: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                <GroupIcon color="primary" />
                                                <Typography variant="h6" noWrap fontWeight={600}>{group.name}</Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                                                Created by: @{group.created_by_username || `User #${group.created_by}`}
                                            </Typography>
                                            <Button fullWidth variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => confirmDelete('group', group.id, group.name)}>Delete Group</Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Box>
            </Container>

            {/* ── Approve & Set Password Dialog ── */}
            <Dialog open={approveDialog} onClose={() => setApproveDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Set New Password</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="body2"><strong>User:</strong> {selectedRequest.username}</Typography>
                            <Typography variant="body2"><strong>Email:</strong> {selectedRequest.email}</Typography>
                        </Box>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Enter a new password for this user. You will need to email it to them manually.
                    </Typography>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter a strong password"
                        autoFocus
                        helperText="This password will be saved for the user's account"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApproveDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={handleApproveReset}
                        disabled={approveLoading || !newPassword.trim()}>
                        {approveLoading ? <CircularProgress size={20} /> : 'Save & Approve'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Password Result Dialog — copy & email ── */}
            <Dialog open={passwordResultDialog} onClose={() => setPasswordResultDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700} sx={{ color: 'success.main' }}>✅ Password Updated</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Copy this information and send it to the user via email. Close this dialog only after copying.
                    </Alert>
                    {passwordResult && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Username</Typography>
                                <Typography variant="body2" fontWeight={600}>{passwordResult.username}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body2" fontWeight={600}>{passwordResult.email}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                p: 2, bgcolor: 'grey.50', borderRadius: 2,
                                border: '1px dashed', borderColor: 'success.main',
                            }}>
                                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                                    {passwordResult.new_password}
                                </Typography>
                                <Button size="small" startIcon={<ContentCopyIcon />}
                                    onClick={() => {
                                        navigator.clipboard.writeText(passwordResult.new_password);
                                        showSuccess('Password copied!');
                                    }}>
                                    Copy
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setPasswordResultDialog(false)}>Done</Button>
                </DialogActions>
            </Dialog>

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight={700} color="error">
                        Delete {deleteTarget?.type === 'group' ? 'Group' : 'Post'}?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This will permanently delete: <strong>"{deleteTarget?.title}..."</strong>
                    </Typography>
                    {deleteTarget?.type === 'group' && <Typography variant="body2" color="error" sx={{ mt: 1 }}>All members and messages will also be deleted.</Typography>}
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={postsLoading || groupsLoading}>
                        {(postsLoading || groupsLoading) ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default AdminDashboard;