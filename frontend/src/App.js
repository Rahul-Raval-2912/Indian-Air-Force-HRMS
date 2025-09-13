import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CommanderDashboard from './components/CommanderDashboard';
import HRDashboard from './components/HRDashboard';
import MedicalDashboard from './components/MedicalDashboard';
import TrainingDashboard from './components/TrainingDashboard';
import PersonnelDashboard from './components/PersonnelDashboard';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import EnhancedAnalytics from './components/EnhancedAnalytics';
import VoiceInterface from './components/VoiceInterface';
import SystemOverview from './components/SystemOverview';
import StrategicPlanning from './components/StrategicPlanning';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('iaf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (role) => {
    const userData = { role, name: getRoleName(role), loginTime: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('iaf_user', JSON.stringify(userData));
  };
  
  const getRoleName = (role) => {
    const roleNames = {
      'commander': 'Air Commodore Singh',
      'hr_manager': 'Wing Commander Sharma',
      'medical_officer': 'Squadron Leader Dr. Patel',
      'training_officer': 'Wing Commander Gupta',
      'personnel': 'Flight Lieutenant Kumar'
    };
    return roleNames[role] || 'IAF Officer';
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('iaf_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to={`/${user.role}`} />} 
          />
          <Route 
            path="/commander" 
            element={user?.role === 'commander' ? <CommanderDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/hr_manager" 
            element={user?.role === 'hr_manager' ? <HRDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/medical_officer" 
            element={user?.role === 'medical_officer' ? <MedicalDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/training_officer" 
            element={user?.role === 'training_officer' ? <TrainingDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/personnel" 
            element={user?.role === 'personnel' ? <PersonnelDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? <EnhancedAnalytics userRole={user.role} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/voice" 
            element={user ? <VoiceInterface userRole={user.role} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/overview" 
            element={<SystemOverview />} 
          />
          <Route 
            path="/strategic-planning" 
            element={user ? <StrategicPlanning userRole={user.role} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;