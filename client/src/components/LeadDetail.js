import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  FaCheckCircle,
  FaTimes,
  FaHistory,
  FaStickyNote,
  FaEdit
} from 'react-icons/fa';
import { leadAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        // Scroll to top when lead changes or page mounts
        window.scrollTo({ top: 0, behavior: 'auto' });
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const response = await leadAPI.getById(id);
            setLead(response.data);
        } catch (error) {
            console.error('Error fetching lead:', error);
            toast.error('Failed to load lead details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === lead.status) return;
        
        setUpdatingStatus(true);
        try {
            await leadAPI.update(id, { 
                status: newStatus,
                previousStatus: lead.status
            });
            
            setLead(prev => ({ ...prev, status: newStatus }));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) {
            toast.error('Please enter a note');
            return;
        }

        try {
            await leadAPI.addNote(id, newNote);
            setNewNote('');
            fetchLead();
            toast.success('Note added successfully!');
        } catch (error) {
            console.error('Error adding note:', error);
            toast.error('Failed to add note');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'new': 'status-new',
            'contacted': 'status-contacted',
            'converted': 'status-converted',
            'lost': 'status-lost'
        };
        return statusMap[status?.toLowerCase()] || 'status-default';
    };

    // Don't show a loading spinner, just render nothing until loaded
    if (loading) {
        return null;
    }

    if (!lead) {
        return (
            <div className="lead-detail-page">
                <style>{styles}</style>
                <div className="container">
                    <button onClick={() => navigate('/leads')} className="back-btn">
                        <FaArrowLeft /> Back to Leads
                    </button>
                    <div className="empty-card">
                        <h2>Lead Not Found</h2>
                        <p>The lead you're looking for doesn't exist or has been deleted.</p>
                        <button onClick={() => navigate('/leads')} className="btn-primary">
                            View All Leads
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lead-detail-page">
            <style>{`
                .lead-detail-page {
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                }
            `}</style>
            <style>{styles}</style>
            
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <button onClick={() => navigate('/leads')} className="back-btn">
                        <FaArrowLeft /> Back to Leads
                    </button>
                    
                    <div className="header-content">
                        <div className="lead-info">
                            <div className="avatar">
                                {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1>{lead.name}</h1>
                                <div className="metadata">
                                    <span><FaCalendar /> {formatDate(lead.createdAt)}</span>
                                    {lead.source && <span><FaGlobe /> {lead.source}</span>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="status-control">
                            <label>Status</label>
                            <select 
                                value={lead.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                disabled={updatingStatus}
                                className={`status-select ${getStatusClass(lead.status)}`}
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="content-layout">
                    {/* Contact Information */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Contact Information</h2>
                        </div>
                        <div className="card-body">
                            <div className="info-list">
                                <div className="info-row">
                                    <div className="info-label">
                                        <FaEnvelope /> Email
                                    </div>
                                    <div className="info-value">
                                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-label">
                                        <FaPhone /> Phone
                                    </div>
                                    <div className="info-value">
                                        {lead.phone ? (
                                            <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                                        ) : (
                                            <span className="text-muted">Not provided</span>
                                        )}
                                    </div>
                                </div>

                                {lead.company && (
                                    <div className="info-row">
                                        <div className="info-label">
                                            <FaBuilding /> Company
                                        </div>
                                        <div className="info-value">
                                            {lead.company}
                                        </div>
                                    </div>
                                )}

                                {lead.location && (
                                    <div className="info-row">
                                        <div className="info-label">
                                            <FaMapMarkerAlt /> Location
                                        </div>
                                        <div className="info-value">
                                            {lead.location}
                                        </div>
                                    </div>
                                )}

                                {lead.estimatedValue && (
                                    <div className="info-row highlight">
                                        <div className="info-label">
                                            <FaDollarSign /> Estimated Value
                                        </div>
                                        <div className="info-value value-amount">
                                            ${lead.estimatedValue.toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                <div className="info-row">
                                    <div className="info-label">
                                        <FaHistory /> Activity
                                    </div>
                                    <div className="info-value">
                                        <Link to={`/leads/${id}/history`} className="link-btn">
                                            View History
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="card">
                        <div className="card-header">
                            <h2>Notes</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddNote}>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note..."
                                    rows="4"
                                    className="textarea"
                                />
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        <FaCheckCircle /> Add Note
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-secondary"
                                        onClick={() => setNewNote('')}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>

                            {lead.notes && lead.notes.length > 0 && (
                                <div className="notes-section">
                                    <h3>Recent Notes</h3>
                                    <div className="notes-list">
                                        {lead.notes.slice(-5).reverse().map((note, index) => (
                                            <div key={note._id || index} className="note-item">
                                                <div className="note-date">
                                                    {formatDate(note.createdAt || lead.updatedAt)}
                                                </div>
                                                <p>{note.content || note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
            />
        </div>
    );
};

const styles = `
    * {
        box-sizing: border-box;
    }

    .lead-detail-page {
        min-height: 100vh;
        background: #f8f9fa;
        padding: 2rem 1rem;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
    }

    /* Header */
    .page-header {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        color: #495057;
        font-size: 0.875rem;
        cursor: pointer;
        margin-bottom: 1rem;
        transition: all 0.2s;
    }

    .back-btn:hover {
        background: #e9ecef;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.5rem;
    }

    .lead-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .lead-info h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        color: #212529;
    }

    .metadata {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: #6c757d;
    }

    .metadata span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .status-control {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .status-control label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6c757d;
        text-transform: uppercase;
    }

    .status-select {
        padding: 0.5rem 1rem;
        border: 2px solid;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        background: white;
        min-width: 140px;
    }

    .status-select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .status-new { color: #0d6efd; border-color: #0d6efd; }
    .status-contacted { color: #fd7e14; border-color: #fd7e14; }
    .status-converted { color: #198754; border-color: #198754; }
    .status-lost { color: #dc3545; border-color: #dc3545; }
    .status-default { color: #6c757d; border-color: #6c757d; }

    /* Content Layout */
    .content-layout {
        display: grid;
        gap: 1.5rem;
    }

    /* Card */
    .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    .card-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e9ecef;
        background: #f8f9fa;
    }

    .card-header h2 {
        margin: 0;
        font-size: 1.125rem;
        color: #212529;
        font-weight: 600;
    }

    .card-body {
        padding: 1.5rem;
    }

    /* Info List */
    .info-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .info-row {
        display: flex;
        align-items: flex-start;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f3f5;
    }

    .info-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .info-row.highlight {
        background: #fff3cd;
        padding: 1rem;
        border-radius: 6px;
        border: none;
    }

    .info-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 140px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #495057;
    }

    .info-label svg {
        color: #667eea;
    }

    .info-value {
        flex: 1;
        font-size: 0.9375rem;
        color: #212529;
    }

    .info-value a {
        color: #0d6efd;
        text-decoration: none;
    }

    .info-value a:hover {
        text-decoration: underline;
    }

    .text-muted {
        color: #6c757d;
    }

    .value-amount {
        font-size: 1.25rem;
        font-weight: 700;
        color: #198754;
    }

    .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        color: #0d6efd;
        text-decoration: none;
        font-weight: 500;
    }

    .link-btn:hover {
        text-decoration: underline;
    }

    /* Form */
    .textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 0.9375rem;
        font-family: inherit;
        resize: vertical;
        margin-bottom: 1rem;
    }

    .textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-actions {
        display: flex;
        gap: 0.75rem;
    }

    .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary:hover {
        background: #5568d3;
    }

    .btn-secondary {
        padding: 0.625rem 1.25rem;
        background: white;
        color: #495057;
        border: 1px solid #ced4da;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-secondary:hover {
        background: #f8f9fa;
    }

    /* Notes */
    .notes-section {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
    }

    .notes-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #212529;
        font-weight: 600;
    }

    .notes-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .note-item {
        padding: 1rem;
        background: #f8f9fa;
        border-left: 3px solid #667eea;
        border-radius: 4px;
    }

    .note-date {
        font-size: 0.75rem;
        color: #6c757d;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .note-item p {
        margin: 0;
        color: #495057;
        line-height: 1.5;
    }

    /* Loading */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f4f6;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-card {
        background: white;
        border-radius: 8px;
        padding: 3rem 2rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-top: 2rem;
    }

    .empty-card h2 {
        margin: 0 0 0.5rem 0;
        color: #dc3545;
    }

    .empty-card p {
        color: #6c757d;
        margin-bottom: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .lead-detail-page {
            padding: 1rem;
        }

        .header-content {
            flex-direction: column;
            align-items: stretch;
        }

        .status-control {
            width: 100%;
        }

        .status-select {
            width: 100%;
        }

        .info-row {
            flex-direction: column;
            gap: 0.5rem;
        }

        .info-label {
            min-width: auto;
        }

        .form-actions {
            flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
            width: 100%;
            justify-content: center;
        }
    }
`;

export default LeadDetail;