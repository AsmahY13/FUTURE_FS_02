import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaGlobe,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaChartLine,
  FaLightbulb,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import { leadAPI } from '../services/api';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const response = await leadAPI.getById(id);
            setLead(response.data);
        } catch (error) {
            console.error('Error fetching lead:', error);
            alert('Failed to load lead details');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            const response = await leadAPI.update(id, { ...lead, status: newStatus });
            setLead(response.data);
            showNotification(`Status updated to ${newStatus}`, 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('Failed to update status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) {
            showNotification('Please enter a note', 'error');
            return;
        }

        try {
            await leadAPI.addNote(id, newNote);
            setNewNote('');
            fetchLead();
            showNotification('Note added successfully!', 'success');
        } catch (error) {
            console.error('Error adding note:', error);
            showNotification('Failed to add note', 'error');
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

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading lead details...</p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="lead-not-found">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    <FaArrowLeft /> Back to Leads
                </button>
                <div className="empty-state">
                    <h3>Lead Not Found</h3>
                    <p>The lead you're looking for doesn't exist or has been deleted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lead-detail">
            {/* Notification */}
            {notification.show && (
                <div className={`notification notification-${notification.type}`}>
                    <div className="notification-content">
                        <FaCheckCircle className="notification-icon" />
                        <span>{notification.message}</span>
                        <button 
                            className="notification-close"
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="lead-detail-header">
                <div className="header-left">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn-back"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <div className="lead-title-section">
                        <h1>{lead.name}</h1>
                        <div className="lead-meta">
                            <span className="meta-item">
                                <FaCalendar /> {formatDate(lead.createdAt)}
                            </span>
                            <span className="meta-divider">•</span>
                            <span className="meta-item">
                                Source: {lead.source}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="status-selector">
                        <label>Status</label>
                        <div className="status-dropdown-container">
                            <select 
                                value={lead.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                disabled={updatingStatus}
                                className={`status-dropdown status-${lead.status.toLowerCase()}`}
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                            {updatingStatus && <span className="updating-dots">...</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="lead-content-grid">
                {/* Left Column - Compact Cards */}
                <div className="left-column">
                    {/* Contact Details Card - Tighter */}
                    <div className="card tight contact-details">
                        <div className="card-header tight-header">
                            <h2><FaUser /> Contact Details</h2>
                        </div>
                        <div className="card-body tight-body">
                            <div className="detail-list">
                                <div className="detail-item tight-item">
                                    <div className="detail-label">
                                        <FaEnvelope />
                                    </div>
                                    <div className="detail-content">
                                        <a href={`mailto:${lead.email}`} className="detail-value">
                                            {lead.email}
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="detail-item tight-item">
                                    <div className="detail-label">
                                        <FaPhone />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-value">
                                            {lead.phone || 'Not provided'}
                                        </span>
                                    </div>
                                </div>
                                
                                {lead.company && (
                                    <div className="detail-item tight-item">
                                        <div className="detail-label">
                                            <FaBuilding />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-value">
                                                {lead.company}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="detail-item tight-item">
                                    <div className="detail-label">
                                        <FaGlobe />
                                    </div>
                                    <div className="detail-content">
                                        <span className="detail-value">
                                            {lead.source}
                                        </span>
                                    </div>
                                </div>
                                
                                {lead.location && (
                                    <div className="detail-item tight-item">
                                        <div className="detail-label">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-value">
                                                {lead.location}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {lead.estimatedValue && (
                                    <div className="detail-item tight-item">
                                        <div className="detail-label">
                                            <FaDollarSign />
                                        </div>
                                        <div className="detail-content">
                                            <span className="detail-value highlight">
                                                ${lead.estimatedValue.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pro Tip Card - Tighter */}
                    <div className="card tight pro-tip">
                        <div className="card-header tight-header">
                            <h2><FaLightbulb /> Quick Tips</h2>
                        </div>
                        <div className="card-body tight-body">
                            <div className="tip-list">
                                <div className="tip-item tight-tip">
                                    <FaChartLine className="tip-icon" />
                                    <div className="tip-text">
                                        Update status regularly
                                    </div>
                                </div>
                                <div className="tip-item tight-tip">
                                    <FaPhone className="tip-icon" />
                                    <div className="tip-text">
                                        Follow up within 24h
                                    </div>
                                </div>
                                <div className="tip-item tight-tip">
                                    <FaEnvelope className="tip-icon" />
                                    <div className="tip-text">
                                        Personalize emails
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Notes */}
                <div className="right-column">
                    <div className="card notes-section">
                        <div className="card-header">
                            <h2>Notes & Follow-ups</h2>
                            <span className="notes-count">
                                {lead.notes ? lead.notes.length : 0}
                            </span>
                        </div>
                        
                        <div className="card-body">
                            <form onSubmit={handleAddNote} className="note-form">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note or follow-up activity..."
                                    rows="3"
                                    className="note-input"
                                />
                                <div className="note-form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Add Note
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setNewNote('')}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>

                            <div className="note-list">
                                {lead.notes && lead.notes.length > 0 ? (
                                    lead.notes
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map((note, index) => (
                                            <div key={index} className="note-item">
                                                <div className="note-avatar">
                                                    A
                                                </div>
                                                <div className="note-content-wrapper">
                                                    <div className="note-content">{note.content}</div>
                                                    <div className="note-meta">
                                                        <span className="note-author">
                                                            Admin
                                                        </span>
                                                        <span className="note-time">
                                                            {formatDateTime(note.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="no-notes">
                                        <div className="no-notes-icon">📝</div>
                                        <h4>No Notes Yet</h4>
                                        <p>Start the conversation by adding your first note.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .lead-detail {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 12px;
                }
                
                /* Notification */
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    padding: 12px 16px;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease;
                    min-width: 300px;
                    max-width: 400px;
                }
                
                .notification-success {
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                }
                
                .notification-error {
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-icon {
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    font-size: 12px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 60vh;
                    gap: 12px;
                }
                
                .loading-spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .lead-detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .header-left {
                    flex: 1;
                }
                
                .btn-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 10px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    color: #495057;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }
                
                .btn-back:hover {
                    background: #e9ecef;
                }
                
                .lead-title-section h1 {
                    font-size: 22px;
                    color: #2c3e50;
                    margin: 0 0 4px 0;
                    font-weight: 600;
                }
                
                .lead-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #6c757d;
                    font-size: 11px;
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                
                .meta-divider {
                    color: #adb5bd;
                }
                
                .status-selector {
                    text-align: right;
                }
                
                .status-selector label {
                    display: block;
                    font-weight: 600;
                    color: #6c757d;
                    font-size: 11px;
                    margin-bottom: 3px;
                }
                
                .status-dropdown-container {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .status-dropdown {
                    padding: 5px 8px;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    background: white;
                    font-size: 11px;
                    font-weight: 500;
                    min-width: 110px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .status-dropdown:hover {
                    border-color: #adb5bd;
                }
                
                .status-new {
                    color: #17a2b8;
                    border-color: #bee5eb;
                }
                
                .status-contacted {
                    color: #ffc107;
                    border-color: #ffeaa7;
                }
                
                .status-converted {
                    color: #28a745;
                    border-color: #c3e6cb;
                }
                
                .status-lost {
                    color: #dc3545;
                    border-color: #f5c6cb;
                }
                
                .updating-dots {
                    font-size: 12px;
                    color: #6c757d;
                    animation: blink 1.5s infinite;
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                
                /* Two Column Layout */
                .lead-content-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 16px;
                    margin-top: 8px;
                }
                
                @media (max-width: 1024px) {
                    .lead-content-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                }
                
                /* Tight Card Styles */
                .card.tight {
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                    background: white;
                }
                
                .card.tight:not(:last-child) {
                    margin-bottom: 12px;
                }
                
                .card-header.tight-header {
                    padding: 8px 12px;
                    border-bottom: 1px solid #e9ecef;
                    background: #f8f9fa;
                }
                
                .card-header.tight-header h2 {
                    font-size: 13px;
                    color: #495057;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-weight: 600;
                }
                
                .card-body.tight-body {
                    padding: 10px 12px;
                }
                
                /* Tight Contact Details */
                .detail-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .detail-item.tight-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .detail-label {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #667eea;
                    font-size: 11px;
                    flex-shrink: 0;
                }
                
                .detail-content {
                    flex: 1;
                    min-width: 0;
                }
                
                .detail-value {
                    color: #2c3e50;
                    font-size: 12px;
                    line-height: 1.3;
                }
                
                .detail-value.highlight {
                    color: #28a745;
                    font-weight: 600;
                }
                
                .detail-value a {
                    color: #667eea;
                    text-decoration: none;
                    word-break: break-all;
                }
                
                .detail-value a:hover {
                    text-decoration: underline;
                }
                
                /* Tight Pro Tips */
                .tip-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .tip-item.tight-tip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .tip-icon {
                    color: #f39c12;
                    font-size: 10px;
                    flex-shrink: 0;
                }
                
                .tip-text {
                    font-size: 11px;
                    color: #495057;
                    line-height: 1.3;
                }
                
                /* Notes Section */
                .card:not(.tight) {
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
                    background: white;
                    height: 100%;
                }
                
                .card-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #e9ecef;
                    background: #f8f9fa;
                }
                
                .card-header h2 {
                    font-size: 14px;
                    color: #495057;
                    margin: 0;
                    font-weight: 600;
                }
                
                .notes-count {
                    background: #667eea;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 600;
                }
                
                .card-body {
                    padding: 16px;
                }
                
                /* Note Form */
                .note-form {
                    margin-bottom: 16px;
                }
                
                .note-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    font-size: 12px;
                    resize: vertical;
                    min-height: 60px;
                    margin-bottom: 10px;
                    font-family: inherit;
                    transition: all 0.2s;
                }
                
                .note-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }
                
                .note-form-actions {
                    display: flex;
                    gap: 6px;
                }
                
                .btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-primary {
                    background: #667eea;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #5a67d8;
                }
                
                .btn-secondary {
                    background: #f8f9fa;
                    color: #495057;
                    border: 1px solid #dee2e6;
                }
                
                .btn-secondary:hover {
                    background: #e9ecef;
                }
                
                /* Note List */
                .note-list {
                    max-height: 380px;
                    overflow-y: auto;
                    padding-right: 6px;
                }
                
                .note-item {
                    display: flex;
                    gap: 10px;
                    padding: 10px 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .note-item:last-child {
                    border-bottom: none;
                }
                
                .note-avatar {
                    width: 26px;
                    height: 26px;
                    background: #667eea;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 11px;
                    flex-shrink: 0;
                }
                
                .note-content-wrapper {
                    flex: 1;
                }
                
                .note-content {
                    color: #2c3e50;
                    margin-bottom: 3px;
                    line-height: 1.3;
                    font-size: 12px;
                }
                
                .note-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #95a5a6;
                }
                
                .note-author {
                    font-weight: 500;
                }
                
                .no-notes {
                    text-align: center;
                    padding: 24px 12px;
                    color: #adb5bd;
                }
                
                .no-notes-icon {
                    font-size: 28px;
                    margin-bottom: 8px;
                }
                
                .no-notes h4 {
                    margin: 0 0 4px 0;
                    color: #6c757d;
                    font-size: 13px;
                }
                
                .no-notes p {
                    margin: 0;
                    font-size: 11px;
                }
                
                /* Empty State */
                .lead-not-found {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 24px 12px;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 32px 12px;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
                    margin-top: 16px;
                }
                
                .empty-state h3 {
                    color: #dc3545;
                    margin-bottom: 6px;
                    font-size: 16px;
                }
                
                .empty-state p {
                    color: #6c757d;
                    font-size: 12px;
                }
                
                /* Scrollbar Styling */
                .note-list::-webkit-scrollbar {
                    width: 3px;
                }
                
                .note-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .note-list::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                .note-list::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
                
                @media (max-width: 768px) {
                    .lead-detail {
                        padding: 8px;
                    }
                    
                    .lead-detail-header {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .status-selector {
                        text-align: left;
                        width: 100%;
                    }
                    
                    .status-dropdown {
                        width: 100%;
                    }
                    
                    .lead-content-grid {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }
                    
                    .notification {
                        left: 10px;
                        right: 10px;
                        min-width: auto;
                        max-width: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default LeadDetail;