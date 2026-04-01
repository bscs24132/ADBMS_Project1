import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Grid, Card, CardContent,
    CardActions, Button, CircularProgress, Paper, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Alert, Avatar, MenuItem, InputAdornment,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const GroupChatsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myGroups, setMyGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tab, setTab] = useState('my');

    // All writers who have at least one group (for filter dropdown)
    const [writersWithGroups, setWritersWithGroups] = useState([]);

    // writer_id → writer info map
    const [writerMap, setWriterMap] = useState({});

    const [selectedWriterFilter, setSelectedWriterFilter] = useState('');

    // Create group dialog (only for role=user)
    const [createDialog, setCreateDialog] = useState(false);
    const [groupForm, setGroupForm] = useState({ name: '', writer_id: '' });
    const [submitting, setSubmitting] = useState(false);

    // Delete group confirmation
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    // Per backend RBAC: only 'user' role can create groups
    // Writers and admins cannot create groupchats
    const isUser = user?.role === 'user';
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchMyGroups();
        fetchAllGroups();
    }, [user]);

    const fetchMyGroups = async () => {
        setLoading(true);
        try {
            const res = await api.get('/groupchats/my/');
            setMyGroups(res.data || []);
        } catch (err) {
            setError('Failed to load your groups');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllGroups = async () => {
        try {
            const res = await api.get('/groupchats/');
            const data = res.data || [];
            setAllGroups(data);

            // Collect all unique writer_ids from groups
            const writerIds = [...new Set(
                data.filter(g => g.writer_id).map(g => g.writer_id)
            )];

            // Fetch writer info for each
            const newMap = {};
            await Promise.all(writerIds.map(async (wid) => {
                try {
                    const r = await api.get(`/users/${wid}`);
                    newMap[wid] = r.data;
                } catch (e) {}
            }));

            setWriterMap(newMap);

            // Build sorted list of writers who have groups (for filter)
            const writersArr = writerIds
                .map(wid => newMap[wid])
                .filter(Boolean)
                .sort((a, b) => a.username.localeCompare(b.username));

            setWritersWithGroups(writersArr);
        } catch (err) {
            console.error('Error fetching all groups:', err);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupForm.name.trim()) return;
        setSubmitting(true);
        try {
            const payload = { name: groupForm.name };
            if (groupForm.writer_id) {
                payload.writer_id = parseInt(groupForm.writer_id);
            }
            await api.post('/groupchats/create/', payload);
            setGroupForm({ name: '', writer_id: '' });
            setCreateDialog(false);
            setSuccess('Group created successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchMyGroups();
            fetchAllGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create group');
        } finally {
            setSubmitting(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            await api.post(`/groupchats/${groupId}/join/`);
            setSuccess('Joined group successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchMyGroups();
            fetchAllGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join group');
        }
    };

    // Group admin must DELETE their group (cannot leave it)
    const handleDeleteGroup = async () => {
        if (!groupToDelete) return;
        try {
            await api.delete(`/groupchats/${groupToDelete.id}/`);
            setSuccess('Group deleted.');
            setDeleteDialog(false);
            setGroupToDelete(null);
            setTimeout(() => setSuccess(''), 3000);
            fetchMyGroups();
            fetchAllGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete group');
        }
    };

    // Leave group (for non-admin members)
    const handleLeaveGroup = async (groupId) => {
        try {
            await api.delete(`/groupchats/${groupId}/remove/${user.id}/`);
            setSuccess('Left group successfully.');
            setTimeout(() => setSuccess(''), 3000);
            fetchMyGroups();
            fetchAllGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to leave group');
        }
    };

    const isMyGroup = (group) =>
        myGroups.some(g => g.id === group.id) || group.created_by === user?.id;

    const isGroupAdmin = (group) => group.created_by === user?.id;

    const getMemberCount = (group) => { const count = group.member_count ?? group.members_count ?? group.total_members ?? (group.members?.length) ?? 0; return Math.max(count, 1); };

    const filterGroups = (groupList) => {
        if (!selectedWriterFilter) return groupList;
        return groupList.filter(g => g.writer_id === parseInt(selectedWriterFilter));
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

    const displayGroups = filterGroups(tab === 'my' ? myGroups : allGroups);

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>

                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} size="small">
                                Back
                            </Button>
                            <Typography variant="h4" fontWeight={700}>Group Chats</Typography>
                        </Box>
                        {/* Only role=user can create groups per backend RBAC */}
                        {isUser && (
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialog(true)}>
                                Create Group
                            </Button>
                        )}
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    {/* Info banner for writers/admins */}
                    {!isUser && !isAdmin && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Writers can join group chats but cannot create them. Readers create groups in writer communities.
                        </Alert>
                    )}

                    {/* Tabs + Writer Filter */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        mb: 2, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 1,
                    }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {['my', 'all'].map(t => (
                                <Typography key={t} variant="h6" sx={{
                                    cursor: 'pointer', pb: 1,
                                    borderBottom: tab === t ? 2 : 0,
                                    borderColor: 'primary.main',
                                    color: tab === t ? 'primary.main' : 'text.secondary',
                                    transition: 'color 0.2s',
                                }} onClick={() => setTab(t)}>
                                    {t === 'my' ? `My Groups (${myGroups.length})` : `All Groups (${allGroups.length})`}
                                </Typography>
                            ))}
                        </Box>

                        {/* Filter by writer — shows ALL writers who have groups */}
                        {writersWithGroups.length > 0 && (
                            <TextField
                                select size="small"
                                label="Filter by writer"
                                value={selectedWriterFilter}
                                onChange={(e) => setSelectedWriterFilter(e.target.value)}
                                sx={{ minWidth: 220, mb: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FilterListIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="">All Writers</MenuItem>
                                {writersWithGroups.map(w => (
                                    <MenuItem key={w.id} value={w.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar src={w.profile_picture} sx={{ width: 22, height: 22, fontSize: 11, bgcolor: 'primary.main' }}>
                                                {w.username?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            @{w.username}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Box>

                    {/* Active filter chip */}
                    {selectedWriterFilter && writerMap[selectedWriterFilter] && (
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                avatar={
                                    <Avatar src={writerMap[selectedWriterFilter]?.profile_picture}>
                                        {writerMap[selectedWriterFilter]?.username?.charAt(0)}
                                    </Avatar>
                                }
                                label={`@${writerMap[selectedWriterFilter]?.username}'s community`}
                                onDelete={() => setSelectedWriterFilter('')}
                                color="primary" size="small"
                            />
                        </Box>
                    )}

                    {/* Groups Grid */}
                    {displayGroups.length === 0 ? (
                        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                            <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                {tab === 'my' ? 'No groups yet' : 'No groups found'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {selectedWriterFilter
                                    ? `No groups in @${writerMap[selectedWriterFilter]?.username}'s community yet.`
                                    : tab === 'my'
                                        ? 'Join or create a group to get started'
                                        : 'No groups available yet.'}
                            </Typography>
                            {isUser && (
                                <Button variant="contained" sx={{ mt: 3 }} onClick={() => setCreateDialog(true)}>
                                    Create Group
                                </Button>
                            )}
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {displayGroups.map((group) => {
                                const writer = writerMap[group.writer_id];
                                const mine = isMyGroup(group);
                                const amAdmin = isGroupAdmin(group);
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                                        <Card sx={{
                                            cursor: mine ? 'pointer' : 'default',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': mine ? { transform: 'translateY(-4px)', boxShadow: 6 } : {},
                                            borderRadius: 3, height: '100%',
                                            display: 'flex', flexDirection: 'column',
                                            border: mine ? '2px solid' : '1px solid',
                                            borderColor: mine ? 'primary.light' : 'divider',
                                        }} onClick={() => mine && navigate(`/groupchats/${group.id}`)}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                {/* Writer community tag */}
                                                {writer && (
                                                    <Box sx={{
                                                        display: 'flex', alignItems: 'center', gap: 1,
                                                        mb: 1.5, p: 1, borderRadius: 2,
                                                        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                                                    }}>
                                                        <Avatar src={writer.profile_picture} sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
                                                            {writer.username?.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" color="primary.main" fontWeight={700}>
                                                                ✍️ @{writer.username}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 10 }}>
                                                                community group
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <GroupIcon color="primary" fontSize="small" />
                                                    <Typography variant="h6" noWrap fontWeight={600}>{group.name}</Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        label={`${getMemberCount(group)} member${getMemberCount(group) !== 1 ? 's' : ''}`}
                                                        size="small" variant="outlined"
                                                    />
                                                    {amAdmin && (
                                                        <Chip label="Group Admin" size="small" color="primary" />
                                                    )}
                                                    {mine && !amAdmin && (
                                                        <Chip label="Joined" size="small" color="success" />
                                                    )}
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                                {mine ? (
                                                    <>
                                                        <Button size="small" variant="contained" sx={{ flex: 1 }}
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/groupchats/${group.id}`); }}>
                                                            Open Chat
                                                        </Button>
                                                        {amAdmin ? (
                                                            /* Group admin cannot leave — must delete */
                                                            <Button size="small" variant="outlined" color="error"
                                                                startIcon={<DeleteIcon />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setGroupToDelete(group);
                                                                    setDeleteDialog(true);
                                                                }}>
                                                                Delete
                                                            </Button>
                                                        ) : (
                                                            /* Regular member can leave */
                                                            <Button size="small" variant="outlined" color="warning"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLeaveGroup(group.id);
                                                                }}>
                                                                Leave
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Button size="small" variant="outlined" fullWidth
                                                        onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id); }}>
                                                        Join
                                                    </Button>
                                                )}
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>
            </Container>

            {/* Create Group Dialog — only shown for role=user */}
            <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Create New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Group Name"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                        sx={{ mt: 1, mb: 2 }} autoFocus
                    />
                    {/* Link to a writer's community — pick from writers who have groups */}
                    <TextField
                        fullWidth select
                        label="Link to a writer's community (optional)"
                        value={groupForm.writer_id}
                        onChange={(e) => setGroupForm({ ...groupForm, writer_id: e.target.value })}
                        helperText="Other readers interested in that writer can find this group"
                    >
                        <MenuItem value="">No specific writer</MenuItem>
                        {writersWithGroups.map(w => (
                            <MenuItem key={w.id} value={w.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar src={w.profile_picture} sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>
                                        {w.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    @{w.username}
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateGroup}
                        disabled={submitting || !groupForm.name.trim()}>
                        {submitting ? <CircularProgress size={20} /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Group Confirmation Dialog */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700} color="error">Delete Group?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        You are the group admin. You cannot leave — you can only delete this group.
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1 }} fontWeight={600}>
                        Deleting <strong>"{groupToDelete?.name}"</strong> will remove all messages and members permanently.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteGroup}>
                        Delete Group
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default GroupChatsPage;