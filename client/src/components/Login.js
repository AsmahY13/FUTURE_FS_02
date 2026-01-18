import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@minicrm.com');
    const [password, setPassword] = useState('MiniCRM_SecurePass2026');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(email, password);
            
            if (response.data.success) {
                onLogin(response.data.token, response.data.user);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <span className="logo-icon">📊</span>
                        <h1>MiniCRM</h1>
                    </div>
                    <p className="subtitle">Client Lead Management System</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@minicrm.com"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Logging in...
                            </>
                        ) : 'Login to Dashboard'}
                    </button>
                </form>
                
                <div className="demo-credentials">
                    <h4>Demo Credentials</h4>
                    <div className="credential-item">
                        <span className="label">Email:</span>
                        <span className="value">admin@minicrm.com</span>
                    </div>
                    <div className="credential-item">
                        <span className="label">Password:</span>
                        <span className="value">MiniCRM_SecurePass2026</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    padding: 20px;
                }
                
                .login-card {
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
                    width: 100%;
                    max-width: 420px;
                    border: 1px solid #e2e8f0;
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                
                .logo-icon {
                    font-size: 32px;
                }
                
                .login-card h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .subtitle {
                    color: #64748b;
                    font-size: 14px;
                    margin-top: 8px;
                    font-weight: 500;
                }
                
                .login-form {
                    margin-bottom: 24px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #475569;
                    font-size: 14px;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: #f8fafc;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-group input::placeholder {
                    color: #94a3b8;
                }
                
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #dc2626;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 13px;
                    text-align: center;
                }
                
                .login-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 8px;
                }
                
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }
                
                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .demo-credentials {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #e2e8f0;
                }
                
                .demo-credentials h4 {
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin: 0 0 12px 0;
                    text-align: center;
                }
                
                .credential-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                
                .credential-item:last-child {
                    margin-bottom: 0;
                }
                
                .credential-item .label {
                    font-size: 13px;
                    color: #64748b;
                    font-weight: 500;
                }
                
                .credential-item .value {
                    font-size: 13px;
                    color: #1e293b;
                    font-weight: 600;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                }
                
                @media (max-width: 480px) {
                    .login-card {
                        padding: 30px 24px;
                    }
                    
                    .logo {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .logo-icon {
                        font-size: 28px;
                    }
                    
                    .login-card h1 {
                        font-size: 24px;
                    }
                    
                    .subtitle {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;