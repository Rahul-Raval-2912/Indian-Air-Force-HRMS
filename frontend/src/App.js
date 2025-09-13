import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CommanderDashboard from './components/CommanderDashboard';
import HRDashboard from './components/HRDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route 
            path="/commander" 
            element={user?.role === 'commander' ? <CommanderDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/hr" 
            element={user?.role === 'hr' ? <HRDashboard /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
