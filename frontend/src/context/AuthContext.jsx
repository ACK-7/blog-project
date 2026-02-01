import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (storedUser && token) {
                try {
                    // Verify token is still valid and get fresh user data
                    const response = await api.get('/user');
                    setUser(response.data.user);
                    setEmailVerified(response.data.email_verified || false);
                } catch (error) {
                    console.error('Token validation error:', error);
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setEmailVerified(false);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { user, access_token, email_verified } = response.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setEmailVerified(email_verified || false);
        
        return response.data;
    };

    const register = async (name, email, phone, password, password_confirmation) => {
        // Debug: Log the data being sent to API
        const requestData = { name, email, phone, password, password_confirmation };
        console.log('API request data:', requestData);
        
        const response = await api.post('/register', requestData);
        const { user, access_token, email_verified } = response.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setEmailVerified(email_verified || false);
        
        return response.data;
    };

    const refreshUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data.user);
            setEmailVerified(response.data.email_verified || false);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setEmailVerified(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            emailVerified, 
            login, 
            register, 
            logout, 
            loading, 
            refreshUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};