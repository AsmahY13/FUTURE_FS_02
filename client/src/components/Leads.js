import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaPhone, FaGlobe, FaCalendar } from 'react-icons/fa';
import { leadAPI } from '../services/api';
import LeadForm from './LeadForm';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [searchTerm]);

    const fetchLeads = async () => {
        try {
            const response = await leadAPI.getAll(searchTerm);
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLead = async (leadData) => {
        try {
            await leadAPI.create(leadData);
            fetchLeads();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating lead:', error);
            alert('Failed to create lead. Please try again.');
        }
    };

    const handleDeleteLead = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await leadAPI.delete(id);
                fetchLeads();
            } catch (error) {
                console.error('Error deleting lead:', error);
                alert('Failed to delete lead. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading leads...</p>
            </div>
        );
    }

    return (
        <div className="leads-container">
            <div className="leads-header">
                <div className="header-left">
                    <h1>Leads</h1>
                    <p className="subtitle">Manage client pipeline</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button 
                        className="btn btn-primary create-btn"
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus /> <span>New Lead</span>
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <LeadForm 
                            onSubmit={handleCreateLead}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {filteredLeads.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">📋</div>
                        <h3>No leads found</h3>
                        <p>{searchTerm ? 'Try a different search term' : 'Create your first lead'}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            <FaPlus /> Create Lead
                        </button>
                    </div>
                </div>
            ) : (
                <div className="leads-grid">
                    {filteredLeads.map((lead) => (
                        <div key={lead._id} className="lead-card">
                            <div className="lead-card-header">
                                <div className="lead-avatar">
                                    {lead.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="lead-info">
                                    <Link to={`/leads/${lead._id}`} className="lead-name">
                                        {lead.name}
                                    </Link>
                                    <p className="lead-email">{lead.email}</p>
                                </div>
                                <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                                    {lead.status}
                                </span>
                            </div>
                            
                            <div className="lead-card-body">
                                <div className="lead-meta">
                                    <div className="meta-item">
                                        <FaPhone className="meta-icon" />
                                        <span>{lead.phone || 'No phone'}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaGlobe className="meta-icon" />
                                        <span>{lead.source}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaCalendar className="meta-icon" />
                                        <span>{formatDate(lead.createdAt)}</span>
                                    </div>
                                </div>
                                
                                <div className="lead-card-actions">
                                    <Link to={`/leads/${lead._id}`} className="btn btn-secondary">
                                        View
                                    </Link>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteLead(lead._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .leads-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 12px;
                }
                
                .leads-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .header-left h1 {
                    font-size: 22px;
                    color: #2c3e50;
                    margin: 0 0 3px 0;
                    font-weight: 600;
                }
                
                .subtitle {
                    color: #6c757d;
                    font-size: 12px;
                    margin: 0;
                }
                
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .search-box {
                    position: relative;
                    width: 220px;
                }
                
                .search-icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #95a5a6;
                    font-size: 12px;
                }
                
                .search-input {
                    width: 100%;
                    padding: 8px 10px 8px 30px;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    font-size: 12px;
                    background: white;
                    transition: all 0.2s;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }
                
                .clear-search {
                    position: absolute;
                    right: 6px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #e9ecef;
                    border: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    color: #6c757d;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    line-height: 1;
                }
                
                .clear-search:hover {
                    background: #dee2e6;
                }
                
                .create-btn {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 12px;
                    font-weight: 500;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                }
                
                .create-btn span {
                    margin-left: 0;
                }
                
                .leads-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 15px;
                }
                
                @media (max-width: 1200px) {
                    .leads-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    }
                }
                
                @media (max-width: 768px) {
                    .leads-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .lead-card {
                    background: white;
                    border-radius: 6px;
                    padding: 12px;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    transition: all 0.2s;
                }
                
                .lead-card:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }
                
                .lead-card-header {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 12px;
                    gap: 10px;
                }
                
                .lead-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    flex-shrink: 0;
                }
                
                .lead-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .lead-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                    text-decoration: none;
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }
                
                .lead-name:hover {
                    color: #667eea;
                }
                
                .lead-email {
                    color: #6c757d;
                    font-size: 11px;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .lead-card-body {
                    padding-top: 10px;
                    border-top: 1px solid #f8f9fa;
                }
                
                .lead-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 12px;
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #6c757d;
                    font-size: 11px;
                }
                
                .meta-icon {
                    color: #adb5bd;
                    font-size: 10px;
                    width: 12px;
                    flex-shrink: 0;
                }
                
                .lead-card-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .btn {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    flex: 1;
                }
                
                .btn-secondary {
                    background: #f8f9fa;
                    color: #495057;
                    border: 1px solid #dee2e6;
                }
                
                .btn-secondary:hover {
                    background: #e9ecef;
                }
                
                .btn-danger {
                    background: #e63946;
                    color: white;
                }
                
                .btn-danger:hover {
                    background: #d32f2f;
                }
                
                .btn-primary {
                    background: #667eea;
                    color: white;
                    border: none;
                }
                
                .btn-primary:hover {
                    background: #5a67d8;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    white-space: nowrap;
                    border: 1px solid;
                }
                
                .status-new {
                    background-color: rgba(255, 193, 7, 0.1);
                    color: #ffc107;
                    border-color: rgba(255, 193, 7, 0.3);
                }
                
                .status-contacted {
                    background-color: rgba(13, 110, 253, 0.1);
                    color: #0d6efd;
                    border-color: rgba(13, 110, 253, 0.3);
                }
                
                .status-converted {
                    background-color: rgba(25, 135, 84, 0.1);
                    color: #198754;
                    border-color: rgba(25, 135, 84, 0.3);
                }
                
                .status-lost {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                    border-color: rgba(220, 53, 69, 0.3);
                }
                
                .empty-state {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 300px;
                    padding: 20px;
                }
                
                .empty-state-content {
                    text-align: center;
                    padding: 24px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                    max-width: 320px;
                    width: 100%;
                }
                
                .empty-state-icon {
                    font-size: 40px;
                    margin-bottom: 12px;
                }
                
                .empty-state-content h3 {
                    font-size: 16px;
                    color: #2c3e50;
                    margin: 0 0 6px 0;
                    font-weight: 600;
                }
                
                .empty-state-content p {
                    color: #6c757d;
                    margin: 0 0 16px 0;
                    font-size: 12px;
                }
                
                .empty-state-content .btn {
                    padding: 8px 16px;
                    font-size: 12px;
                }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    width: 90%;
                    max-width: 450px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                }
                
                .loading-spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 12px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .leads-header {
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .search-box {
                        width: 100%;
                    }
                    
                    .create-btn {
                        align-self: flex-start;
                    }
                    
                    .lead-card-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default Leads;