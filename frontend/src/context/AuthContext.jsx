import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
        } catch (err) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
    setError(null);
    try {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setUser(response.data.user);
        return { success: true };
    } catch (err) {
        let errorMsg = err.response?.data?.error || 'Invalid credentials';
        setError(errorMsg);
        return { success: false, error: errorMsg };
    }
};

    const register = async (userData) => {
    setError(null);
    try {
        const response = await api.post('/auth/register', userData);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setUser(response.data.user);
        return { success: true };
    } catch (err) {
        console.log('Full error object:', err);
        console.log('Error response:', err.response);
        console.log('Error data:', err.response?.data);
        
        // Extract detailed error message from backend
        let errorMsg = 'Registration failed. Please check your information.';
        
        if (err.response?.data) {
            const data = err.response.data;
            
            // Handle different error formats from Django
            if (typeof data === 'string') {
                errorMsg = data;
            } 
            // Handle username error
            else if (data.username) {
                const usernameErrors = Array.isArray(data.username) ? data.username.join(', ') : data.username;
                errorMsg = `❌ Username: ${usernameErrors}`;
            }
            // Handle email error
            else if (data.email) {
                const emailErrors = Array.isArray(data.email) ? data.email.join(', ') : data.email;
                errorMsg = `❌ Email: ${emailErrors}`;
            }
            // Handle password error
            else if (data.password) {
                const passwordErrors = Array.isArray(data.password) ? data.password.join(', ') : data.password;
                errorMsg = `❌ Password: ${passwordErrors}`;
            }
            // Handle non-field error
            else if (data.non_field_errors) {
                errorMsg = data.non_field_errors.join(', ');
            }
            // Handle error field
            else if (data.error) {
                errorMsg = data.error;
            }
            // Handle detail field (DRF format)
            else if (data.detail) {
                errorMsg = data.detail;
            }
            // Try to get first error message
            else {
                const firstKey = Object.keys(data)[0];
                if (firstKey && data[firstKey]) {
                    errorMsg = `❌ ${firstKey}: ${data[firstKey]}`;
                } else {
                    errorMsg = JSON.stringify(data);
                }
            }
        }
        
        console.log('Final error message:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
    }
};

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await api.post('/auth/logout', { refresh: refreshToken });
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isWriter: user?.role === 'writer',
        isUser: user?.role === 'user',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};