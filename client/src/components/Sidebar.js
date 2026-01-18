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
                        <span className="logo-icon">📊</span>
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
                            <FaTachometerAlt className="nav-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/leads" 
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <FaUsers className="nav-icon" />
                            <span>Leads</span>
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
                .sidebar {
                    width: 240px;
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    overflow-y: auto;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                }
                
                .logo-container {
                    margin-bottom: 20px;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .logo-icon {
                    font-size: 22px;
                }
                
                .sidebar h1 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0;
                    color: white;
                    letter-spacing: 0.5px;
                }
                
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                    flex-shrink: 0;
                }
                
                .user-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .user-name {
                    font-size: 13px;
                    font-weight: 600;
                    margin: 0 0 2px 0;
                    color: white;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .user-email {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .sidebar-nav {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    min-height: 0;
                }
                
                .nav-title {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 16px;
                    font-weight: 500;
                }
                
                .sidebar-nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .sidebar-nav li {
                    margin-bottom: 6px;
                }
                
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                }
                
                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                .nav-link.active {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                    color: white;
                    border-left: 3px solid #667eea;
                }
                
                .nav-icon {
                    font-size: 14px;
                    width: 16px;
                }
                
                
                .sidebar-footer {
                    padding: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                }
                
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border-color: rgba(239, 68, 68, 0.3);
                }
                
                @media (max-width: 768px) {
                    .sidebar {
                        width: 100%;
                        position: static;
                        height: auto;
                    }
                    
                    .main-content {
                        margin-left: 0;
                    }
                    
                    .sidebar-header {
                        padding: 16px;
                    }
                    
                    .sidebar-nav {
                        padding: 16px;
                    }
                    
                    .quick-stats {
                        margin: 0 12px 12px 12px;
                    }
                    
                    .sidebar-footer {
                        padding: 16px;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;