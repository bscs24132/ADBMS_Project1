import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import SearchPage from './pages/SearchPage';
import BookDetailsPage from './pages/BookDetailsPage';
import MyBooksPage from './pages/MyBooksPage';
import NotebookPage from './pages/NotebookPage';
import EditProfilePage from './pages/EditProfilePage';
import GroupChatsPage from './pages/GroupChatsPage';
import ProfilePage from './pages/ProfilePage';  // ← Not './pages/user/ProfilePage'
import GroupChatPage from './pages/GroupChatPage';
// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WalletPage from './pages/WalletPage';
// Dashboard Placeholders
import UserDashboard from './pages/user/UserDashboard';
import WriterDashboard from './pages/writer/WriterDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    const location = useLocation();
    const { logout } = useAuth();

    // Save scroll position before navigating away
    useEffect(() => {
        const handleBeforeUnload = () => {
            const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
            scrollPositions[location.pathname] = window.scrollY;
            sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [location]);

    // Restore scroll position when coming back
    useEffect(() => {
        const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
        const savedPosition = scrollPositions[location.pathname];
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, savedPosition);
            }, 100);
        }
    }, [location]);

    // Listen for logout events from API interceptor
    useEffect(() => {
        const handleAuthLogout = () => {
            logout();
            // Don't navigate here, let the component handle it
        };
        
        window.addEventListener('auth:logout', handleAuthLogout);
        
        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
        };
    }, [logout]);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <UserDashboard />
                </ProtectedRoute>
            } />
            <Route path="/search" element={
    <ProtectedRoute>
        <SearchPage />
    </ProtectedRoute>
} />
<Route path="/groups" element={
    <ProtectedRoute>
        <GroupChatsPage />
    </ProtectedRoute>
} />
<Route path="/profile/edit" element={
    <ProtectedRoute>
        <EditProfilePage />
    </ProtectedRoute>
} />
<Route path="/groupchats/:groupId" element={
    <ProtectedRoute>
        <GroupChatPage />
    </ProtectedRoute>
} />
            <Route path="/writer" element={
                <ProtectedRoute allowedRoles={['writer']}>
                    <WriterDashboard />
                </ProtectedRoute>
            } />
            <Route path="/my-books" element={
    <ProtectedRoute>
        <MyBooksPage />
    </ProtectedRoute>
} />
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/wallet" element={
    <ProtectedRoute>
        <WalletPage />
    </ProtectedRoute>
} />
            <Route path="/profile/:userId" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/notebooks/:notebookId" element={
    <ProtectedRoute>
        <NotebookPage />
    </ProtectedRoute>
} />
            <Route path="/books/:bookId" element={
    <ProtectedRoute>
        <BookDetailsPage />
    </ProtectedRoute>
} />
            
            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default App;