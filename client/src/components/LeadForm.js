import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
    const [phoneCountry, setPhoneCountry] = useState('us');

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

    // For PhoneInput
    const handlePhoneChange = (value, data, event, formattedValue) => {
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
        if (data && data.countryCode) {
            setPhoneCountry(data.countryCode.toUpperCase());
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
        // Phone validation (if provided)
        if (formData.phone) {
            // Use the selected country code for validation
            const phoneNumber = parsePhoneNumberFromString('+' + formData.phone, phoneCountry);
            if (!phoneNumber || !phoneNumber.isValid()) {
                newErrors.phone = 'Invalid phone number for selected country';
            }
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                await onSubmit(formData);
            } catch (error) {
                // Show toast for duplicate error or general error
                if (error?.response?.status === 409) {
                    toast.error('A lead with this email or phone already exists.');
                } else {
                    toast.error('Failed to create lead. Please try again.');
                }
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="lead-form-modal">
            <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
            <div className="form-header">
                <h2>Create New Lead</h2>
                <p>Add a new potential client to your pipeline.</p>
                <button onClick={onCancel} className="close-btn">
                    <FaTimes />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="form-content">
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
                    <PhoneInput
                        country={phoneCountry.toLowerCase()}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                            name: 'phone',
                            id: 'phone',
                            autoFocus: false,
                        }}
                        inputStyle={{ 
                            width: '100%',
                            height: '40px',
                            fontSize: '14px'
                        }}
                        buttonStyle={{ height: '40px' }}
                        containerStyle={{ width: '100%' }}
                        placeholder="Enter phone number"
                        enableSearch
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                    max-height: calc(100vh - 80px);
                    display: flex;
                    flex-direction: column;
                }
                
                .form-header {
                    position: relative;
                    margin-bottom: 20px;
                    padding-right: 40px;
                    flex-shrink: 0;
                }
                
                .form-header h2 {
                    font-size: 1.25rem;
                    color: #2c3e50;
                    margin: 0 0 5px 0;
                    font-weight: 600;
                }
                
                .form-header p {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin: 0;
                    line-height: 1.4;
                }
                
                .close-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    font-size: 16px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: #e9ecef;
                    color: #dc3545;
                    transform: scale(1.05);
                }
                
                .form-content {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 4px;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
                
                .form-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .form-content::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                
                .form-content::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                }
                
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.2s;
                    height: 40px;
                    box-sizing: border-box;
                }
                
                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-group input.error {
                    border-color: #dc3545;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.75rem;
                    margin-top: 4px;
                    display: block;
                    line-height: 1.2;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 5px;
                }
                
                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #f1f5f9;
                    flex-shrink: 0;
                }
                
                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 100px;
                    height: 36px;
                }
                
                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                
                .btn-secondary:hover {
                    background: #e5e7eb;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .btn-primary:hover {
                    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                }
                
                .react-tel-input .form-control {
                    width: 100% !important;
                    height: 40px !important;
                    font-size: 14px !important;
                    border: 1px solid #d1d5db !important;
                    border-radius: 6px !important;
                }
                
                .react-tel-input .form-control:focus {
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                }
                
                .react-tel-input .flag-dropdown {
                    border: 1px solid #d1d5db !important;
                    border-radius: 6px 0 0 6px !important;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 10px;
                    }
                    
                    .lead-form-modal {
                        max-height: calc(100vh - 60px);
                    }
                    
                    .btn {
                        min-width: 80px;
                        padding: 6px 12px;
                        height: 34px;
                    }
                }
                
                @media (max-height: 600px) {
                    .lead-form-modal {
                        max-height: calc(100vh - 40px);
                    }
                    
                    .form-group {
                        margin-bottom: 12px;
                    }
                    
                    .form-group input,
                    .form-group select {
                        height: 36px;
                        padding: 6px 10px;
                    }
                    
                    .btn {
                        height: 34px;
                        padding: 6px 12px;
                    }
                }
                
                @media (max-height: 500px) {
                    .form-header {
                        margin-bottom: 15px;
                    }
                    
                    .form-group {
                        margin-bottom: 10px;
                    }
                    
                    .form-actions {
                        margin-top: 15px;
                        padding-top: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LeadForm;