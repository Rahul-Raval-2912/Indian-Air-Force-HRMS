import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleDisplayName = (role) => {
    const roleMap = {
      commander: 'Commander',
      hr: 'HR Manager',
      medical: 'Medical Officer',
      training: 'Training Officer',
      personnel: 'Personnel'
    };
    return roleMap[role] || role;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-8 mr-3" 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z'/%3E%3C/svg%3E"
                alt="IAF Logo" 
              />
              <h1 className="text-xl font-bold">IAF Human Management System</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{getRoleDisplayName(user.role)}</div>
                <div className="text-blue-200">{user.username || 'User'}</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;