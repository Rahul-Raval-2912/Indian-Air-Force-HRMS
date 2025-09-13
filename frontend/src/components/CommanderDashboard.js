import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const CommanderDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [simulationResults, setSimulationResults] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchPersonnelData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/dashboard_stats/');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback mock data
      setStats({
        total_personnel: 10000,
        high_attrition_risk: 850,
        avg_readiness: 82.5,
        high_leadership_potential: 1250,
        units: {
          'Fighter Squadron 1': 450,
          'Transport Squadron': 320,
          'Helicopter Unit': 280,
          'Training Command': 380,
          'Maintenance Wing': 420,
          'Air Defense': 350,
          'Logistics Wing': 300,
          'Medical Wing': 180
        },
        ranks: {
          'Air Chief Marshal': 1,
          'Air Marshal': 8,
          'Air Vice Marshal': 25,
          'Air Commodore': 85,
          'Group Captain': 320,
          'Wing Commander': 850,
          'Squadron Leader': 1800,
          'Flight Lieutenant': 2500,
          'Flying Officer': 2200,
          'Pilot Officer': 2211
        }
      });
    }
  };

  const fetchPersonnelData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/');
      const data = await response.json();
      setPersonnel(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personnel data:', error);
      // Fallback mock data
      const mockPersonnel = Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        name: `Officer ${String.fromCharCode(65 + (i % 26))}${Math.floor(i/26) + 1}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'][i % 4],
        unit: ['Fighter Squadron 1', 'Transport Squadron', 'Helicopter Unit', 'Training Command'][i % 4],
        readiness_score: Math.floor(Math.random() * 40) + 60,
        attrition_risk: Math.random() > 0.8,
        leadership_potential: ['high', 'medium', 'low'][i % 3]
      }));
      setPersonnel(mockPersonnel);
      setLoading(false);
    }
  };

  const runSimulation = async (scenario) => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/what_if_simulation/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: scenario,
          personnel_ids: personnel.slice(0, 10).map(p => p.id)
        })
      });
      const data = await response.json();
      setSimulationResults(data);
    } catch (error) {
      console.error('Error running simulation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredPersonnel = selectedUnit === 'all' 
    ? personnel 
    : personnel.filter(p => p.unit === selectedUnit);

  const units = [...new Set(personnel.map(p => p.unit))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="header mb-8 p-6 rounded-2xl">
        <h1 className="text-4xl font-bold" style={{color: '#1e293b', marginBottom: '8px'}}>IAF Commander Dashboard</h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: '500'}}>Strategic Command & Control - Personnel Readiness Overview</p>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon blue">
              👥
            </div>
            <div className="metric-content">
              <h3>{stats?.total_personnel || 0}</h3>
              <p>Total Personnel</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon green">
              ✅
            </div>
            <div className="metric-content">
              <h3>{stats?.avg_readiness?.toFixed(1) || 0}%</h3>
              <p>Average Readiness</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon red">
              ⚠️
            </div>
            <div className="metric-content">
              <h3>{stats?.high_attrition_risk || 0}</h3>
              <p>High Risk Personnel</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon purple">
              🎖️
            </div>
            <div className="metric-content">
              <h3>{stats?.high_leadership_potential || 0}</h3>
              <p>Leadership Potential</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Unit Distribution */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Squadron Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats?.units || {}).slice(0, 8).map(([unit, count]) => (
              <div key={unit} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{unit}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(stats?.units || {}))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rank Distribution */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Rank Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats?.ranks || {}).slice(0, 8).map(([rank, count]) => (
              <div key={rank} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{rank}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(stats?.ranks || {}))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-if Simulations */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Strategic Scenario Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => window.location.href = '/strategic-planning'}
            className="btn-primary hover:transform hover:scale-105 transition-all"
          >
            📅 Mass Retirement Analysis
          </button>
          <button
            onClick={() => window.location.href = '/strategic-planning'}
            className="btn-primary hover:transform hover:scale-105 transition-all"
          >
            🔄 Unit Redeployment
          </button>
          <button
            onClick={() => window.location.href = '/strategic-planning'}
            className="btn-primary hover:transform hover:scale-105 transition-all"
          >
            🚨 Emergency Mobilization
          </button>
        </div>

        {simulationResults && (
          <div className="card p-6" style={{background: 'rgba(240, 249, 255, 0.8)'}}>
            <h4 className="font-bold text-lg mb-4" style={{color: '#1e293b'}}>Simulation Results: {simulationResults.scenario}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Affected Personnel: {simulationResults.affected_count}</p>
                <p className="text-sm text-gray-600">Readiness Impact: {simulationResults.readiness_impact}%</p>
                <p className="text-sm text-gray-600">Skill Gaps: {simulationResults.skill_gaps?.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Recommended Actions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {simulationResults.recommended_actions?.map((action, index) => (
                    <li key={index}>• {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personnel Overview */}
      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold" style={{color: '#1e293b'}}>Personnel Overview</h3>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="form-input" style={{width: 'auto', minWidth: '200px'}}
          >
            <option value="all">All Units</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Officer Name</th>
                <th>Rank</th>
                <th>Squadron/Unit</th>
                <th>Readiness Score</th>
                <th>Attrition Risk</th>
                <th>Leadership Potential</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonnel.slice(0, 20).map((person) => (
                <tr key={person.id}>
                  <td style={{fontWeight: '600'}}>
                    {person.name}
                  </td>
                  <td>
                    {person.rank}
                  </td>
                  <td>
                    {person.unit}
                  </td>
                  <td>
                    <span className={`badge ${
                      person.readiness_score >= 80 ? 'badge-success' :
                      person.readiness_score >= 60 ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {person.readiness_score}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      person.attrition_risk ? 'badge-danger' : 'badge-success'
                    }`}>
                      {person.attrition_risk ? 'High Risk' : 'Low Risk'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      person.leadership_potential === 'high' ? 'badge-info' :
                      person.leadership_potential === 'medium' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {person.leadership_potential}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* AI Assistant Chatbot */}
      <ChatbotButton userRole="commander" />
    </div>
  );
};

export default CommanderDashboard;