import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
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
        
        // Trigger bounce animation on component mount
        setAnimating(true);
        const timer = setTimeout(() => setAnimating(false), 1000);
        
        return () => clearTimeout(timer);
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
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of your sales pipeline</p>
            </div>

            <div className="charts-row">
                <MiniCharts stats={{ sources: stats.sources || [], statuses: stats.statuses || [] }} />
            </div>

            <div className="stats-grid">
                <div className={`stat-card ${animating ? 'bounce' : ''}`} style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon">
                        <FaUsers />
                    </div>
                    <h3>Total Leads</h3>
                    <div className="value">{stats.totalLeads}</div>
                    <div className="description">All time leads</div>
                </div>
                
                <div className={`stat-card ${animating ? 'bounce' : ''}`} style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon">
                        <FaExclamationTriangle />
                    </div>
                    <h3>New Opportunities</h3>
                    <div className="value">{stats.newOpportunities}</div>
                    <div className="description">Leads needing action</div>
                </div>
                
                <div className={`stat-card ${animating ? 'bounce' : ''}`} style={{ animationDelay: '0.3s' }}>
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>
                    <h3>Conversion Rate</h3>
                    <div className="value">{stats.conversionRate}%</div>
                    <div className="description">Leads converted</div>
                </div>
                
                <div className={`stat-card ${animating ? 'bounce' : ''}`} style={{ animationDelay: '0.4s' }}>
                    <div className="stat-icon">
                        <FaExclamationTriangle />
                    </div>
                    <h3>Lost Leads</h3>
                    <div className="value">{stats.lostLeads}</div>
                    <div className="description">Opportunities lost</div>
                </div>
            </div>

            <div className="recent-leads">
                <div className="section-header">
                    <h2>Recent Leads</h2>
                    <button onClick={() => navigate('/leads')} className="view-all">
                        View all →
                    </button>
                </div>
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Source</th>
                            <th>Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentLeads.map((lead) => (
                            <tr key={lead._id} className="lead-row">
                                <td>
                                    <div 
                                        className="lead-name clickable"
                                        onClick={() => handleLeadClick(lead._id)}
                                    >
                                        {lead.name}
                                    </div>
                                    <div className="lead-email">{lead.email}</div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td>{lead.source}</td>
                                <td>{formatDate(lead.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .dashboard {
                    max-width: 1200px;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                }
                
                .loading-spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid #e2e8f0;
                    border-top: 3px solid #4361ee;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 12px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .view-all {
                    color: #4361ee;
                    font-size: 13px;
                    font-weight: 500;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    transition: all 0.2s ease;
                }
                
                .view-all:hover {
                    color: #3a0ca3;
                    transform: translateX(3px);
                }
                
                .stat-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                
                .stat-card:nth-child(1) .stat-icon {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .stat-card:nth-child(2) .stat-icon {
                    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                }
                
                .stat-card:nth-child(3) .stat-icon {
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                }
                
                .stat-card:nth-child(4) .stat-icon {
                    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                }
                
                /* Bounce animation for stat cards */
                @keyframes bounce {
                    0%, 20%, 60%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-15px);
                    }
                    80% {
                        transform: translateY(-5px);
                    }
                }
                
                .stat-card.bounce {
                    animation: bounce 0.8s ease;
                }
                
                /* Lead name styling - no longer a link */
                .lead-name {
                    font-weight: 500;
                    color: #1e293b;
                    font-size: 14px;
                    margin-bottom: 2px;
                    cursor: default;
                }
                
                .lead-name.clickable {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-block;
                    position: relative;
                }
                
                .lead-name.clickable:hover {
                    color: #4361ee;
                    transform: translateX(3px);
                }
                
                .lead-name.clickable::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: #4361ee;
                    transition: width 0.3s ease;
                }
                
                .lead-name.clickable:hover::after {
                    width: 100%;
                }
                
                .lead-email {
                    color: #64748b;
                    font-size: 12px;
                }
                
                /* Table row hover effect */
                .lead-row {
                    transition: background-color 0.2s ease;
                }
                
                .lead-row:hover {
                    background-color: rgba(67, 97, 238, 0.03);
                }
                
                .lead-row:hover .lead-name.clickable {
                    color: #4361ee;
                    transform: translateX(3px);
                }
                
                /* Status badges */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    gap: 4px;
                }
                
                .status-badge::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .status-new {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                
                .status-new::before {
                    background: #f59e0b;
                }
                
                .status-contacted {
                    background: rgba(67, 97, 238, 0.1);
                    color: #4361ee;
                    border: 1px solid rgba(67, 97, 238, 0.2);
                }
                
                .status-contacted::before {
                    background: #4361ee;
                }
                
                .status-converted {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                
                .status-converted::before {
                    background: #10b981;
                }
                
                .status-lost {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                
                .status-lost::before {
                    background: #ef4444;
                }
                
                /* Table styles */
                .leads-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                
                .leads-table th {
                    text-align: left;
                    padding: 12px 16px;
                    border-bottom: 2px solid #e2e8f0;
                    color: #64748b;
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    background: #f8fafc;
                }
                
                .leads-table td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #e2e8f0;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;