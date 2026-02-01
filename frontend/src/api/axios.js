import axios from 'axios';
import env from '../config/env';

const api = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 30000, // Increased to 30 seconds temporarily
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;