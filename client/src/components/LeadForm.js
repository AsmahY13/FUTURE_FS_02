import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const LeadForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'New'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(formData);
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="lead-form-modal">
            <div className="form-header">
                <h2>Create New Lead</h2>
                <p>Add a new potential client to your pipeline.</p>
                <button onClick={onCancel} className="close-btn">
                    <FaTimes />
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="source">Source</label>
                        <select
                            id="source"
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                        >
                            <option value="Website">Website</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Referral">Referral</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Create Lead
                    </button>
                </div>
            </form>

            <style jsx>{`
                .lead-form-modal {
                    position: relative;
                }
                
                .form-header {
                    position: relative;
                    margin-bottom: 30px;
                }
                
                .form-header h2 {
                    font-size: 24px;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                
                .form-header p {
                    color: #7f8c8d;
                    margin-bottom: 0;
                }
                
                .close-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #95a5a6;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 4px;
                }
                
                .close-btn:hover {
                    background: #f8f9fa;
                    color: #e74c3c;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #555;
                }
                
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                }
                
                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-group input.error {
                    border-color: #e74c3c;
                }
                
                .error-message {
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 5px;
                    display: block;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                .form-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #f8f9fa;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default LeadForm;