import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'commander',
      title: 'Commander',
      description: 'Strategic Command & Control',
      icon: '⭐',
      color: 'purple'
    },
    {
      id: 'hr_manager',
      title: 'HR Manager',
      description: 'Personnel Administration',
      icon: '👥',
      color: 'blue'
    },
    {
      id: 'medical_officer',
      title: 'Medical Officer',
      description: 'Health & Wellness',
      icon: '🏥',
      color: 'green'
    },
    {
      id: 'training_officer',
      title: 'Training Officer',
      description: 'Training & Development',
      icon: '📚',
      color: 'orange'
    },
    {
      id: 'personnel',
      title: 'Personnel',
      description: 'Individual Access',
      icon: '👤',
      color: 'gray'
    }
  ];

  const handleLogin = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      onLogin(selectedRole);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-content">
        <div className="login-header">
          <div className="iaf-logo">
            <div className="logo-circle">
              <span className="logo-text">IAF</span>
            </div>
          </div>
          <h1 className="login-title">Indian Air Force</h1>
          <h2 className="login-subtitle">Human Management System</h2>
          <p className="login-description">
            AI-Powered Personnel Management & Analytics Platform
          </p>
        </div>

        <div className="role-selection">
          <h3 className="selection-title">Select Your Role</h3>
          
          <div className="roles-grid">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? 'selected' : ''} ${role.color}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="role-icon">{role.icon}</div>
                <div className="role-info">
                  <h4 className="role-title">{role.title}</h4>
                  <p className="role-description">{role.description}</p>
                </div>
                <div className="role-selector">
                  <div className="selector-dot"></div>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`login-btn ${selectedRole ? 'active' : ''}`}
            onClick={handleLogin}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Authenticating...
              </>
            ) : (
              <>
                🚀 Access Dashboard
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          <div className="security-badge">
            <span className="security-icon">🔒</span>
            <span className="security-text">Secure Access</span>
          </div>
          <div className="version-info">
            <span>Version 2.0 | AI-Enhanced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
