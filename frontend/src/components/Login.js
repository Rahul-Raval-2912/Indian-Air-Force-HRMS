import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [role, setRole] = useState('commander');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { role, username: `${role}_user` };
    setUser(user);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            IAF Human Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select your role to access the dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="commander">Commander</option>
              <option value="hr">HR Manager</option>
              <option value="medical">Medical Officer</option>
              <option value="training">Training Officer</option>
              <option value="personnel">Personnel</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
