import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout/Layout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const WalletPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bookTransactions, setBookTransactions] = useState([]);
    const [coinPurchases, setCoinPurchases] = useState([]);
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
    const [coinsToBuy, setCoinsToBuy] = useState(100);
    const [accountNo, setAccountNo] = useState('');
    const [amount, setAmount] = useState(10);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState('');
    const [purchaseSuccess, setPurchaseSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        setLoading(true);
        try {
            // Fetch wallet balance
            const walletRes = await api.get('/wallet');
            setBalance(walletRes.data.coin_balance || 0);

            // Fetch book purchase transactions
            const transactionsRes = await api.get('/wallet/transactions');
            setBookTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : []);

            // Fetch coin purchase history
            const coinPurchasesRes = await api.get('/wallet/coin-purchases');
            setCoinPurchases(Array.isArray(coinPurchasesRes.data) ? coinPurchasesRes.data : []);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            setBookTransactions([]);
            setCoinPurchases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCoinsChange = (value) => {
        const coins = parseInt(value);
        if (coins > 0 && !isNaN(coins)) {
            setCoinsToBuy(coins);
            setAmount((coins / 10).toFixed(2));
        }
    };

    const handleAmountChange = (value) => {
        const amt = parseFloat(value);
        if (amt > 0 && !isNaN(amt)) {
            setAmount(amt);
            setCoinsToBuy(Math.floor(amt * 10));
        }
    };

    const handlePurchase = async () => {
        if (!accountNo || accountNo.length < 5) {
            setPurchaseError('Please enter a valid account number (minimum 5 digits)');
            return;
        }

        setPurchasing(true);
        setPurchaseError('');
        setPurchaseSuccess('');

        try {
            const response = await api.post('/wallet/buy-coins/', {
                coins: coinsToBuy,
                account_no: accountNo,
                amount: parseFloat(amount)
            });

            setPurchaseSuccess(`Successfully purchased ${coinsToBuy} coins! New balance: ${response.data.new_balance}`);
            setBalance(response.data.new_balance);
            setShowPurchaseDialog(false);
            setAccountNo('');
            fetchWalletData(); // Refresh both histories
        } catch (error) {
            setPurchaseError(error.response?.data?.error || 'Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    {/* Header */}
                    <Typography variant="h4" gutterBottom>
                        My Wallet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Manage your coins and view transaction history
                    </Typography>

                    {/* Balance Card */}
                    <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {balance} coins
                            </Typography>
                            <Typography variant="body1">
                                ≈ ${(balance / 10).toFixed(2)}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                onClick={() => setShowPurchaseDialog(true)}
                            >
                                Buy Coins
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Transaction History Tabs */}
                    <Paper sx={{ borderRadius: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                            <Tab 
                                icon={<ShoppingCartIcon />} 
                                iconPosition="start" 
                                label="Book Purchases" 
                            />
                            <Tab 
                                icon={<CurrencyExchangeIcon />} 
                                iconPosition="start" 
                                label="Coin Purchases" 
                            />
                        </Tabs>

                        {/* Book Purchases Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Book Purchase History
                                </Typography>
                                {bookTransactions.length === 0 ? (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No book purchases yet. Browse the bookstore!
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Book Title</TableCell>
                                                    <TableCell align="right">Coins Spent</TableCell>
                                                    <TableCell align="right">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bookTransactions.map((tx, index) => (
                                                    <TableRow key={tx.id || index} hover>
                                                        <TableCell>{formatDate(tx.purchased_at)}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {tx.book_title || `Book #${tx.book_id}`}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'medium' }}>
                                                            -{tx.coins_spent} coins
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip label="Completed" size="small" color="success" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        </TabPanel>

                        {/* Coin Purchases Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Coin Purchase History
                                </Typography>
                                {coinPurchases.length === 0 ? (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No coin purchases yet. Buy some coins to get started!
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Transaction</TableCell>
                                                    <TableCell align="right">Coins Added</TableCell>
                                                    <TableCell align="right">Amount Paid</TableCell>
                                                    <TableCell align="right">Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {coinPurchases.map((purchase, index) => (
                                                    <TableRow key={purchase.id || index} hover>
                                                        <TableCell>{formatDate(purchase.purchased_at)}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                Purchased {purchase.coins_purchased} coins
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Account: {purchase.account_no?.slice(-4).padStart(purchase.account_no?.length || 0, '*')}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                                                            +{purchase.coins_purchased} coins
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            ${purchase.amount_paid}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip label="Completed" size="small" color="success" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        </TabPanel>
                    </Paper>
                </Box>
            </Container>

            {/* Purchase Coins Dialog */}
            <Dialog open={showPurchaseDialog} onClose={() => setShowPurchaseDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Buy Coins
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowPurchaseDialog(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {purchaseError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {purchaseError}
                        </Alert>
                    )}
                    {purchaseSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {purchaseSuccess}
                        </Alert>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Coins to Purchase
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={coinsToBuy}
                            onChange={(e) => handleCoinsChange(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">🪙</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Amount (USD)
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Account Number
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter your account number"
                            value={accountNo}
                            onChange={(e) => setAccountNo(e.target.value)}
                            helperText="For demonstration purposes only"
                            sx={{ mb: 2 }}
                        />
                        <Alert severity="info" sx={{ mt: 2 }}>
                            💡 This is a simulation. No real payment will be processed.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setShowPurchaseDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePurchase} disabled={purchasing}>
                        {purchasing ? <CircularProgress size={24} /> : 'Confirm Purchase'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wallet-tabpanel-${index}`}
            aria-labelledby={`wallet-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export default WalletPage;