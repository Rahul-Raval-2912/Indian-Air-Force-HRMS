import React, { useState } from 'react';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    personnel_id: '',
    password: '',
    name: '',
    rank: '',
    unit: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Demo login credentials
    const demoCredentials = {
      'IAF001': { role: 'commander', name: 'Air Commodore Singh' },
      'IAF002': { role: 'hr_manager', name: 'Wing Commander Sharma' },
      'IAF003': { role: 'medical_officer', name: 'Squadron Leader Dr. Patel' },
      'IAF004': { role: 'training_officer', name: 'Wing Commander Gupta' },
      'IAF005': { role: 'personnel', name: 'Flight Lieutenant Kumar' }
    };

    const { personnel_id, password } = formData;
    
    if (demoCredentials[personnel_id] && password === 'iaf123') {
      const user = demoCredentials[personnel_id];
      onLogin(user.role);
      setMessage('Login successful!');
    } else if (!personnel_id || !password) {
      setMessage('Please enter both Personnel ID and Password');
    } else if (!demoCredentials[personnel_id]) {
      setMessage('Personnel ID not found. Use: IAF001, IAF002, IAF003, IAF004, or IAF005');
    } else {
      setMessage('Incorrect password. Use: iaf123');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.personnel_id || !formData.rank || !formData.unit || !formData.email) {
      setMessage('Please fill all fields');
      return;
    }

    // Simulate signup request pending HR approval
    setMessage('Signup request submitted successfully! HR approval required. You will be notified within 24-48 hours via email.');
    
    // Show privacy notice
    setTimeout(() => {
      setMessage(prev => prev + '\n\n🔒 Privacy Notice: Your personal information is protected under Indian Data Protection Laws and IAF security protocols. Data is encrypted and access is strictly controlled.');
    }, 2000);
    
    // Reset form
    setFormData({
      personnel_id: '',
      password: '',
      name: '',
      rank: '',
      unit: '',
      email: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🇮🇳</div>
          <h1 className="text-2xl font-bold text-gray-900">Indian Air Force</h1>
          <p className="text-gray-600">Human Management System</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
              isLogin ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
              !isLogin ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personnel ID
              </label>
              <input
                type="text"
                name="personnel_id"
                value={formData.personnel_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Personnel ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Login to Dashboard
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Demo Login Credentials:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>IAF001</strong> - Air Commodore Singh (Commander)</p>
                <p><strong>IAF002</strong> - Wing Commander Sharma (HR Manager)</p>
                <p><strong>IAF003</strong> - Squadron Leader Dr. Patel (Medical Officer)</p>
                <p><strong>IAF004</strong> - Wing Commander Gupta (Training Officer)</p>
                <p><strong>IAF005</strong> - Flight Lieutenant Kumar (Personnel)</p>
                <p className="font-semibold mt-2">Password for all: <span className="bg-blue-100 px-2 py-1 rounded">iaf123</span></p>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personnel ID
              </label>
              <input
                type="text"
                name="personnel_id"
                value={formData.personnel_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Personnel ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rank
              </label>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Rank</option>
                <option value="Pilot Officer">Pilot Officer</option>
                <option value="Flying Officer">Flying Officer</option>
                <option value="Flight Lieutenant">Flight Lieutenant</option>
                <option value="Squadron Leader">Squadron Leader</option>
                <option value="Wing Commander">Wing Commander</option>
                <option value="Group Captain">Group Captain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Unit/Squadron"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter Official Email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Create Password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit for HR Approval
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ HR Approval Required</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>• Processing time: 24-48 hours</p>
                <p>• Email notification upon approval/rejection</p>
                <p>• All data encrypted and secure</p>
                <p>• Compliant with Indian Data Protection Laws</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔒 Privacy & Security</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Your data is protected with military-grade encryption</p>
                <p>• Access is strictly role-based and monitored</p>
                <p>• Data retention as per IAF policies</p>
                <p>• Right to data correction and deletion</p>
              </div>
            </div>
          </form>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('successful') || message.includes('submitted') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;