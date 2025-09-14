import React, { useState, useEffect } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add floating particles animation
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      document.querySelector('.auth-container')?.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo login credentials
    const demoCredentials = {
      'IAF001': { role: 'commander', name: 'Air Commodore Singh' },
      'IAF002': { role: 'hr_manager', name: 'Wing Commander Sharma' },
      'IAF003': { role: 'medical_officer', name: 'Squadron Leader Dr. Patel' },
      'IAF004': { role: 'training_officer', name: 'Wing Commander Gupta' },
      'IAF005': { role: 'personnel', name: 'Flight Lieutenant Kumar' }
    };

    const { personnel_id, password } = formData;
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (demoCredentials[personnel_id] && password === 'iaf123') {
      const user = demoCredentials[personnel_id];
      setMessage('✅ Authentication Successful! Redirecting...');
      setTimeout(() => onLogin(user.role), 1000);
    } else if (!personnel_id || !password) {
      setMessage('⚠️ Please enter both Personnel ID and Password');
    } else if (!demoCredentials[personnel_id]) {
      setMessage('❌ Personnel ID not found. Use: IAF001, IAF002, IAF003, IAF004, or IAF005');
    } else {
      setMessage('❌ Incorrect password. Use: iaf123');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.name || !formData.personnel_id || !formData.rank || !formData.unit || !formData.email) {
      setMessage('⚠️ Please fill all required fields');
      setIsLoading(false);
      return;
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMessage('✅ Registration request submitted successfully! HR approval required. You will be notified within 24-48 hours via official email.');
    
    setTimeout(() => {
      setMessage(prev => prev + '\n\n🔒 Security Notice: Your data is protected under Indian Data Protection Laws and IAF security protocols. All information is encrypted and access is strictly monitored.');
    }, 2000);
    
    setFormData({
      personnel_id: '',
      password: '',
      name: '',
      rank: '',
      unit: '',
      email: ''
    });
    
    setIsLoading(false);
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="auth-bg-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      {/* Main Auth Card */}
      <div className="card max-w-lg w-full p-10 auth-card">
        {/* IAF Header */}
        <div className="text-center mb-10">
          <div className="iaf-logo-container mb-6">
            <div className="iaf-logo">
              <img 
                src="https://www.clipartmax.com/png/middle/275-2755311_free-download-indian-air-force-logo-vector-and-clip-aeronautica-militare-india.png" 
                alt="Indian Air Force Logo" 
                className="iaf-logo-img-auth"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="iaf-emblem" style={{display: 'none'}}>
                <div className="wings">✈️</div>
                <div className="chakra">⚡</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 iaf-title">
            भारतीय वायु सेना
          </h1>
          <h2 className="text-2xl font-semibold text-orange-400 mb-1">
            Indian Air Force
          </h2>
          <p className="text-gray-300 font-medium">
            Human Resource Management System
          </p>
          <div className="motto mt-4 text-sm text-gray-400 italic">
            "Touch the Sky with Glory"
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-8 bg-black/20 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              isLogin 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black shadow-lg' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🔐 SECURE LOGIN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              !isLogin 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-black shadow-lg' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            📝 REGISTER
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="form-label">
                🆔 Personnel Identification
              </label>
              <input
                type="text"
                name="personnel_id"
                value={formData.personnel_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your Personnel ID"
                required
              />
            </div>

            <div>
              <label className="form-label">
                🔑 Security Passphrase
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your secure password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-small mr-3"></div>
                  AUTHENTICATING...
                </div>
              ) : (
                '🚀 ACCESS DASHBOARD'
              )}
            </button>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <h4 className="font-bold text-orange-400 mb-4 text-center">
                🎯 DEMO ACCESS CREDENTIALS
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="credential-item">
                  <span className="id">IAF001</span>
                  <span className="role">Air Commodore Singh (Commander)</span>
                </div>
                <div className="credential-item">
                  <span className="id">IAF002</span>
                  <span className="role">Wing Commander Sharma (HR Manager)</span>
                </div>
                <div className="credential-item">
                  <span className="id">IAF003</span>
                  <span className="role">Squadron Leader Dr. Patel (Medical)</span>
                </div>
                <div className="credential-item">
                  <span className="id">IAF004</span>
                  <span className="role">Wing Commander Gupta (Training)</span>
                </div>
                <div className="credential-item">
                  <span className="id">IAF005</span>
                  <span className="role">Flight Lieutenant Kumar (Personnel)</span>
                </div>
                <div className="password-info">
                  <span className="text-green-400 font-bold">🔐 Password for all: iaf123</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">👤 Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="form-label">🆔 Personnel ID</label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">🎖️ Rank</label>
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
                  <option value="Air Commodore">Air Commodore</option>
                </select>
              </div>
              <div>
                <label className="form-label">🏢 Unit/Squadron</label>
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
            </div>

            <div>
              <label className="form-label">📧 Official Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter official email address"
                required
              />
            </div>

            <div>
              <label className="form-label">🔐 Create Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Create secure password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-success w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-small mr-3"></div>
                  PROCESSING REQUEST...
                </div>
              ) : (
                '📤 SUBMIT FOR HR APPROVAL'
              )}
            </button>

            {/* Registration Info */}
            <div className="registration-info">
              <div className="info-section">
                <h4 className="font-bold text-yellow-400 mb-2">⚠️ HR APPROVAL REQUIRED</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Processing time: 24-48 hours</li>
                  <li>• Email notification upon approval/rejection</li>
                  <li>• All data encrypted and secure</li>
                  <li>• Compliant with Indian Data Protection Laws</li>
                </ul>
              </div>
              
              <div className="info-section mt-4">
                <h4 className="font-bold text-blue-400 mb-2">🔒 SECURITY & PRIVACY</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Military-grade encryption protection</li>
                  <li>• Role-based access control</li>
                  <li>• Continuous security monitoring</li>
                  <li>• Data retention as per IAF policies</li>
                </ul>
              </div>
            </div>
          </form>
        )}

        {/* Message Display */}
        {message && (
          <div className={`message-display mt-6 p-4 rounded-lg text-sm font-medium ${
            message.includes('Successful') || message.includes('submitted') 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            <div className="whitespace-pre-line">{message}</div>
          </div>
        )}
      </div>

      <style>{`
        .auth-container {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
        }

        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 153, 0, 0.6);
          border-radius: 50%;
          animation: float-up linear infinite;
          pointer-events: none;
        }

        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .auth-bg-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-element {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: pulse 4s ease-in-out infinite;
        }

        .bg-element-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #ff9900, #ffaa00);
          top: 10%;
          left: -10%;
          animation-delay: 0s;
        }

        .bg-element-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #00aa00, #00bb00);
          top: 60%;
          right: -5%;
          animation-delay: 2s;
        }

        .bg-element-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
          bottom: 20%;
          left: 20%;
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }

        .auth-card {
          backdrop-filter: blur(25px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .iaf-logo-container {
          display: flex;
          justify-content: center;
        }

        .iaf-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 30px rgba(255, 153, 0, 0.4),
            inset 0 2px 0 rgba(255, 255, 255, 0.2);
          animation: glow 2s ease-in-out infinite alternate;
        }

        .iaf-logo-img-auth {
          width: 60px;
          height: 60px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        @keyframes glow {
          0% {
            box-shadow: 
              0 10px 30px rgba(255, 153, 0, 0.4),
              inset 0 2px 0 rgba(255, 255, 255, 0.2);
          }
          100% {
            box-shadow: 
              0 15px 40px rgba(255, 153, 0, 0.6),
              inset 0 2px 0 rgba(255, 255, 255, 0.3);
          }
        }

        .iaf-emblem {
          position: relative;
          font-size: 24px;
        }

        .wings {
          animation: fly 3s ease-in-out infinite;
        }

        @keyframes fly {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .iaf-title {
          font-family: 'Rajdhani', sans-serif;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .demo-credentials {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 153, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .credential-item .id {
          font-family: 'Rajdhani', monospace;
          font-weight: 700;
          color: #ff9900;
          background: rgba(255, 153, 0, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .credential-item .role {
          color: #e2e8f0;
          font-size: 12px;
        }

        .password-info {
          text-align: center;
          padding: 12px;
          background: rgba(0, 170, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(0, 170, 0, 0.3);
          margin-top: 12px;
        }

        .registration-info {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .info-section {
          margin-bottom: 16px;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .loading-spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        .message-display {
          backdrop-filter: blur(10px);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
