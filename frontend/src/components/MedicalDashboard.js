import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const MedicalDashboard = ({ user }) => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchPersonnelData();
  }, []);

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
        age: Math.floor(Math.random() * 20) + 25,
        fitness_score: Math.floor(Math.random() * 40) + 60,
        stress_index: Math.floor(Math.random() * 60) + 20,
        branch: ['Flying', 'Technical', 'Administrative', 'Medical'][i % 4],
        last_medical_check: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        injury_history_str: Math.random() > 0.7 ? 'Minor injury, Fitness issue' : ''
      }));
      setPersonnel(mockPersonnel);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading IAF Medical Center...</p>
        </div>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 153, 0, 0.2);
            border-top: 4px solid #ff9900;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-text {
            color: #ff9900;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  const medicalStats = {
    totalPersonnel: personnel.length,
    avgFitness: personnel.reduce((sum, p) => sum + p.fitness_score, 0) / personnel.length,
    highStress: personnel.filter(p => p.stress_index > 60).length,
    medicalIssues: personnel.filter(p => p.injury_history_str && p.injury_history_str.length > 0).length,
    dueMedical: personnel.filter(p => {
      const lastCheck = new Date(p.last_medical_check);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return lastCheck < sixMonthsAgo;
    }).length
  };

  const fitnessCategories = {
    excellent: personnel.filter(p => p.fitness_score >= 90).length,
    good: personnel.filter(p => p.fitness_score >= 75 && p.fitness_score < 90).length,
    average: personnel.filter(p => p.fitness_score >= 60 && p.fitness_score < 75).length,
    poor: personnel.filter(p => p.fitness_score < 60).length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="header mb-8 p-6 rounded-2xl">
        <h1 className="text-4xl font-bold" style={{color: '#1e293b', marginBottom: '8px'}}>IAF Medical Officer Dashboard</h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: '500'}}>Health Monitoring, Fitness Tracking & Medical Readiness Oversight</p>
      </div>

      {/* Medical Metrics */}
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon blue">
              🏥
            </div>
            <div className="metric-content">
              <h3>{medicalStats.totalPersonnel}</h3>
              <p>Total Personnel</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon green">
              💪
            </div>
            <div className="metric-content">
              <h3>{medicalStats.avgFitness.toFixed(1)}</h3>
              <p>Avg Fitness Score</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon red">
              😰
            </div>
            <div className="metric-content">
              <h3>{medicalStats.highStress}</h3>
              <p>High Stress Cases</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon orange">
              📋
            </div>
            <div className="metric-content">
              <h3>{medicalStats.dueMedical}</h3>
              <p>Due Checkups</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Fitness Distribution */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Fitness Score Distribution</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{background: 'rgba(220, 252, 231, 0.8)'}}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Excellent (90-100)</span>
                <span className="font-bold text-green-600">{fitnessCategories.excellent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${(fitnessCategories.excellent / personnel.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg" style={{background: 'rgba(219, 234, 254, 0.8)'}}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Good (75-89)</span>
                <span className="font-bold text-blue-600">{fitnessCategories.good}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${(fitnessCategories.good / personnel.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg" style={{background: 'rgba(254, 243, 199, 0.8)'}}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Average (60-74)</span>
                <span className="font-bold text-yellow-600">{fitnessCategories.average}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full" 
                  style={{ width: `${(fitnessCategories.average / personnel.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg" style={{background: 'rgba(254, 202, 202, 0.8)'}}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Poor (&lt;60)</span>
                <span className="font-bold text-red-600">{fitnessCategories.poor}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full" 
                  style={{ width: `${(fitnessCategories.poor / personnel.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* High Priority Cases */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>High Priority Medical Cases</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {personnel
              .filter(p => p.stress_index > 60 || p.fitness_score < 65 || (p.injury_history_str && p.injury_history_str.length > 0))
              .slice(0, 8)
              .map((person) => (
                <div key={person.id} className="card p-4" style={{background: 'rgba(254, 202, 202, 0.8)'}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.rank} - {person.unit}</p>
                      <div className="flex space-x-4 text-xs text-red-600 mt-1">
                        {person.fitness_score < 65 && <span>Low Fitness: {person.fitness_score}</span>}
                        {person.stress_index > 60 && <span>High Stress: {person.stress_index}</span>}
                        {person.injury_history_str && person.injury_history_str.length > 0 && <span>Medical History</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPerson(person)}
                      className="btn-primary"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Medical Records Table */}
      <div className="dashboard-card">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Medical Records Overview</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Fitness Score</th>
                <th>Stress Level</th>
                <th>Last Checkup</th>
                <th>Medical History</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {personnel.slice(0, 15).map((person) => {
                const lastCheck = new Date(person.last_medical_check);
                const isOverdue = (new Date() - lastCheck) > (6 * 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <tr key={person.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="metric-icon blue mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.rank}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        person.fitness_score >= 85 ? 'badge-success' :
                        person.fitness_score >= 70 ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {person.fitness_score}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        person.stress_index <= 40 ? 'badge-success' :
                        person.stress_index <= 60 ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {person.stress_index}
                      </span>
                    </td>
                    <td>
                      <div className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                        {lastCheck.toLocaleDateString()}
                        {isOverdue && <div className="text-xs">Overdue</div>}
                      </div>
                    </td>
                    <td>
                      {person.injury_history_str && person.injury_history_str.length > 0 ? (
                        <span className="badge badge-danger">Yes</span>
                      ) : (
                        <span className="badge badge-success">Clear</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        person.fitness_score >= 75 && person.stress_index <= 50 && !isOverdue
                          ? 'badge-success'
                          : person.fitness_score >= 60 && person.stress_index <= 65
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}>
                        {person.fitness_score >= 75 && person.stress_index <= 50 && !isOverdue
                          ? 'Fit for Duty'
                          : person.fitness_score >= 60 && person.stress_index <= 65
                          ? 'Monitor'
                          : 'Requires Attention'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personnel Medical Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Profile</h3>
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-sm text-gray-900">{selectedPerson.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Age</p>
                  <p className="text-sm text-gray-900">{selectedPerson.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Fitness Score</p>
                  <p className="text-sm text-gray-900">{selectedPerson.fitness_score}/100</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Stress Index</p>
                  <p className="text-sm text-gray-900">{selectedPerson.stress_index}/100</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Medical Check</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedPerson.last_medical_check).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Branch</p>
                  <p className="text-sm text-gray-900">{selectedPerson.branch}</p>
                </div>
              </div>
              
              {selectedPerson.injury_history_str && selectedPerson.injury_history_str.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Medical History</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.injury_history_str.split(',').map((injury, index) => (
                      <span key={index} className="badge badge-danger">
                        {injury.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Schedule Checkup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Chatbot */}
      <ChatbotButton userRole="medical_officer" />
    </div>
  );
};

export default MedicalDashboard;
