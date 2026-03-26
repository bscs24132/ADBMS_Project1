import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
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

    return (
        <AppBar position="sticky" color="primary" elevation={0}>
            <Toolbar>
                <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <IconButton color="inherit" onClick={() => navigate('/search')}>
    <SearchIcon />
</IconButton>
<IconButton color="inherit" onClick={() => navigate('/wallet')}>
    <AccountBalanceWalletIcon />
</IconButton>
<Button color="inherit" onClick={() => navigate('/groups')}>
    <GroupIcon sx={{ mr: 0.5 }} />
    Groups
</Button>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    ✍️ InkVio
                </Typography>

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Feed
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/my-books')}>
                            Books
                        </Button>
                        
                        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => { navigate('/wallet'); handleClose(); }}>
                                Wallet
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;