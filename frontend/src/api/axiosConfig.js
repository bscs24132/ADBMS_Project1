import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 without page reload
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Only try refresh if it's 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }
                
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refresh: refreshToken
                });
                
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // Clear tokens and redirect WITHOUT page reload
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                // Use React Router navigation, not window.location
                // We'll handle this in the component
                window.dispatchEvent(new CustomEvent('auth:logout'));
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;