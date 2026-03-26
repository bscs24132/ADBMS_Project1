import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Button,
    Avatar,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState('');
    const messagesEndRef = useRef(null);

    const fetchGroupDetails = useCallback(async () => {
        try {
            const response = await api.get(`/groupchats/${groupId}/`);
            setGroup(response.data);
        } catch (error) {
            console.error('Error fetching group:', error);
            setError('Failed to load group');
        }
    }, [groupId]);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await api.get(`/groupchats/${groupId}/messages/`);
            setMessages(response.data || []);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
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
            const response = await api.post(`/groupchats/${groupId}/messages/`, {
                content: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
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

    const handleLeaveGroup = async () => {
        setLeaving(true);
        setLeaveError('');
        
        try {
            await api.post(`/groupchats/${groupId}/leave/`);
            // Navigate back to groups page after leaving
            navigate('/groups');
        } catch (error) {
            console.error('Error leaving group:', error);
            setLeaveError(error.response?.data?.error || 'Failed to leave group');
        } finally {
            setLeaving(false);
            setLeaveDialogOpen(false);
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
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate(-1)}
                                size="small"
                            >
                                Back
                            </Button>
                            <Typography variant="h5">
                                {group?.name || 'Group Chat'}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ExitToAppIcon />}
                            onClick={() => setLeaveDialogOpen(true)}
                            size="small"
                        >
                            Leave Group
                        </Button>
                    </Box>

                    {/* Chat Messages */}
                    <Paper 
                        sx={{ 
                            height: '60vh', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box 
                            sx={{ 
                                flex: 1, 
                                overflow: 'auto', 
                                p: 2,
                                bgcolor: '#f5f5f5',
                            }}
                        >
                            {messages.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        No messages yet. Be the first to send a message!
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((msg, index) => {
                                    const isOwnMessage = msg.sender_id === user?.id;
                                    return (
                                        <Box
                                            key={msg.id || index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    maxWidth: '70%',
                                                    display: 'flex',
                                                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-start',
                                                    gap: 1,
                                                }}
                                            >
                                                {!isOwnMessage && (
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {msg.sender_username?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                )}
                                                <Paper
                                                    sx={{
                                                        p: 1.5,
                                                        bgcolor: isOwnMessage ? 'primary.main' : 'white',
                                                        color: isOwnMessage ? 'white' : 'text.primary',
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    {!isOwnMessage && (
                                                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                            {msg.sender_username}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2">
                                                        {msg.content}
                                                    </Typography>
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
                                multiline
                                maxRows={3}
                                size="small"
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
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Container>

            {/* Leave Group Dialog */}
            <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Leave Group
                </DialogTitle>
                <DialogContent>
                    {leaveError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {leaveError}
                        </Alert>
                    )}
                    <Typography>
                        Are you sure you want to leave "{group?.name}"?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You will no longer be able to send or receive messages in this group.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        onClick={handleLeaveGroup} 
                        disabled={leaving}
                    >
                        {leaving ? <CircularProgress size={24} /> : 'Leave Group'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default GroupChatPage;