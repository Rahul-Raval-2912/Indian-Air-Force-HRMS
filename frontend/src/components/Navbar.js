import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleDisplayName = (role) => {
    const roleMap = {
      commander: 'Air Commodore',
      hr_manager: 'Wing Commander',
      medical_officer: 'Squadron Leader',
      training_officer: 'Wing Commander',
      personnel: 'Flight Lieutenant'
    };
    return roleMap[role] || 'IAF Officer';
  };

  const getRoleIcon = (role) => {
    const iconMap = {
      commander: '⭐',
      hr_manager: '👥',
      medical_officer: '🏥',
      training_officer: '🎯',
      personnel: '👤'
    };
    return iconMap[role] || '🎖️';
  };

  const getNavItems = () => {
    const baseItems = [
      { path: `/${user.role}`, label: 'Dashboard', icon: '📊' },
      { path: '/analytics', label: 'Analytics', icon: '📈' },
      { path: '/voice', label: 'Voice Command', icon: '🎤' }
    ];

    if (user.role === 'commander') {
      baseItems.push({ path: '/strategic-planning', label: 'Strategic Planning', icon: '🎯' });
    }

    return baseItems;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <nav className="iaf-navbar">
        <div className="navbar-container">
          {/* Left Section - Logo & Title */}
          <div className="navbar-left">
            <div className="iaf-logo-nav">
              <img 
                src="https://www.clipartmax.com/png/middle/275-2755311_free-download-indian-air-force-logo-vector-and-clip-aeronautica-militare-india.png" 
                alt="Indian Air Force Logo" 
                className="iaf-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="logo-emblem" style={{display: 'none'}}>
                <div className="wings-icon">✈️</div>
                <div className="chakra-icon">⚡</div>
              </div>
            </div>
            <div className="nav-title">
              <h1 className="main-title">भारतीय वायु सेना</h1>
              <p className="sub-title">Human Resource Management System</p>
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="navbar-center">
            <div className="nav-links">
              {getNavItems().map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - User Info & Controls */}
          <div className="navbar-right">
            {/* Time Display */}
            <div className="time-display">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="date">{formatDate(currentTime)}</div>
            </div>

            {/* User Profile */}
            <div className="user-profile">
              <div className="user-avatar">
                <span className="avatar-icon">{getRoleIcon(user.role)}</span>
                <div className="status-indicator"></div>
              </div>
              <div className="user-info">
                <div className="user-rank">{getRoleDisplayName(user.role)}</div>
                <div className="user-name">{user.name || 'IAF Officer'}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="nav-actions">
              <button className="action-btn notification-btn">
                <span className="btn-icon">🔔</span>
                <div className="notification-badge">3</div>
              </button>
              
              <button className="action-btn settings-btn">
                <span className="btn-icon">⚙️</span>
              </button>

              <button 
                onClick={handleLogout}
                className="action-btn logout-btn"
              >
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {getNavItems().map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="mobile-nav-link logout"
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        )}
      </nav>

      <style jsx>{`
        .iaf-navbar {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid rgba(255, 153, 0, 0.3);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .iaf-logo-nav {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 6px 20px rgba(255, 153, 0, 0.4),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .iaf-logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .iaf-logo-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .iaf-logo-nav:hover::before {
          left: 100%;
        }

        .logo-emblem {
          position: relative;
          font-size: 20px;
        }

        .wings-icon {
          animation: fly 3s ease-in-out infinite;
        }

        @keyframes fly {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        .nav-title .main-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .nav-title .sub-title {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-weight: 500;
        }

        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 600px;
        }

        .nav-links {
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.1), rgba(255, 153, 0, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-link:hover::before {
          opacity: 1;
        }

        .nav-link:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.1));
          color: #ff9900;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .nav-icon {
          font-size: 16px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .time-display {
          text-align: right;
          font-family: 'Rajdhani', monospace;
        }

        .time {
          font-size: 18px;
          font-weight: 700;
          color: #ff9900;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #334155, #475569);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 2px solid rgba(255, 153, 0, 0.3);
        }

        .status-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #00aa00;
          border-radius: 50%;
          border: 2px solid #0f172a;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .user-info {
          text-align: left;
        }

        .user-rank {
          font-size: 14px;
          font-weight: 600;
          color: #ff9900;
          font-family: 'Rajdhani', sans-serif;
        }

        .user-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transform: translateY(-2px);
        }

        .notification-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
        }

        .logout-btn {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
          border-color: rgba(239, 68, 68, 0.5);
          color: #ffffff;
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-menu-toggle span {
          width: 24px;
          height: 3px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 153, 0, 0.3);
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(255, 153, 0, 0.1);
          border-color: rgba(255, 153, 0, 0.3);
          color: #ff9900;
        }

        .mobile-nav-link.logout {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .navbar-container {
            padding: 0 16px;
          }
          
          .time-display {
            display: none;
          }
          
          .nav-links {
            gap: 4px;
          }
          
          .nav-link {
            padding: 10px 16px;
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .navbar-center {
            display: none;
          }
          
          .nav-actions .btn-text {
            display: none;
          }
          
          .action-btn {
            padding: 10px;
          }
          
          .mobile-menu-toggle {
            display: flex;
          }
          
          .mobile-menu {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            height: 70px;
            padding: 0 12px;
          }
          
          .nav-title .main-title {
            font-size: 16px;
          }
          
          .nav-title .sub-title {
            font-size: 10px;
          }
          
          .user-info {
            display: none;
          }
          
          .user-profile {
            padding: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;