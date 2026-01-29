import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaPhone, FaGlobe, FaCalendar, FaDownload, FaEnvelope, FaTimes, FaEye, FaTrash, FaFileDownload, FaFileCsv } from 'react-icons/fa';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { leadAPI } from '../services/api';
import LeadForm from './LeadForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  // Only fetch leads on mount or after create/delete
  useEffect(() => {
    setLoading(true);
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  };

  const handleCreateLead = async (leadData) => {
    try {
      setLoading(true);
      await leadAPI.create(leadData);
      await fetchLeads();
      setShowForm(false);
      toast.success('Lead created successfully!');
    } catch (error) {
      console.error('Error creating lead:', error);
      if (error?.response?.status === 409) {
        toast.error('A lead with this email or phone already exists.');
      } else {
        toast.error('Failed to create lead. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id) => {
    // Custom confirm dialog instead of window.confirm
    setConfirmDelete({ show: true, id });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    // Compare status case-insensitively
    const status = (lead.status || '').toLowerCase();
    const selected = selectedStatus.toLowerCase();
    const matchesStatus = selected === 'all' || status === selected;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.info('No leads to export.');
      return;
    }

    const csvData = filteredLeads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Source: lead.source,
      Status: lead.status,
      Created: formatDate(lead.createdAt),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const handleExportPDF = () => {
    if (filteredLeads.length === 0) {
      toast.info('No leads to export.');
      return;
    }

    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Leads Export', 14, 14);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
      doc.text(`Total Leads: ${filteredLeads.length}`, 14, 28);

      const tableColumn = ['Name', 'Email', 'Phone', 'Source', 'Status', 'Created'];
      const tableRows = filteredLeads.map(lead => [
        lead.name,
        lead.email || 'N/A',
        lead.phone || 'N/A',
        lead.source || 'N/A',
        lead.status || 'N/A',
        formatDate(lead.createdAt)
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
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

      doc.save('leads_export.pdf');
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'status-new',
      'contacted': 'status-contacted',
      'qualified': 'status-qualified',
      'converted': 'status-converted',
      'lost': 'status-lost'
    };
    return colors[status?.toLowerCase()] || 'status-default';
  };

  if (loading) {
    return (
      <div className="leads-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-container">
      <style>{`
        .leads-container {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .leads-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8f9fa;
          min-height: 100vh;
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

        .leads-header {
          margin-bottom: 2rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .header-title {
          flex: 1;
        }

        .header-title h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .export-dropdown {
          position: relative;
          display: inline-block;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .export-btn:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f0f4ff;
        }

        .export-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 160px;
          z-index: 100;
          overflow: hidden;
        }

        .export-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: none;
          width: 100%;
          text-align: left;
          color: #374151;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.15s;
        }

        .export-option:hover {
          background: #f3f4f6;
        }

        .export-option svg {
          color: #667eea;
        }

        .new-lead-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .new-lead-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .filters-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid #e5e7eb;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: #e5e7eb;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
        }

        .clear-search:hover {
          background: #d1d5db;
        }

        .status-filter {
          display: flex;
          gap: 0.5rem;
        }

        .status-filter-btn {
          padding: 0.5rem 1rem;
          border: 1.5px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          font-weight: 500;
        }

        .status-filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .status-filter-btn:hover:not(.active) {
          border-color: #667eea;
          color: #667eea;
        }

        .leads-grid {
          display: grid;
          gap: 1rem;
        }

        .fade-in {
          animation: fadeInGrid 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        .fade-in-card {
          opacity: 0;
          animation: fadeInCard 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        @keyframes fadeInGrid {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lead-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 1.25rem;
          align-items: center;
        }

        .lead-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .lead-avatar {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .lead-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lead-name-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .lead-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .lead-status {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-new {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-contacted {
          background: #fef3c7;
          color: #92400e;
        }

        .status-qualified {
          background: #e0e7ff;
          color: #4338ca;
        }

        .status-converted {
          background: #d1fae5;
          color: #065f46;
        }

        .status-lost {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-default {
          background: #f3f4f6;
          color: #374151;
        }

        .lead-details {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .lead-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .lead-detail svg {
          color: #9ca3af;
        }

        .lead-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .action-btn:hover {
          background: #f9fafb;
          border-color: #667eea;
          color: #667eea;
        }

        .action-btn.delete {
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .leads-container {
            padding: 1rem;
          }

          .header-top {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
            justify-content: stretch;
          }

          .export-btn,
          .new-lead-btn {
            flex: 1;
          }

          .lead-card {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .lead-actions {
            width: 100%;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <div className="leads-header">
        <div className="header-top">
          <div className="header-title">
            <h1>Leads</h1>
            <p className="header-subtitle">Manage and track your sales pipeline</p>
          </div>
          <div className="header-actions">
            <div className="export-dropdown">
              <button 
                className="export-btn"
                onClick={() => {
                  const menu = document.querySelector('.export-menu');
                  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }}
              >
                <FaDownload /> Export
              </button>
              <div className="export-menu" style={{ display: 'none' }}>
                <button className="export-option" onClick={handleExportCSV}>
                  <FaFileCsv /> Export CSV
                </button>
                <button className="export-option" onClick={handleExportPDF}>
                  <FaFileDownload /> Export PDF
                </button>
              </div>
            </div>
            <button className="new-lead-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> New Lead
            </button>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
          <div className="status-filter">
            <button 
              className={`status-filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
            >
              All
            </button>
            <button 
              className={`status-filter-btn ${selectedStatus === 'new' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('new')}
            >
              New
            </button>
            <button 
              className={`status-filter-btn ${selectedStatus === 'contacted' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('contacted')}
            >
              Contacted
            </button>
            <button 
              className={`status-filter-btn ${selectedStatus === 'converted' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('converted')}
            >
              Converted
            </button>
            <button 
              className={`status-filter-btn ${selectedStatus === 'lost' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('lost')}
            >
              Lost
            </button>
          </div>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2 className="empty-title">No leads found</h2>
          <p className="empty-subtitle">
            {searchTerm ? 'Try a different search term' : 'Create your first lead to get started'}
          </p>
          <button className="new-lead-btn" onClick={() => setShowForm(true)}>
            <FaPlus /> Create Lead
          </button>
        </div>
      ) : (
        <div className="leads-grid fade-in">
          {filteredLeads.map((lead, idx) => (
            <div key={lead._id} className="lead-card fade-in-card" style={{ animationDelay: `${0.05 * idx}s` }}>
              <div className="lead-avatar">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="lead-info">
                <div className="lead-name-row">
                  <h3 className="lead-name">{lead.name}</h3>
                  <span className={`lead-status ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="lead-details">
                  <div className="lead-detail">
                    <FaEnvelope />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="lead-detail">
                      <FaPhone />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead.source && (
                    <div className="lead-detail">
                      <FaGlobe />
                      <span>{lead.source}</span>
                    </div>
                  )}
                  <div className="lead-detail">
                    <FaCalendar />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="lead-actions">
                <Link to={`/leads/${lead._id}`} className="action-btn">
                  <FaEye /> View
                </Link>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteLead(lead._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {confirmDelete.show && (
        <div className="modal-overlay" onClick={() => setConfirmDelete({ show: false, id: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 340, textAlign: 'center', padding: '2rem 1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Delete Lead?</h3>
            <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>Are you sure you want to delete this lead? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="action-btn delete"
                style={{ minWidth: 90 }}
                onClick={async () => {
                  try {
                    await leadAPI.delete(confirmDelete.id);
                    fetchLeads();
                    toast.success('Lead deleted successfully');
                  } catch (error) {
                    console.error('Error deleting lead:', error);
                    toast.error('Failed to delete lead. Please try again.');
                  } finally {
                    setConfirmDelete({ show: false, id: null });
                  }
                }}
              >
                Delete
              </button>
              <button
                className="action-btn"
                style={{ minWidth: 90 }}
                onClick={() => setConfirmDelete({ show: false, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Leads;