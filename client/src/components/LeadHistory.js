import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, 
    FaFilter,
    FaDownload,
    FaPrint,
    FaCalendar,
    FaUser,
    FaChartLine,
    FaTimes,
    FaClock,
    FaStickyNote,
    FaExchangeAlt
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { leadAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeadHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeline, setTimeline] = useState([]);
    const [timelineFilter, setTimelineFilter] = useState('all');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchLead();
    }, [id]);

    const fetchLead = async () => {
        try {
            const response = await leadAPI.getById(id);
            setLead(response.data);
            buildTimeline(response.data);
        } catch (error) {
            console.error('Error fetching lead:', error);
            toast.error('Failed to load lead history');
        } finally {
            setLoading(false);
        }
    };

    const buildTimeline = (leadData) => {
        const timelineItems = [];
        
        // Add lead creation event
        timelineItems.push({
            type: 'lead_created',
            title: 'Lead Created',
            description: `Lead was created from ${leadData.source || 'unknown source'}`,
            icon: '🎯',
            date: leadData.createdAt,
            status: leadData.status,
            author: 'System',
            details: {
                source: leadData.source,
                estimatedValue: leadData.estimatedValue,
                location: leadData.location
            }
        });

        // Add status history
        if (leadData.statusHistory && leadData.statusHistory.length > 0) {
            leadData.statusHistory.forEach((entry) => {
                timelineItems.push({
                    type: 'status_change',
                    title: 'Status Updated',
                    description: `Changed from ${entry.previousStatus || 'N/A'} to ${entry.status}`,
                    icon: '🔄',
                    date: entry.changedAt || entry.date,
                    status: entry.status,
                    author: entry.changedBy || 'System',
                    details: {
                        previousStatus: entry.previousStatus,
                        newStatus: entry.status,
                        reason: entry.reason || 'No reason provided'
                    }
                });
            });
        }

        // Add notes
        if (leadData.notes && leadData.notes.length > 0) {
            leadData.notes.forEach(note => {
                timelineItems.push({
                    type: 'note',
                    title: 'Note Added',
                    description: note.content,
                    icon: '📝',
                    date: note.createdAt,
                    author: note.author || 'Admin',
                    details: {
                        content: note.content,
                        type: note.type || 'general'
                    }
                });
            });
        }

        // Sort by date descending (newest first)
        timelineItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTimeline(timelineItems);
    };

    const handleExportPDF = async () => {
        if (!lead || isExporting) return;
        
        setIsExporting(true);
        try {
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.text(`Lead History: ${lead.name}`, 14, 20);
            
            doc.setFontSize(11);
            doc.text(`Email: ${lead.email || ''}`, 14, 30);
            doc.text(`Phone: ${lead.phone || ''}`, 14, 37);
            doc.text(`Source: ${lead.source || ''}`, 14, 44);
            doc.text(`Status: ${lead.status || ''}`, 14, 51);
            doc.text(`Created: ${formatDateTime(lead.createdAt)}`, 14, 58);
            
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 65);
            doc.text(`Total Activities: ${timeline.length}`, 14, 72);
            
            const tableColumn = ['Date', 'Type', 'Title', 'Description', 'Author'];
            const tableRows = timeline.map(item => [
                formatDateTime(item.date),
                item.type === 'lead_created' ? 'Creation' : 
                item.type === 'status_change' ? 'Status Change' : 'Note',
                item.title,
                item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description,
                item.author
            ]);
            
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 80,
                theme: 'grid',
                headStyles: { 
                    fillColor: [102, 126, 234],
                    textColor: [255, 255, 255],
                    fontSize: 10
                },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [248, 249, 250] },
                margin: { top: 10 }
            });
            
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }
            
            doc.save(`lead_${lead.name.replace(/\s+/g, '_')}_history.pdf`);
            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to export PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'new': '#0d6efd',
            'contacted': '#fd7e14',
            'qualified': '#6f42c1',
            'converted': '#198754',
            'lost': '#dc3545'
        };
        return colors[status?.toLowerCase()] || '#6c757d';
    };

    const filterTimeline = (type) => {
        if (type === 'all') return timeline;
        return timeline.filter(item => item.type === type);
    };

    const filteredTimeline = filterTimeline(timelineFilter);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="history-page">
                <style>{styles}</style>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="history-page">
                <style>{styles}</style>
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <FaArrowLeft /> Back
                    </button>
                    <div className="empty-card">
                        <h2>Lead Not Found</h2>
                        <p>The lead you're looking for doesn't exist or has been deleted.</p>
                    </div>
                </div>
                <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
        );
    }

    const statusChanges = timeline.filter(item => item.type === 'status_change').length;
    const notesCount = timeline.filter(item => item.type === 'note').length;

    return (
        <div className="history-page">
            <style>{styles}</style>
            
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <button onClick={() => navigate(`/leads/${id}`)} className="back-btn">
                        <FaArrowLeft /> Back to Lead
                    </button>
                    
                    <div className="header-content">
                        <div>
                            <h1>Activity History</h1>
                            <p className="lead-name">{lead.name}</p>
                        </div>
                        
                        <div className="header-actions">
                            <button onClick={handlePrint} className="action-btn">
                                <FaPrint /> Print
                            </button>
                            <button 
                                onClick={handleExportPDF} 
                                className="action-btn primary"
                                disabled={isExporting}
                            >
                                <FaDownload /> {isExporting ? 'Exporting...' : 'Export PDF'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <FaChartLine />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{timeline.length}</div>
                            <div className="stat-label">Total Activities</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <FaExchangeAlt />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{statusChanges}</div>
                            <div className="stat-label">Status Changes</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <FaStickyNote />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{notesCount}</div>
                            <div className="stat-label">Notes Added</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <FaClock />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value small">{formatDateTime(lead.createdAt).split(',')[0]}</div>
                            <div className="stat-label">Created On</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <h2><FaFilter /> Filter Activities</h2>
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${timelineFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setTimelineFilter('all')}
                        >
                            All ({timeline.length})
                        </button>
                        <button 
                            className={`filter-btn ${timelineFilter === 'status_change' ? 'active' : ''}`}
                            onClick={() => setTimelineFilter('status_change')}
                        >
                            Status Changes ({statusChanges})
                        </button>
                        <button 
                            className={`filter-btn ${timelineFilter === 'note' ? 'active' : ''}`}
                            onClick={() => setTimelineFilter('note')}
                        >
                            Notes ({notesCount})
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="timeline-card">
                    {filteredTimeline.length === 0 ? (
                        <div className="empty-timeline">
                            <div className="empty-icon">📊</div>
                            <h3>No Activities Found</h3>
                            <p>Try adjusting your filters to see more activities.</p>
                        </div>
                    ) : (
                        <div className="timeline">
                            {filteredTimeline.map((item, idx) => (
                                <div key={idx} className={`timeline-item ${item.type}`}>
                                    <div className="timeline-marker">
                                        <div className="marker-dot"></div>
                                        {idx !== filteredTimeline.length - 1 && <div className="marker-line"></div>}
                                    </div>
                                    
                                    <div className="timeline-content">
                                        <div className="content-header">
                                            <div className="header-left">
                                                <span className="item-icon">{item.icon}</span>
                                                <h3>{item.title}</h3>
                                            </div>
                                            <span className="item-date">{formatDateTime(item.date)}</span>
                                        </div>

                                        {item.type === 'status_change' && (
                                            <div className="status-change">
                                                <div className="status-flow">
                                                    <span 
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(item.details.previousStatus) }}
                                                    >
                                                        {item.details.previousStatus || 'N/A'}
                                                    </span>
                                                    <span className="arrow">→</span>
                                                    <span 
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusColor(item.status) }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <p className="item-description">{item.description}</p>

                                        <div className="content-footer">
                                            <span className="author">
                                                <FaUser /> {item.author}
                                            </span>
                                            {item.type === 'lead_created' && item.details && (
                                                <div className="extra-details">
                                                    {item.details.source && (
                                                        <span className="detail-tag">Source: {item.details.source}</span>
                                                    )}
                                                    {item.details.estimatedValue && (
                                                        <span className="detail-tag">
                                                            Value: ${item.details.estimatedValue.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

const styles = `
    * {
        box-sizing: border-box;
    }

    .history-page {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
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
        gap: 1rem;
    }

    .header-content h1 {
        margin: 0 0 0.25rem 0;
        font-size: 1.5rem;
        color: #212529;
    }

    .lead-name {
        margin: 0;
        color: #6c757d;
        font-size: 0.9375rem;
    }

    .header-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        background: white;
        color: #495057;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .action-btn:hover:not(:disabled) {
        background: #f8f9fa;
    }

    .action-btn.primary {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    .action-btn.primary:hover:not(:disabled) {
        background: #5568d3;
    }

    .action-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
    }

    .stat-icon.blue { background: #0d6efd; }
    .stat-icon.green { background: #198754; }
    .stat-icon.orange { background: #fd7e14; }
    .stat-icon.purple { background: #6f42c1; }

    .stat-content {
        flex: 1;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #212529;
        margin-bottom: 0.25rem;
    }

    .stat-value.small {
        font-size: 1rem;
    }

    .stat-label {
        font-size: 0.75rem;
        color: #6c757d;
        text-transform: uppercase;
        font-weight: 600;
    }

    /* Filters */
    .filters-bar {
        background: white;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .filters-bar h2 {
        margin: 0;
        font-size: 1rem;
        color: #212529;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .filter-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .filter-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        background: white;
        color: #495057;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .filter-btn:hover,
    .filter-btn.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    /* Timeline Card */
    .timeline-card {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        min-height: 400px;
    }

    /* Timeline */
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .timeline-item {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem 0;
        position: relative;
    }

    .timeline-item:not(:last-child) {
        border-bottom: 1px solid #f1f3f5;
    }

    .timeline-marker {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
    }

    .marker-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #667eea;
        border: 3px solid #e8ebff;
        z-index: 1;
    }

    .timeline-item.status_change .marker-dot {
        background: #198754;
        border-color: #d1f4e0;
    }

    .timeline-item.note .marker-dot {
        background: #fd7e14;
        border-color: #ffe5d0;
    }

    .marker-line {
        position: absolute;
        top: 12px;
        bottom: -24px;
        width: 2px;
        background: #e9ecef;
    }

    /* Timeline Content */
    .timeline-content {
        flex: 1;
        min-width: 0;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        gap: 1rem;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .item-icon {
        font-size: 1.25rem;
    }

    .content-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #212529;
        font-weight: 600;
    }

    .item-date {
        font-size: 0.75rem;
        color: #6c757d;
        background: #f8f9fa;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        white-space: nowrap;
    }

    /* Status Change */
    .status-change {
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 0.75rem;
    }

    .status-flow {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .status-badge {
        padding: 0.375rem 0.75rem;
        border-radius: 6px;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .arrow {
        color: #adb5bd;
        font-size: 1.125rem;
    }

    /* Description */
    .item-description {
        margin: 0 0 0.75rem 0;
        color: #495057;
        line-height: 1.5;
        font-size: 0.9375rem;
    }

    /* Footer */
    .content-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.75rem;
        border-top: 1px solid #f1f3f5;
    }

    .author {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6c757d;
    }

    .extra-details {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .detail-tag {
        font-size: 0.75rem;
        padding: 0.25rem 0.625rem;
        background: #f8f9fa;
        border-radius: 12px;
        color: #495057;
    }

    /* Empty State */
    .empty-timeline {
        text-align: center;
        padding: 4rem 2rem;
    }

    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .empty-timeline h3 {
        margin: 0 0 0.5rem 0;
        color: #495057;
        font-size: 1.25rem;
    }

    .empty-timeline p {
        margin: 0;
        color: #6c757d;
    }

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

    /* Responsive */
    @media (max-width: 768px) {
        .history-page {
            padding: 1rem;
        }

        .header-content {
            flex-direction: column;
            align-items: stretch;
        }

        .header-actions {
            width: 100%;
        }

        .action-btn {
            flex: 1;
            justify-content: center;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .filters-bar {
            flex-direction: column;
            align-items: stretch;
        }

        .filter-buttons {
            flex-wrap: wrap;
        }

        .filter-btn {
            flex: 1;
        }

        .content-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .content-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }

    @media print {
        .page-header .header-actions,
        .filters-bar,
        .back-btn {
            display: none;
        }

        .timeline-card {
            box-shadow: none;
            border: 1px solid #dee2e6;
        }
    }
`;

export default LeadHistory;