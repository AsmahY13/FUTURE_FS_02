import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaSignOutAlt,
  FaCog,
  FaBell
} from 'react-icons/fa';
import { leadAPI } from '../services/api';

const Sidebar = ({ user, onLogout }) => {
    const [quickStats, setQuickStats] = useState({
        newToday: 0,
        conversionRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuickStats();
        
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchQuickStats, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchQuickStats = async () => {
        try {
            // Fetch leads to calculate today's new leads
            const leadsResponse = await leadAPI.getAll();
            const leads = leadsResponse.data;
            
            // Get today's date
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            
            // Count leads created today
            const newToday = leads.filter(lead => {
                const leadDate = new Date(lead.createdAt).toISOString().split('T')[0];
                return leadDate === todayString;
            }).length;
            
            // Calculate conversion rate
            const totalLeads = leads.length;
            const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
            const conversionRate = totalLeads > 0 
                ? Math.round((convertedLeads / totalLeads) * 100) 
                : 0;
            
            setQuickStats({
                newToday,
                conversionRate
            });
        } catch (error) {
            console.error('Error fetching quick stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#sidebarGradient)"/>
                                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <defs>
                                    <linearGradient id="sidebarGradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop offset="0%" stopColor="#6366f1"/>
                                        <stop offset="100%" stopColor="#8b5cf6"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1>MiniCRM</h1>
                    </div>
                </div>
                
                <div className="user-profile">
                    <div className="avatar">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h3 className="user-name">Admin</h3>
                        <p className="user-email">{user?.email}</p>
                    </div>
                </div>
            </div>
            
            <div className="sidebar-nav">
                <h3 className="nav-title">Navigation</h3>
                <ul>
                    <li>
                        <NavLink 
                            to="/dashboard" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <div className="nav-icon-wrapper">
                                <FaTachometerAlt className="nav-icon" />
                            </div>
                            <span>Dashboard</span>
                            <div className="active-indicator"></div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/leads" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <div className="nav-icon-wrapper">
                                <FaUsers className="nav-icon" />
                            </div>
                            <span>Leads</span>
                            <div className="active-indicator"></div>
                        </NavLink>
                    </li>
                </ul>
            </div>
            
            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-btn">
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                </button>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
                
                * {
                    box-sizing: border-box;
                }
                
                .sidebar {
                    width: 250px;
                    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    overflow-y: auto;
                    border-right: 1px solid rgba(255, 255, 255, 0.08);
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
                }
                
                .sidebar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .sidebar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .sidebar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                
                .sidebar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .sidebar-header {
                    padding: 32px 24px 28px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    flex-shrink: 0;
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .logo-container {
                    margin-bottom: 24px;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .logo-icon {
                    flex-shrink: 0;
                }
                
                .sidebar h1 {
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0;
                    color: white;
                    letter-spacing: -0.01em;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.2s ease;
                }
                
                .user-profile:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(99, 102, 241, 0.3);
                }
                
                .avatar {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                
                .user-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .user-name {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 4px 0;
                    color: white;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .user-email {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-weight: 500;
                }
                
                .sidebar-nav {
                    flex: 1;
                    padding: 24px 16px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    min-height: 0;
                }
                
                .nav-title {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0 0 16px 12px;
                    font-weight: 700;
                }
                
                .sidebar-nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .sidebar-nav li {
                    margin: 0;
                }
                
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    position: relative;
                    overflow: hidden;
                }
                
                .nav-link::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 3px;
                    background: linear-gradient(180deg, #6366f1, #8b5cf6);
                    transform: translateX(-3px);
                    transition: transform 0.2s ease;
                }
                
                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.95);
                }
                
                .nav-link:hover .nav-icon-wrapper {
                    background: rgba(99, 102, 241, 0.15);
                    transform: scale(1.05);
                }
                
                .nav-link.active {
                    background: rgba(99, 102, 241, 0.12);
                    color: white;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                }
                
                .nav-link.active::before {
                    transform: translateX(0);
                }
                
                .nav-link.active .nav-icon-wrapper {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }
                
                .nav-link.active .nav-icon {
                    color: white;
                }
                
                .nav-icon-wrapper {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    flex-shrink: 0;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .nav-icon {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.7);
                    transition: color 0.2s ease;
                }
                
                .nav-link:hover .nav-icon {
                    color: rgba(255, 255, 255, 0.95);
                }
                
                .active-indicator {
                    display: none;
                }
                
                .sidebar-footer {
                    padding: 20px 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    flex-shrink: 0;
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 14px 16px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1.5px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: left;
                    font-family: 'Outfit', sans-serif;
                }
                
                .logout-btn svg {
                    font-size: 16px;
                }
                
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.12);
                    color: #fca5a5;
                    border-color: rgba(239, 68, 68, 0.3);
                    transform: translateY(-1px);
                }
                
                .logout-btn:active {
                    transform: translateY(0);
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .sidebar {
                        width: 100%;
                        position: static;
                        height: auto;
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    }
                    
                    .sidebar-header {
                        padding: 20px 16px;
                    }
                    
                    .logo-container {
                        margin-bottom: 16px;
                    }
                    
                    .sidebar-nav {
                        padding: 20px 16px;
                    }
                    
                    .sidebar-nav ul {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                    }
                    
                    .nav-link {
                        justify-content: center;
                        flex-direction: column;
                        gap: 8px;
                        padding: 16px 12px;
                    }
                    
                    .nav-link span {
                        font-size: 12px;
                    }
                    
                    .sidebar-footer {
                        padding: 16px;
                    }
                }
                
                @media (max-width: 480px) {
                    .sidebar-header {
                        padding: 16px;
                    }
                    
                    .user-profile {
                        padding: 12px;
                    }
                    
                    .avatar {
                        width: 40px;
                        height: 40px;
                        font-size: 15px;
                    }
                    
                    .user-name {
                        font-size: 13px;
                    }
                    
                    .user-email {
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;