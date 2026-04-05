import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {
    AppBar, Toolbar, Typography, Button, Box,
    Avatar, Menu, MenuItem, IconButton, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, px: { xs: 2, sm: 3 } }}>

                {/* Left — utility icons (hidden for admin) */}
                {!isAdmin && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
                        <IconButton
                            sx={{ color: '#FECE79', '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' } }}
                            onClick={() => navigate('/search')}
                            size="small"
                        >
                            <SearchIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            sx={{ color: '#FECE79', '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' } }}
                            onClick={() => navigate('/wallet')}
                            size="small"
                        >
                            <AccountBalanceWalletIcon fontSize="small" />
                        </IconButton>
                        <Button
                            size="small"
                            startIcon={<GroupIcon sx={{ fontSize: '16px !important' }} />}
                            onClick={() => navigate('/groups')}
                            sx={{
                                color: '#FECE79', fontSize: '0.8rem',
                                fontFamily: '"Lato", sans-serif', fontWeight: 600,
                                letterSpacing: '0.06em', px: 1.5,
                                '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' },
                            }}
                        >
                            Groups
                        </Button>
                    </Box>
                )}

                {/* Centre — Logo */}
                <Box
                    sx={{
                        flexGrow: 1, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', gap: 1,
                    }}
                    onClick={() => navigate(isAdmin ? '/admin' : '/')}
                >
                    <AutoStoriesIcon sx={{ color: '#E6A341', fontSize: 22 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Playfair Display", serif', fontWeight: 700,
                            color: '#FECE79', letterSpacing: '0.08em',
                            textShadow: '0 1px 4px rgba(45,1,0,0.4)',
                            fontSize: { xs: '1.1rem', sm: '1.4rem' },
                        }}
                    >
                        InkVio
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center', ml: 0.5 }}>
                        {[0, 1, 2].map(i => (
                            <Box key={i} sx={{
                                width: 4, height: 4, borderRadius: '50%',
                                bgcolor: i === 1 ? '#E6A341' : 'rgba(230,163,65,0.4)',
                            }} />
                        ))}
                    </Box>
                </Box>

                {/* Right */}
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                        {/* Non-admin nav buttons */}
                        {!isAdmin && (
                            <>
                                <Button size="small" onClick={() => navigate('/dashboard')}
                                    sx={{
                                        color: '#FECE79', fontSize: '0.8rem',
                                        fontFamily: '"Lato", sans-serif', fontWeight: 600,
                                        letterSpacing: '0.06em',
                                        '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' },
                                    }}>
                                    Feed
                                </Button>
                                <Button size="small" onClick={() => navigate('/my-books')}
                                    sx={{
                                        color: '#FECE79', fontSize: '0.8rem',
                                        fontFamily: '"Lato", sans-serif', fontWeight: 600,
                                        letterSpacing: '0.06em',
                                        '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' },
                                    }}>
                                    Books
                                </Button>
                                {user?.role === 'writer' && (
                                    <Button size="small"
                                        startIcon={<DashboardIcon sx={{ fontSize: '16px !important' }} />}
                                        onClick={() => navigate('/writer')}
                                        sx={{
                                            color: '#FECE79', fontSize: '0.8rem',
                                            fontFamily: '"Lato", sans-serif', fontWeight: 600,
                                            letterSpacing: '0.06em',
                                            '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' },
                                        }}>
                                        My Dashboard
                                    </Button>
                                )}
                            </>
                        )}

                        {/* Admin — just show plain text label */}
                        {isAdmin && (
                            <Typography sx={{
                                color: '#FECE79', fontSize: '0.8rem',
                                fontFamily: '"Lato", sans-serif', fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                opacity: 0.85,
                            }}>
                                Admin Panel
                            </Typography>
                        )}

                        {/* Avatar + Dropdown */}
                        <IconButton onClick={handleMenu} sx={{ p: 0.5, ml: 0.5 }}>
                            <Avatar
                                src={user?.profile_picture}
                                sx={{
                                    width: 36, height: 36, bgcolor: '#8C0902',
                                    border: '2px solid #E6A341', color: '#FECE79',
                                    fontFamily: '"Playfair Display", serif',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    transition: 'border-color 0.2s',
                                    '&:hover': { borderColor: '#FECE79' },
                                }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {
                                    bgcolor: '#FFF8F0', border: '1px solid #E8C99A',
                                    borderTop: '3px solid #E6A341', borderRadius: 1,
                                    mt: 1, minWidth: 180,
                                    boxShadow: '0 8px 24px rgba(45,1,0,0.15)',
                                },
                            }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography sx={{
                                    fontFamily: '"Playfair Display", serif',
                                    fontWeight: 700, fontSize: '0.95rem', color: '#2D0100',
                                }}>
                                    {user?.username}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#7A3B2E', fontFamily: '"Lato", sans-serif' }}>
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </Typography>
                            </Box>
                            <Divider sx={{ borderColor: '#E8C99A' }} />

                            {/* Admin only sees Admin Panel in dropdown */}
                            {isAdmin ? (
                                <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}
                                    sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', color: '#2D0100', '&:hover': { bgcolor: 'rgba(230,163,65,0.1)' } }}>
                                    Admin Dashboard
                                </MenuItem>
                            ) : (
                                <>
                                    <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}
                                        sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', color: '#2D0100', '&:hover': { bgcolor: 'rgba(230,163,65,0.1)' } }}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/wallet'); handleClose(); }}
                                        sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', color: '#2D0100', '&:hover': { bgcolor: 'rgba(230,163,65,0.1)' } }}>
                                        Wallet
                                    </MenuItem>
                                    {user?.role === 'writer' && (
                                        <MenuItem onClick={() => { navigate('/writer'); handleClose(); }}
                                            sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.875rem', color: '#2D0100', '&:hover': { bgcolor: 'rgba(230,163,65,0.1)' } }}>
                                            Writer Dashboard
                                        </MenuItem>
                                    )}
                                </>
                            )}

                            <Divider sx={{ borderColor: '#E8C99A' }} />
                            <MenuItem onClick={handleLogout}
                                sx={{
                                    fontFamily: '"Lato", sans-serif', fontSize: '0.875rem',
                                    color: '#8C0902', fontWeight: 600,
                                    '&:hover': { bgcolor: 'rgba(140,9,2,0.08)' },
                                }}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={() => navigate('/login')}
                            sx={{
                                color: '#FECE79', fontFamily: '"Lato", sans-serif',
                                fontWeight: 600, letterSpacing: '0.06em', fontSize: '0.85rem',
                                '&:hover': { color: '#E6A341', bgcolor: 'rgba(254,206,121,0.1)' },
                            }}>
                            Login
                        </Button>
                        <Button variant="contained" onClick={() => navigate('/register')}
                            sx={{
                                bgcolor: '#E6A341', color: '#2D0100',
                                fontFamily: '"Lato", sans-serif', fontWeight: 700,
                                fontSize: '0.85rem', letterSpacing: '0.06em',
                                border: '2px solid #B14A36',
                                '&:hover': { bgcolor: '#FECE79' },
                            }}>
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;