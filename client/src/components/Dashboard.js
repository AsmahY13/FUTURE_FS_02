import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaUsers, FaChartLine, FaExclamationTriangle, FaFire } from 'react-icons/fa';
import { leadAPI } from '../services/api';
import MiniCharts from './MiniCharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        newOpportunities: 0,
        conversionRate: 0,
        lostLeads: 0
    });
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animating, setAnimating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        setAnimating(true);
        // Remove artificial delay, set animating false as soon as data is loaded
        // Animations will be handled by CSS if needed
        // No setTimeout here
        return () => {};
    }, []);

    const fetchData = async () => {
        try {
            const [statsResponse, leadsResponse] = await Promise.all([
                leadAPI.getStats(),
                leadAPI.getAll()
            ]);
            setStats(statsResponse.data);
            setRecentLeads(leadsResponse.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setAnimating(false);
        }
    };

    const handleLeadClick = (leadId) => {
        navigate(`/leads/${leadId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Complete overview of your sales pipeline</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className={`stat-card stat-primary ${animating ? 'fade-in' : ''}`} style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card-inner">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <FaUsers className="stat-icon" />
                            </div>
                            <div className="stat-trend positive">
                                <FaArrowUp size={12} />
                                <span>+12%</span>
                            </div>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-label">Total Leads</h3>
                            <div className="stat-value">{stats.totalLeads}</div>
                            <p className="stat-description">All time lead acquisitions</p>
                        </div>
                    </div>
                    <div className="stat-card-glow"></div>
                </div>
                
                <div className={`stat-card stat-warning ${animating ? 'fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card-inner">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <FaFire className="stat-icon" />
                            </div>
                            <div className="stat-trend hot">
                                <span className="pulse-dot"></span>
                                <span>Active</span>
                            </div>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-label">New Opportunities</h3>
                            <div className="stat-value">{stats.newOpportunities}</div>
                            <p className="stat-description">Leads requiring immediate action</p>
                        </div>
                    </div>
                    <div className="stat-card-glow"></div>
                </div>
                
                <div className={`stat-card stat-success ${animating ? 'fade-in' : ''}`} style={{ animationDelay: '0.3s' }}>
                    <div className="stat-card-inner">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <FaChartLine className="stat-icon" />
                            </div>
                            <div className="stat-trend positive">
                                <FaArrowUp size={12} />
                                <span>+8%</span>
                            </div>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-label">Conversion Rate</h3>
                            <div className="stat-value">{stats.conversionRate}%</div>
                            <p className="stat-description">Successfully converted leads</p>
                        </div>
                    </div>
                    <div className="stat-card-glow"></div>
                </div>
                
                <div className={`stat-card stat-danger ${animating ? 'fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
                    <div className="stat-card-inner">
                        <div className="stat-header">
                            <div className="stat-icon-wrapper">
                                <FaExclamationTriangle className="stat-icon" />
                            </div>
                            <div className="stat-trend negative">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 0L0 6L6 12L12 6L6 0Z" fill="currentColor" opacity="0.3"/>
                                </svg>
                                <span>-3%</span>
                            </div>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-label">Lost Leads</h3>
                            <div className="stat-value">{stats.lostLeads}</div>
                            <p className="stat-description">Opportunities marked as lost</p>
                        </div>
                    </div>
                    <div className="stat-card-glow"></div>
                </div>
            </div>

            <div className="charts-section">
                <div className="section-header">
                    <h2 className="section-title">Analytics Overview</h2>
                    <p className="section-subtitle">Visual breakdown of lead distribution</p>
                </div>
                <MiniCharts stats={{ sources: stats.sources || [], statuses: stats.statuses || [] }} />
            </div>

            <div className="recent-leads-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Recent Activity</h2>
                        <p className="section-subtitle">Latest leads in your pipeline</p>
                    </div>
                    <button onClick={() => navigate('/leads')} className="view-all-btn">
                        View all leads
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="leads-table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Lead Information</th>
                                <th>Status</th>
                                <th>Source</th>
                                <th>Date Added</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLeads.map((lead, index) => (
                                <tr 
                                    key={lead._id} 
                                    className={`lead-row ${animating ? 'slide-in' : ''}`}
                                    style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
                                >
                                    <td>
                                        <div className="lead-info">
                                            <div className="lead-avatar">
                                                {lead.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="lead-details">
                                                <div 
                                                    className="lead-name"
                                                    onClick={() => handleLeadClick(lead._id)}
                                                >
                                                    {lead.name}
                                                </div>
                                                <div className="lead-email">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                                            <span className="status-dot"></span>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="source-tag">{lead.source}</span>
                                    </td>
                                    <td>
                                        <span className="date-text">{formatDate(lead.createdAt)}</span>
                                    </td>
                                    <td>
                                        <button 
                                            className="action-btn"
                                            onClick={() => handleLeadClick(lead._id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
                
                :root {
                    --color-primary: #6366f1;
                    --color-primary-dark: #4f46e5;
                    --color-success: #10b981;
                    --color-warning: #f59e0b;
                    --color-danger: #ef4444;
                    --color-bg: #fafbfc;
                    --color-surface: #ffffff;
                    --color-border: #e5e7eb;
                    --color-text: #111827;
                    --color-text-muted: #6b7280;
                    --color-text-light: #9ca3af;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --radius-sm: 8px;
                    --radius-md: 12px;
                    --radius-lg: 16px;
                }
                
                .dashboard {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 32px 24px;
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: var(--color-bg);
                    min-height: 100vh;
                }
                
                /* Loading State */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 20px;
                }
                
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid var(--color-border);
                    border-top: 4px solid var(--color-primary);
                    border-radius: 50%;
                    animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }
                
                .loading-text {
                    font-size: 15px;
                    color: var(--color-text-muted);
                    font-weight: 500;
                    letter-spacing: 0.01em;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 48px;
                    padding-bottom: 24px;
                    border-bottom: 2px solid var(--color-border);
                }
                
                .header-content {
                    flex: 1;
                }
                
                .dashboard-title {
                    font-size: 42px;
                    font-weight: 700;
                    color: var(--color-text);
                    margin: 0 0 8px 0;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }
                
                .dashboard-subtitle {
                    font-size: 16px;
                    color: var(--color-text-muted);
                    margin: 0;
                    font-weight: 400;
                }
                
                .header-actions {
                    display: flex;
                    gap: 12px;
                }
                
                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    margin-bottom: 48px;
                }
                
                .stat-card {
                    position: relative;
                    background: var(--color-surface);
                    border: 1.5px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 28px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }
                
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, var(--card-color), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .stat-card:hover::before {
                    opacity: 1;
                }
                
                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-xl);
                    border-color: var(--card-color);
                }
                
                .stat-card.stat-primary {
                    --card-color: var(--color-primary);
                }
                
                .stat-card.stat-warning {
                    --card-color: var(--color-warning);
                }
                
                .stat-card.stat-success {
                    --card-color: var(--color-success);
                }
                
                .stat-card.stat-danger {
                    --card-color: var(--color-danger);
                }
                
                .stat-card-inner {
                    position: relative;
                    z-index: 1;
                }
                
                .stat-card-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, var(--card-color) 0%, transparent 70%);
                    opacity: 0;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }
                
                .stat-card:hover .stat-card-glow {
                    opacity: 0.05;
                }
                
                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                
                .stat-icon-wrapper {
                    width: 56px;
                    height: 56px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--card-color), transparent);
                    opacity: 0.1;
                    position: relative;
                }
                
                .stat-icon {
                    font-size: 24px;
                    color: var(--card-color);
                    position: relative;
                    z-index: 1;
                }
                
                .stat-trend {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .stat-trend.positive {
                    background: rgba(16, 185, 129, 0.1);
                    color: var(--color-success);
                }
                
                .stat-trend.negative {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--color-danger);
                }
                
                .stat-trend.hot {
                    background: rgba(245, 158, 11, 0.1);
                    color: var(--color-warning);
                }
                
                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--color-warning);
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
                
                .stat-content {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .stat-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--color-text-muted);
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .stat-value {
                    font-size: 48px;
                    font-weight: 700;
                    color: var(--color-text);
                    line-height: 1;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: -0.02em;
                }
                
                .stat-description {
                    font-size: 13px;
                    color: var(--color-text-light);
                    margin: 0;
                    line-height: 1.5;
                }
                
                /* Charts Section */
                .charts-section {
                    margin-bottom: 48px;
                }
                
                /* Section Headers */
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                }
                
                .section-title {
                    font-size: 28px;
                    font-weight: 600;
                    color: var(--color-text);
                    margin: 0 0 4px 0;
                    letter-spacing: -0.01em;
                }
                
                .section-subtitle {
                    font-size: 14px;
                    color: var(--color-text-muted);
                    margin: 0;
                }
                
                .view-all-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Outfit', sans-serif;
                }
                
                .view-all-btn:hover {
                    background: var(--color-primary-dark);
                    transform: translateX(4px);
                    box-shadow: var(--shadow-md);
                }
                
                .view-all-btn svg {
                    transition: transform 0.2s ease;
                }
                
                .view-all-btn:hover svg {
                    transform: translateX(4px);
                }
                
                /* Recent Leads Section */
                .recent-leads-section {
                    background: var(--color-surface);
                    border: 1.5px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 32px;
                }
                
                .leads-table-container {
                    overflow-x: auto;
                    border-radius: var(--radius-md);
                }
                
                .leads-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                
                .leads-table thead tr {
                    background: var(--color-bg);
                }
                
                .leads-table th {
                    text-align: left;
                    padding: 16px 20px;
                    color: var(--color-text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.08em;
                    border-bottom: 2px solid var(--color-border);
                }
                
                .leads-table tbody tr {
                    transition: all 0.2s ease;
                    border-bottom: 1px solid var(--color-border);
                }
                
                .leads-table tbody tr:hover {
                    background: rgba(99, 102, 241, 0.02);
                }
                
                .leads-table tbody tr:last-child {
                    border-bottom: none;
                }
                
                .leads-table td {
                    padding: 20px;
                }
                
                .lead-info {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                
                .lead-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-primary), #818cf8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    flex-shrink: 0;
                }
                
                .lead-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }
                
                .lead-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--color-text);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-block;
                    position: relative;
                }
                
                .lead-name::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--color-primary);
                    transition: width 0.3s ease;
                }
                
                .lead-name:hover {
                    color: var(--color-primary);
                }
                
                .lead-name:hover::after {
                    width: 100%;
                }
                
                .lead-email {
                    font-size: 13px;
                    color: var(--color-text-light);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    gap: 6px;
                }
                
                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .status-new {
                    background: rgba(245, 158, 11, 0.12);
                    color: #d97706;
                }
                
                .status-new .status-dot {
                    background: #f59e0b;
                    box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
                }
                
                .status-contacted {
                    background: rgba(99, 102, 241, 0.12);
                    color: #4f46e5;
                }
                
                .status-contacted .status-dot {
                    background: #6366f1;
                    box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
                }
                
                .status-converted {
                    background: rgba(16, 185, 129, 0.12);
                    color: #059669;
                }
                
                .status-converted .status-dot {
                    background: #10b981;
                    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
                }
                
                .status-lost {
                    background: rgba(239, 68, 68, 0.12);
                    color: #dc2626;
                }
                
                .status-lost .status-dot {
                    background: #ef4444;
                    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                }
                
                .source-tag {
                    display: inline-block;
                    padding: 6px 12px;
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-sm);
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--color-text);
                }
                
                .date-text {
                    font-size: 13px;
                    color: var(--color-text-muted);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: var(--radius-sm);
                    border: 1.5px solid var(--color-border);
                    background: var(--color-surface);
                    color: var(--color-text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .action-btn:hover {
                    background: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                    transform: translateX(4px);
                }
                
                /* Animations */
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .fade-in {
                    animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                }
                
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .slide-in {
                    animation: slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .dashboard {
                        padding: 20px 16px;
                    }
                    
                    .dashboard-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .dashboard-title {
                        font-size: 32px;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .leads-table-container {
                        overflow-x: scroll;
                    }
                    
                    .section-header {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;