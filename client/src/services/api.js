import axios from 'axios';

// ✅ UPDATED: Fixed API_URL to include /api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // ✅ ADDED: For CORS with credentials
    withCredentials: false, // Set to true if using cookies
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // ✅ UPDATED: Changed from 'x-auth-token' to 'Authorization' header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Lead API calls
export const leadAPI = {
    getAll: (search = '') => api.get(`/api/leads?search=${search}`), // ✅ Added /api/
    getById: (id) => api.get(`/api/leads/${id}`), // ✅ Added /api/
    create: (leadData) => api.post('/api/leads', leadData), // ✅ Added /api/
    update: (id, leadData) => api.put(`/api/leads/${id}`, leadData), // ✅ Added /api/
    delete: (id) => api.delete(`/api/leads/${id}`), // ✅ Added /api/
    addNote: (id, note) => api.post(`/api/leads/${id}/notes`, { content: note }), // ✅ Added /api/
    getStats: () => api.get('/api/leads/stats/summary'), // ✅ Added /api/
    submitContact: (data) => api.post('/api/contact', data), // ✅ Added /api/
};

// Auth API calls
export const authAPI = {
    login: (email, password) => api.post('/api/login', { email, password }), // ✅ Added /api/
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default api;