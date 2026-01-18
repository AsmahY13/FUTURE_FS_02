import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import LeadDetail from './components/LeadDetail';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
    const [user, setUser] = useState(authAPI.getCurrentUser());

    useEffect(() => {
        // Check auth status on mount
        setIsAuthenticated(authAPI.isAuthenticated());
        setUser(authAPI.getCurrentUser());
    }, []);

    const handleLogin = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="app">
            <Sidebar user={user} onLogout={handleLogout} />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;