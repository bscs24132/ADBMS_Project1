import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Paper, Typography, TextField,
    IconButton, Button, Avatar, Divider, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const GroupChatPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [actionDialog, setActionDialog] = useState(false); // leave or delete
    const [actioning, setActioning] = useState(false);
    const [actionError, setActionError] = useState('');
    const messagesEndRef = useRef(null);

    const isGroupAdmin = group?.created_by === user?.id;

    const fetchGroupDetails = useCallback(async () => {
        try {
            const response = await api.get(`/groupchats/${groupId}/`);
            setGroup(response.data);
        } catch (err) {
            setError('Failed to load group');
        }
    }, [groupId]);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await api.get(`/groupchats/${groupId}/messages/`);
            setMessages(response.data || []);
            scrollToBottom();
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        fetchGroupDetails();
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchGroupDetails, fetchMessages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            // ── FIX: correct endpoint is /send/ not /messages/ ──
            const response = await api.post(`/groupchats/${groupId}/send/`, {
                content: newMessage,
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Group admin → DELETE group | Regular member → LEAVE group
    const handleAction = async () => {
        setActioning(true);
        setActionError('');
        try {
            if (isGroupAdmin) {
                // Admin deletes the group
                await api.delete(`/groupchats/${groupId}/`);
            } else {
                // Member leaves the group
                await api.delete(`/groupchats/${groupId}/remove/${user.id}/`);
            }
            navigate('/groups');
        } catch (err) {
            setActionError(err.response?.data?.error || 'Action failed. Please try again.');
            setActioning(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <Box sx={{ py: 4 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} size="small">
                                Back
                            </Button>
                            <Typography variant="h5" fontWeight={600}>
                                {group?.name || 'Group Chat'}
                            </Typography>
                        </Box>

                        {/* Admin sees Delete, member sees Leave */}
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={isGroupAdmin ? <DeleteIcon /> : <ExitToAppIcon />}
                            onClick={() => setActionDialog(true)}
                            size="small"
                        >
                            {isGroupAdmin ? 'Delete Group' : 'Leave Group'}
                        </Button>
                    </Box>

                    {/* Chat Messages */}
                    <Paper sx={{
                        height: '60vh',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}>
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f6fa' }}>
                            {messages.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        No messages yet. Be the first to say something!
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((msg, index) => {
                                    const isOwn = msg.sender_id === user?.id;
                                    return (
                                        <Box key={msg.id || index} sx={{
                                            display: 'flex',
                                            justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                            mb: 2,
                                        }}>
                                            <Box sx={{
                                                maxWidth: '70%',
                                                display: 'flex',
                                                flexDirection: isOwn ? 'row-reverse' : 'row',
                                                alignItems: 'flex-start',
                                                gap: 1,
                                            }}>
                                                {!isOwn && (
                                                    <Avatar
                                                        src={msg.profile_picture}
                                                        sx={{ width: 32, height: 32, flexShrink: 0 }}
                                                    >
                                                        {msg.sender_username?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                )}
                                                <Paper sx={{
                                                    p: 1.5,
                                                    bgcolor: isOwn ? 'primary.main' : 'white',
                                                    color: isOwn ? 'white' : 'text.primary',
                                                    borderRadius: 2,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                                }}>
                                                    {!isOwn && (
                                                        <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 0.5, color: 'primary.main' }}>
                                                            {msg.sender_username}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2">{msg.content}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                                                        {new Date(msg.sent_at).toLocaleTimeString()}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </Box>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Message Input */}
                        <Divider />
                        <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'white' }}>
                            <TextField
                                fullWidth
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                multiline maxRows={3} size="small"
                                disabled={sending}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sending}
                            >
                                {sending ? <CircularProgress size={24} /> : <SendIcon />}
                            </IconButton>
                        </Box>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
                    )}
                </Box>
            </Container>

            {/* Leave / Delete Dialog */}
            <Dialog open={actionDialog} onClose={() => setActionDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={700} color={isGroupAdmin ? 'error' : 'inherit'}>
                    {isGroupAdmin ? 'Delete Group?' : 'Leave Group?'}
                </DialogTitle>
                <DialogContent>
                    {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
                    {isGroupAdmin ? (
                        <>
                            <Typography variant="body2">
                                You are the group admin. Deleting <strong>"{group?.name}"</strong> will permanently remove all messages and members.
                            </Typography>
                            <Typography variant="body2" color="error" sx={{ mt: 1 }} fontWeight={600}>
                                This cannot be undone.
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2">
                                Are you sure you want to leave <strong>"{group?.name}"</strong>?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                You will no longer receive messages from this group.
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setActionDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained" color="error"
                        onClick={handleAction}
                        disabled={actioning}
                        startIcon={isGroupAdmin ? <DeleteIcon /> : <ExitToAppIcon />}
                    >
                        {actioning ? <CircularProgress size={20} /> : isGroupAdmin ? 'Delete Group' : 'Leave Group'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default GroupChatPage;