import React from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🛡️ IAF Human Management System
        </h1>
        <p className="text-gray-600 mb-6">
          AI-enabled Personnel Management for Indian Air Force
        </p>
        <div className="space-y-2">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
            ✅ Frontend is working correctly
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
            🚀 Ready to connect to backend
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default TestApp;