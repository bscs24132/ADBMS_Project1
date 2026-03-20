import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ProfilePage from './pages/user/ProfilePage';
// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Placeholders
import UserDashboard from './pages/user/UserDashboard';
import WriterDashboard from './pages/writer/WriterDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // Listen for logout events from API interceptor
        const handleAuthLogout = () => {
            logout();
            navigate('/login');
        };
        
        window.addEventListener('auth:logout', handleAuthLogout);
        
        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
        };
    }, [navigate, logout]);

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
            <Route path="/profile" element={
    <ProtectedRoute>
        <ProfilePage />
    </ProtectedRoute>
} />
<Route path="/profile/:userId" element={
    <ProtectedRoute>
        <ProfilePage />
    </ProtectedRoute>
} />
            <Route path="/writer" element={
                <ProtectedRoute allowedRoles={['writer']}>
                    <WriterDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            
            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

export default App;