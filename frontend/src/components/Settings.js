import React, { useState } from 'react';

const Settings = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'english',
    notifications: {
      email: true,
      push: true,
      sms: false,
      security: true
    },
    privacy: {
      profileVisibility: 'unit',
      dataSharing: false,
      analytics: true
    },
    display: {
      fontSize: 'medium',
      animations: true,
      highContrast: false
    }
  });

  if (!isOpen) return null;

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('iaf_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    onClose();
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <div className="header-content">
            <h2>⚙️ System Settings</h2>
            <p>भारतीय वायु सेना - Configuration Panel</p>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-sidebar">
            <div className="tab-list">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'display', label: 'Display', icon: '🖥️' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' },
                { id: 'security', label: 'Security', icon: '🛡️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-main">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h3>Profile Information</h3>
                <div className="form-group">
                  <label>Officer Name</label>
                  <input type="text" value={user.name || 'IAF Officer'} readOnly />
                </div>
                <div className="form-group">
                  <label>Rank</label>
                  <input type="text" value={user.role || 'Officer'} readOnly />
                </div>
                <div className="form-group">
                  <label>Service Number</label>
                  <input type="text" value="IAF-2024-001" readOnly />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input type="text" value="Air Force Station, New Delhi" readOnly />
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="settings-section">
                <h3>Display Preferences</h3>
                <div className="form-group">
                  <label>Theme</label>
                  <select 
                    value={settings.theme} 
                    onChange={(e) => setSettings(prev => ({...prev, theme: e.target.value}))}
                  >
                    <option value="dark">Dark (IAF Standard)</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select 
                    value={settings.language} 
                    onChange={(e) => setSettings(prev => ({...prev, language: e.target.value}))}
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिंदी</option>
                    <option value="bilingual">Bilingual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Font Size</label>
                  <select 
                    value={settings.display.fontSize} 
                    onChange={(e) => handleSettingChange('display', 'fontSize', e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.display.animations}
                      onChange={(e) => handleSettingChange('display', 'animations', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Enable Animations
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.display.highContrast}
                      onChange={(e) => handleSettingChange('display', 'highContrast', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    High Contrast Mode
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Email Notifications
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Push Notifications
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    SMS Alerts
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.security}
                      onChange={(e) => handleSettingChange('notifications', 'security', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Security Alerts
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <h3>Privacy Settings</h3>
                <div className="form-group">
                  <label>Profile Visibility</label>
                  <select 
                    value={settings.privacy.profileVisibility} 
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  >
                    <option value="unit">Unit Only</option>
                    <option value="base">Air Base</option>
                    <option value="command">Command Level</option>
                  </select>
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Allow Data Sharing for Analytics
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={settings.privacy.analytics}
                      onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Performance Analytics
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-icon">🔐</span>
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Enabled - Last updated 2 days ago</p>
                    </div>
                    <button className="security-btn">Configure</button>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🔑</span>
                    <div>
                      <h4>Password</h4>
                      <p>Last changed 30 days ago</p>
                    </div>
                    <button className="security-btn">Change</button>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">📱</span>
                    <div>
                      <h4>Active Sessions</h4>
                      <p>2 active sessions</p>
                    </div>
                    <button className="security-btn">Manage</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Changes</button>
        </div>
      </div>

      <style>{`
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .settings-modal {
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid rgba(255, 153, 0, 0.3);
          border-radius: 20px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(255, 153, 0, 0.2);
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.1), rgba(255, 153, 0, 0.05));
        }

        .header-content h2 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .header-content p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 4px 0 0 0;
        }

        .close-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 18px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        .settings-content {
          display: flex;
          height: 500px;
        }

        .settings-sidebar {
          width: 250px;
          background: rgba(0, 0, 0, 0.2);
          border-right: 1px solid rgba(255, 153, 0, 0.2);
          padding: 20px 0;
        }

        .tab-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 20px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.1));
          border-color: rgba(255, 153, 0, 0.3);
          color: #ff9900;
        }

        .tab-icon {
          font-size: 16px;
        }

        .settings-main {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .settings-section h3 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #ff9900;
          margin: 0 0 24px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: rgba(255, 153, 0, 0.5);
          box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
        }

        .security-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .security-icon {
          font-size: 24px;
        }

        .security-item div {
          flex: 1;
        }

        .security-item h4 {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .security-item p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .security-btn {
          padding: 8px 16px;
          background: rgba(255, 153, 0, 0.1);
          border: 1px solid rgba(255, 153, 0, 0.3);
          border-radius: 8px;
          color: #ff9900;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .security-btn:hover {
          background: rgba(255, 153, 0, 0.2);
        }

        .settings-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 24px 32px;
          border-top: 1px solid rgba(255, 153, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .cancel-btn,
        .save-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .save-btn {
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border: 1px solid rgba(255, 153, 0, 0.3);
          color: #ffffff;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 153, 0, 0.3);
        }

        @media (max-width: 768px) {
          .settings-modal {
            margin: 10px;
            max-width: none;
          }

          .settings-content {
            flex-direction: column;
            height: auto;
          }

          .settings-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 153, 0, 0.2);
          }

          .tab-list {
            flex-direction: row;
            overflow-x: auto;
            padding: 0 20px 20px 20px;
          }

          .tab-btn {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;
