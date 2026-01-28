import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('admin@minicrm.com');
    const [password, setPassword] = useState('MiniCRM_SecurePass2026');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="login-content">
                <div className="main-container">
                    <div className="left-panel">
                        <div className="logo-section">
                            <div className="logo-icon">
                                <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                                    <rect width="48" height="48" rx="12" fill="url(#gradient1)"/>
                                    <path d="M14 24L20 30L34 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                    <defs>
                                        <linearGradient id="gradient1" x1="0" y1="0" x2="48" y2="48">
                                            <stop offset="0%" stopColor="#6366f1"/>
                                            <stop offset="100%" stopColor="#8b5cf6"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className="logo-text">
                                <h1>MiniCRM</h1>
                                <p className="subtitle">Client Lead Management System</p>
                            </div>
                        </div>
                        
                        <div className="demo-card">
                            <div className="demo-header">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M10 5V10L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <h3>Demo Access</h3>
                            </div>
                            <p className="demo-description">
                                Use these credentials to explore all features
                            </p>
                            <div className="credentials-grid">
                                <div className="credential-item">
                                    <div className="credential-header">
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                            <path d="M2.5 5.5L8 9L13.5 5.5M3 13H13C13.5523 13 14 12.5523 14 12V4C14 3.44772 13.5523 3 13 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>Email</span>
                                    </div>
                                    <div className="credential-value">
                                        <span className="value-text">admin@minicrm.com</span>
                                        <button 
                                            className="copy-btn"
                                            onClick={() => copyToClipboard('admin@minicrm.com')}
                                            type="button"
                                            aria-label="Copy email"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M2 9.5V2.5C2 1.94772 2.44772 1.5 3 1.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="credential-item">
                                    <div className="credential-header">
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 7V5C4 3.34315 5.34315 2 7 2H9C10.6569 2 12 3.34315 12 5V7M3 7H13C13.5523 7 14 7.44772 14 8V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V8C2 7.44772 2.44772 7 3 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>Password</span>
                                    </div>
                                    <div className="credential-value">
                                        <span className="value-text">MiniCRM_SecurePass2026</span>
                                        <button 
                                            className="copy-btn"
                                            onClick={() => copyToClipboard('MiniCRM_SecurePass2026')}
                                            type="button"
                                            aria-label="Copy password"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                                                <path d="M2 9.5V2.5C2 1.94772 2.44772 1.5 3 1.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span>OR</span>
                        <div className="divider-line"></div>
                    </div>
                    
                    <div className="right-panel">
                        <div className="login-card">
                            <div className="login-header">
                                <h2>Welcome Back</h2>
                                <p>Sign in to your account</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-with-icon">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M2.5 5.5L8 9L13.5 5.5M3 13H13C13.5523 13 14 12.5523 14 12V4C14 3.44772 13.5523 3 13 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-with-icon">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 7V5C4 3.34315 5.34315 2 7 2H9C10.6569 2 12 3.34315 12 5V7M3 7H13C13.5523 7 14 7.44772 14 8V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V8C2 7.44772 2.44772 7 3 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                                    <path d="M3.26 11.602C2.942 11.124 2.783 10.885 2.783 10.5C2.783 10.115 2.942 9.876 3.26 9.398C4.42 7.664 6.893 5 10 5C13.107 5 15.58 7.664 16.74 9.398C17.058 9.876 17.217 10.115 17.217 10.5C17.217 10.885 17.058 11.124 16.74 11.602C15.58 13.336 13.107 16 10 16C6.893 16 4.42 13.336 3.26 11.602Z" stroke="currentColor" strokeWidth="1.5"/>
                                                    <circle cx="10" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                                    <path d="M2.5 2.5L17.5 17.5M8.315 8.402C7.808 8.924 7.5 9.638 7.5 10.5C7.5 12.157 8.843 13.5 10.5 13.5C11.362 13.5 12.076 13.192 12.598 12.685M12.832 9.169C12.941 9.594 13 10.041 13 10.5C13 12.709 11.209 14.5 9 14.5C8.541 14.5 8.094 14.441 7.669 14.332M4.5 6.5C3.5 7.5 2.783 8.5 2.783 10.5C2.783 12.885 4.42 15.336 10 17C15.58 15.336 17.217 12.885 17.217 10.5C17.217 8.5 16.5 7.5 15.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="error-message">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M8 4V8.5M8 11.5V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
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
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
                
                :root {
                    --color-primary: #6366f1;
                    --color-primary-dark: #4f46e5;
                    --color-secondary: #8b5cf6;
                    --color-surface: #ffffff;
                    --color-border: #e5e7eb;
                    --color-border-light: #f1f5f9;
                    --color-text: #111827;
                    --color-text-muted: #6b7280;
                    --color-text-light: #9ca3af;
                    --color-bg: #fafbfc;
                    --color-card-bg: rgba(255, 255, 255, 0.98);
                    --color-success: #10b981;
                    --color-danger: #ef4444;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --radius-sm: 6px;
                    --radius-md: 10px;
                    --radius-lg: 14px;
                    --radius-xl: 18px;
                    --radius-2xl: 20px;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                html, body {
                    overflow: hidden;
                    height: 100%;
                }
                
                .login-container {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 1.5rem;
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow: hidden;
                }
                
                .login-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
                    z-index: 0;
                }
                
                .gradient-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(50px);
                    opacity: 0.25;
                    animation: float 20s ease-in-out infinite;
                }
                
                .orb-1 {
                    width: min(250px, 30vw);
                    height: min(250px, 30vw);
                    background: radial-gradient(circle, #6366f1, transparent);
                    top: -5%;
                    left: -5%;
                    animation-delay: 0s;
                }
                
                .orb-2 {
                    width: min(200px, 25vw);
                    height: min(200px, 25vw);
                    background: radial-gradient(circle, #8b5cf6, transparent);
                    bottom: -5%;
                    right: -5%;
                    animation-delay: 7s;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(10px, -10px) scale(1.05);
                    }
                    66% {
                        transform: translate(-10px, 10px) scale(0.95);
                    }
                }
                
                .login-content {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 920px;
                    margin: 0 auto;
                }
                
                .main-container {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 1.75rem;
                    background: var(--color-card-bg);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-xl);
                    padding: 1.25rem;
                    box-shadow: var(--shadow-xl);
                    height: 490px;
                    max-height: 85vh;
                    align-items: center;
                }
                
                .left-panel {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                
                .logo-section {
                    margin-bottom: 1rem;
                }
                
                .logo-icon {
                    margin-bottom: 0.75rem;
                }
                
                .logo-text h1 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    margin: 0 0 0.25rem 0;
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }
                
                .subtitle {
                    color: var(--color-text-muted);
                    font-size: 0.875rem;
                    margin: 0;
                    font-weight: 500;
                    line-height: 1.4;
                }
                
                .demo-card {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
                    border: 1px solid var(--color-border-light);
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .demo-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .demo-header svg {
                    color: var(--color-primary);
                    flex-shrink: 0;
                }
                
                .demo-header h3 {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--color-text);
                    margin: 0;
                }
                
                .demo-description {
                    color: var(--color-text-muted);
                    font-size: 0.8125rem;
                    line-height: 1.4;
                    margin-bottom: 1rem;
                }
                
                .credentials-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.875rem;
                    flex: 1;
                }
                
                .credential-item {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    padding: 0.875rem;
                    transition: all 0.2s ease;
                }
                
                .credential-item:hover {
                    border-color: var(--color-primary);
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.1);
                }
                
                .credential-header {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    margin-bottom: 0.375rem;
                }
                
                .credential-header svg {
                    color: var(--color-text-muted);
                    flex-shrink: 0;
                }
                
                .credential-header span {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .credential-value {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .value-text {
                    font-size: 0.8125rem;
                    color: var(--color-text);
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding-right: 0.5rem;
                }
                
                .copy-btn {
                    flex-shrink: 0;
                    width: 1.875rem;
                    height: 1.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--color-border);
                    background: var(--color-surface);
                    color: var(--color-text-muted);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 0;
                }
                
                .copy-btn:hover {
                    background: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                }
                
                .divider {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 0 0.5rem;
                    height: 80%;
                }
                
                .divider-line {
                    flex: 1;
                    width: 1px;
                    background: var(--color-border);
                    min-height: 50px;
                }
                
                .divider span {
                    color: var(--color-text-muted);
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0 0.5rem;
                    background: var(--color-card-bg);
                }
                
                .right-panel {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                
                .login-card {
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 1.75rem;
                }
                
                .login-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-text);
                    margin: 0 0 0.375rem 0;
                }
                
                .login-header p {
                    font-size: 0.875rem;
                    color: var(--color-text-muted);
                    margin: 0;
                    line-height: 1.4;
                }
                
                .login-form {
                    margin-bottom: 0;
                }
                
                .form-group {
                    margin-bottom: 1.25rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.375rem;
                    font-weight: 600;
                    color: var(--color-text);
                    font-size: 0.8125rem;
                }
                
                .input-with-icon {
                    position: relative;
                }
                
                .input-with-icon svg:first-child {
                    position: absolute;
                    left: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-text-muted);
                    z-index: 1;
                }
                
                .input-with-icon input {
                    width: 100%;
                    padding: 0.75rem 0.875rem 0.75rem 2.5rem;
                    border: 1.5px solid var(--color-border);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    background: var(--color-surface);
                    color: var(--color-text);
                    font-family: 'Outfit', sans-serif;
                }
                
                .input-with-icon input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                
                .input-with-icon input::placeholder {
                    color: var(--color-text-light);
                }
                
                .toggle-password {
                    position: absolute;
                    right: 0.875rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1.875rem;
                    height: 1.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: transparent;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s ease;
                    padding: 0;
                }
                
                .toggle-password:hover {
                    background: var(--color-bg);
                    color: var(--color-text);
                }
                
                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1.5px solid rgba(239, 68, 68, 0.2);
                    color: var(--color-danger);
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1.25rem;
                    font-size: 0.8125rem;
                    font-weight: 500;
                }
                
                .login-btn {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-family: 'Outfit', sans-serif;
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.2);
                    margin-top: 0.5rem;
                }
                
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
                }
                
                .login-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .spinner {
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Tablet and Mobile Responsive */
                @media (max-width: 1024px) {
                    .main-container {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto auto;
                        gap: 1.5rem;
                        max-width: 420px;
                        margin: 0 auto;
                        padding: 1.75rem;
                        height: auto;
                        max-height: 85vh;
                        overflow: hidden;
                    }
                    
                    .left-panel {
                        order: 2;
                        height: auto;
                    }
                    
                    .right-panel {
                        order: 1;
                        height: auto;
                    }
                    
                    .divider {
                        display: none;
                    }
                    
                    .logo-section {
                        margin-bottom: 0.75rem;
                    }
                    
                    .demo-card {
                        max-width: 100%;
                        margin: 0 auto;
                    }
                    
                    .login-card {
                        max-width: 100%;
                    }
                }
                
                @media (max-width: 768px) {
                    .login-container {
                        padding: 1rem;
                        height: 100vh;
                        align-items: center;
                    }
                    
                    .main-container {
                        padding: 1.5rem;
                        border-radius: var(--radius-lg);
                        margin: auto;
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    
                    .logo-text h1 {
                        font-size: 1.5rem;
                    }
                    
                    .demo-card {
                        padding: 1rem;
                    }
                    
                    .gradient-orb {
                        display: none;
                    }
                }
                
                /* Small Mobile */
                @media (max-width: 480px) {
                    .login-container {
                        padding: 0.75rem;
                    }
                    
                    .main-container {
                        padding: 1.25rem;
                        border-radius: var(--radius-md);
                        max-height: 85vh;
                    }
                    
                    .logo-text h1 {
                        font-size: 1.375rem;
                    }
                    
                    .subtitle {
                        font-size: 0.8125rem;
                    }
                    
                    .login-header h2 {
                        font-size: 1.25rem;
                    }
                    
                    .login-header p {
                        font-size: 0.8125rem;
                    }
                    
                    .demo-card {
                        padding: 0.875rem;
                    }
                    
                    .demo-header h3 {
                        font-size: 1rem;
                    }
                    
                    .credential-item {
                        padding: 0.75rem;
                    }
                    
                    .value-text {
                        font-size: 0.75rem;
                    }
                    
                    .input-with-icon input {
                        padding: 0.625rem 0.75rem 0.625rem 2.25rem;
                        font-size: 0.8125rem;
                    }
                    
                    .login-btn {
                        padding: 0.75rem 0.875rem;
                        font-size: 0.8125rem;
                    }
                }
                
                /* Extra small screens */
                @media (max-width: 360px) {
                    .main-container {
                        padding: 1rem;
                    }
                    
                    .logo-text h1 {
                        font-size: 1.25rem;
                    }
                    
                    .subtitle {
                        font-size: 0.75rem;
                    }
                    
                    .demo-card {
                        padding: 0.75rem;
                    }
                    
                    .credential-item {
                        padding: 0.625rem;
                    }
                    
                    .value-text {
                        font-size: 0.6875rem;
                    }
                    
                    .input-with-icon input {
                        padding: 0.5625rem 0.625rem 0.5625rem 2rem;
                        font-size: 0.75rem;
                    }
                    
                    .login-btn {
                        padding: 0.625rem 0.75rem;
                        font-size: 0.75rem;
                    }
                }
                
                /* Fix for very tall screens */
                @media (min-height: 900px) {
                    .main-container {
                        height: 520px;
                    }
                    
                    .logo-text h1 {
                        font-size: 1.875rem;
                    }
                    
                    .subtitle {
                        font-size: 0.9375rem;
                    }
                    
                    .login-header h2 {
                        font-size: 1.625rem;
                    }
                }
                
                /* Fix for very short screens */
                @media (max-height: 650px) {
                    .main-container {
                        height: 440px;
                        max-height: 90vh;
                    }
                    
                    .logo-section {
                        margin-bottom: 0.75rem;
                    }
                    
                    .demo-card {
                        padding: 1rem;
                    }
                    
                    .login-header {
                        margin-bottom: 1.5rem;
                    }
                    
                    .form-group {
                        margin-bottom: 1rem;
                    }
                    
                    .input-with-icon input {
                        padding: 0.625rem 0.75rem 0.625rem 2.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;