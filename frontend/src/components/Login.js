import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('commander');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { 
      role, 
      username: username || `${role}_user`,
      loginTime: new Date().toISOString()
    };
    onLogin(user);
    navigate(`/${role}`);
  };

  const roleDescriptions = {
    commander: 'Access overall readiness metrics, unit distribution, and strategic simulations',
    hr: 'Manage personnel records, skill recommendations, and workforce optimization',
    medical: 'Monitor health metrics, fitness tracking, and medical readiness',
    training: 'Oversee training programs, skill development, and certification tracking',
    personnel: 'View individual career paths, personal readiness scores, and development plans'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            IAF Human Management System
          </h2>
          <p className="text-gray-600">
            Select your role to access the dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username (Optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="commander">Commander</option>
              <option value="hr">HR Manager</option>
              <option value="medical">Medical Officer</option>
              <option value="training">Training Officer</option>
              <option value="personnel">Personnel</option>
            </select>
            
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                {roleDescriptions[role]}
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Demo System - Indian Air Force Human Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
