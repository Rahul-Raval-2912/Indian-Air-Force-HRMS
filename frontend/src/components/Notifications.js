import React, { useState, useEffect } from 'react';

const Notifications = ({ isOpen, onClose, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      // Generate mock notifications based on user role
      const mockNotifications = generateMockNotifications(user.role);
      setNotifications(mockNotifications);
    }
  }, [isOpen, user.role]);

  const generateMockNotifications = (role) => {
    const baseNotifications = [
      {
        id: 1,
        type: 'security',
        title: 'Security Alert',
        message: 'Unauthorized access attempt detected from IP 192.168.1.100',
        time: '2 minutes ago',
        priority: 'high',
        read: false,
        icon: '🚨'
      },
      {
        id: 2,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance window: 02:00 - 04:00 IST tomorrow',
        time: '15 minutes ago',
        priority: 'medium',
        read: false,
        icon: '🔧'
      },
      {
        id: 3,
        type: 'personnel',
        title: 'Personnel Update',
        message: 'New personnel records have been added to the system',
        time: '1 hour ago',
        priority: 'low',
        read: true,
        icon: '👥'
      }
    ];

    const roleSpecificNotifications = {
      commander: [
        {
          id: 4,
          type: 'mission',
          title: 'Mission Readiness Alert',
          message: 'Squadron 101 readiness score dropped to 78%. Immediate attention required.',
          time: '30 minutes ago',
          priority: 'high',
          read: false,
          icon: '⚡'
        },
        {
          id: 5,
          type: 'strategic',
          title: 'Strategic Planning Update',
          message: 'Q4 strategic planning session scheduled for next week',
          time: '2 hours ago',
          priority: 'medium',
          read: false,
          icon: '🎯'
        }
      ],
      hr_manager: [
        {
          id: 4,
          type: 'hr',
          title: 'Leave Request',
          message: '5 new leave requests pending approval',
          time: '45 minutes ago',
          priority: 'medium',
          read: false,
          icon: '📋'
        },
        {
          id: 5,
          type: 'training',
          title: 'Training Completion',
          message: '12 personnel completed advanced combat training',
          time: '3 hours ago',
          priority: 'low',
          read: true,
          icon: '🎓'
        }
      ],
      medical_officer: [
        {
          id: 4,
          type: 'medical',
          title: 'Medical Emergency',
          message: 'Flight Lieutenant requires immediate medical attention',
          time: '10 minutes ago',
          priority: 'high',
          read: false,
          icon: '🏥'
        },
        {
          id: 5,
          type: 'health',
          title: 'Health Screening',
          message: 'Annual health screening due for 25 personnel',
          time: '1 hour ago',
          priority: 'medium',
          read: false,
          icon: '🩺'
        }
      ],
      training_officer: [
        {
          id: 4,
          type: 'training',
          title: 'Training Schedule',
          message: 'New flight simulation training slots available',
          time: '20 minutes ago',
          priority: 'medium',
          read: false,
          icon: '✈️'
        },
        {
          id: 5,
          type: 'certification',
          title: 'Certification Expiry',
          message: '8 personnel certifications expiring this month',
          time: '4 hours ago',
          priority: 'high',
          read: false,
          icon: '📜'
        }
      ],
      personnel: [
        {
          id: 4,
          type: 'personal',
          title: 'Leave Approved',
          message: 'Your leave request for next week has been approved',
          time: '1 hour ago',
          priority: 'low',
          read: false,
          icon: '✅'
        },
        {
          id: 5,
          type: 'training',
          title: 'Training Assignment',
          message: 'You have been assigned to advanced radar operations course',
          time: '5 hours ago',
          priority: 'medium',
          read: true,
          icon: '📚'
        }
      ]
    };

    return [...baseNotifications, ...(roleSpecificNotifications[role] || [])];
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff9900';
      case 'low': return '#00aa00';
      default: return '#666666';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notifications-overlay">
      <div className="notifications-modal">
        <div className="notifications-header">
          <div className="header-content">
            <h2>🔔 Notifications</h2>
            <p>भारतीय वायु सेना - Alert Center</p>
          </div>
          <div className="header-actions">
            <button onClick={markAllAsRead} className="mark-all-btn">
              Mark All Read
            </button>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
        </div>

        <div className="notifications-filters">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
            { id: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
            { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
            { id: 'personnel', label: 'Personnel', count: notifications.filter(n => n.type === 'personnel').length }
          ].map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`filter-btn ${filter === filterOption.id ? 'active' : ''}`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className="filter-count">{filterOption.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="notifications-content">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Notifications</h3>
              <p>You're all caught up! No new notifications to display.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.icon}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <div className="notification-meta">
                        <span 
                          className="priority-indicator"
                          style={{ backgroundColor: getPriorityColor(notification.priority) }}
                        ></span>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        View
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notifications-overlay {
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

        .notifications-modal {
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid rgba(255, 153, 0, 0.3);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .notifications-header {
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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mark-all-btn {
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

        .mark-all-btn:hover {
          background: rgba(255, 153, 0, 0.2);
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

        .notifications-filters {
          display: flex;
          gap: 8px;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow-x: auto;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.1));
          border-color: rgba(255, 153, 0, 0.3);
          color: #ff9900;
        }

        .filter-count {
          background: rgba(255, 153, 0, 0.8);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .notifications-content {
          height: 400px;
          overflow-y: auto;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .notifications-list {
          padding: 0;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .notification-item.unread {
          background: rgba(255, 153, 0, 0.05);
          border-left: 4px solid #ff9900;
        }

        .notification-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .notification-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .priority-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .notification-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .notification-message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn {
          background: rgba(255, 153, 0, 0.1);
          border: 1px solid rgba(255, 153, 0, 0.3);
          color: #ff9900;
        }

        .view-btn:hover {
          background: rgba(255, 153, 0, 0.2);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .unread-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 8px;
          height: 8px;
          background: #ff9900;
          border-radius: 50%;
          animation: pulse-orange 2s infinite;
        }

        @keyframes pulse-orange {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .notifications-modal {
            margin: 10px;
            max-width: none;
          }

          .notifications-header {
            padding: 20px;
          }

          .notifications-filters {
            padding: 16px 20px;
          }

          .notification-item {
            padding: 16px 20px;
          }

          .notification-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
