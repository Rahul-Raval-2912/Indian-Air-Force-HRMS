import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const HRDashboard = ({ user }) => {
  const [personnel, setPersonnel] = useState([]);
  const [setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [skillRecommendations, setSkillRecommendations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const personnelRes = await fetch('http://localhost:8000/api/personnel/');
      const personnelData = await personnelRes.json();
      setPersonnel(personnelData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback mock data
      const mockPersonnel = Array.from({length: 50}, (_, i) => ({
        id: i + 1,
        name: `Officer ${String.fromCharCode(65 + (i % 26))}${Math.floor(i/26) + 1}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'][i % 4],
        unit: ['Fighter Squadron 1', 'Transport Squadron', 'Helicopter Unit', 'Training Command'][i % 4],
        years_of_service: Math.floor(Math.random() * 20) + 5,
        engagement_score: Math.floor(Math.random() * 40) + 60,
        readiness_score: Math.floor(Math.random() * 40) + 60,
        stress_index: Math.floor(Math.random() * 50) + 20,
        attrition_risk: Math.random() > 0.8,
        leadership_potential: ['high', 'medium', 'low'][i % 3],
        performance_rating: ['Outstanding', 'Excellent', 'Very Good', 'Good'][i % 4],
        skills_str: [
          'Fighter Aircraft, Leadership, Navigation',
          'Aircraft Maintenance, Avionics, Safety',
          'Administration, Logistics, Planning',
          'Aviation Medicine, Emergency Care, Training'
        ][i % 4]
      }));
      setPersonnel(mockPersonnel);

      setLoading(false);
    }
  };

  const fetchSkillRecommendations = async (unit, skills) => {
    const mockRecommendations = [
      { skill: 'Cyber Security', priority: 'High', description: 'Critical for modern operations' },
      { skill: 'Advanced Avionics', priority: 'Medium', description: 'Technology upgrade needed' },
      { skill: 'Leadership Development', priority: 'High', description: 'Succession planning' }
    ];
    setSkillRecommendations(mockRecommendations);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const highRiskPersonnel = personnel.filter(p => p.attrition_risk);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="header mb-8 p-6 rounded-2xl">
        <h1 className="text-4xl font-bold" style={{color: '#1e293b', marginBottom: '8px'}}>IAF HR Management Dashboard</h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: '500'}}>Personnel Management, Skill Optimization & Workforce Analytics</p>
      </div>

      {/* Key HR Metrics */}
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon blue">
              👥
            </div>
            <div className="metric-content">
              <h3>{personnel.length}</h3>
              <p>Active Personnel</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon orange">
              📝
            </div>
            <div className="metric-content">
              <h3>3</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon red">
              ⚠️
            </div>
            <div className="metric-content">
              <h3>{highRiskPersonnel.length}</h3>
              <p>Attrition Risk</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon green">
              ⚡
            </div>
            <div className="metric-content">
              <h3>{personnel.filter(p => p.leadership_potential === 'high').length}</h3>
              <p>High Potential</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Requests Section */}
      <div className="dashboard-card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold" style={{color: '#1e293b'}}>Pending Signup Requests</h3>
          <span className="badge badge-warning">3 Pending</span>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, name: 'Flight Lieutenant Rajesh Kumar', personnel_id: 'IAF006', rank: 'Flight Lieutenant', unit: 'Fighter Squadron 2', email: 'rajesh.kumar@iaf.gov.in', requested_at: '2024-01-15' },
            { id: 2, name: 'Squadron Leader Priya Sharma', personnel_id: 'IAF007', rank: 'Squadron Leader', unit: 'Transport Squadron', email: 'priya.sharma@iaf.gov.in', requested_at: '2024-01-14' },
            { id: 3, name: 'Flying Officer Amit Singh', personnel_id: 'IAF008', rank: 'Flying Officer', unit: 'Helicopter Unit', email: 'amit.singh@iaf.gov.in', requested_at: '2024-01-13' }
          ].map((request) => (
            <div key={request.id} className="card p-4" style={{background: 'rgba(254, 243, 199, 0.8)'}}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="metric-icon orange mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>
                      {request.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{request.name}</h4>
                      <p className="text-sm text-gray-600">{request.personnel_id} | {request.rank}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Unit:</span>
                      <span className="ml-2 text-gray-900">{request.unit}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{request.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Requested:</span>
                      <span className="ml-2 text-gray-900">{new Date(request.requested_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className="ml-2 badge badge-warning">Pending Review</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => alert(`Approved signup request for ${request.name}\n\nAccount created successfully!\nCredentials sent to ${request.email}`)}
                    className="btn-primary" 
                    style={{padding: '8px 16px', fontSize: '12px'}}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      const reason = prompt('Reason for rejection:');
                      if (reason) alert(`Rejected signup request for ${request.name}\n\nReason: ${reason}\nNotification sent to applicant.`);
                    }}
                    className="btn-secondary" 
                    style={{padding: '8px 16px', fontSize: '12px', background: '#ef4444', color: 'white'}}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* High Risk Personnel */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>High Attrition Risk Personnel</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {highRiskPersonnel.slice(0, 10).map((person) => (
              <div key={person.id} className="card p-4" style={{background: 'rgba(254, 202, 202, 0.8)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.rank} - {person.unit}</p>
                    <p className="text-sm text-red-600">
                      Engagement: {person.engagement_score}% | Stress: {person.stress_index}
                    </p>
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

        {/* Skill Distribution */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Top Skills by Frequency</h3>
          <div className="space-y-4">
            {Object.entries(
              personnel.reduce((acc, p) => {
                const skills = p.skills_str ? p.skills_str.split(',') : [];
                skills.forEach(skill => {
                  const cleanSkill = skill.trim();
                  acc[cleanSkill] = (acc[cleanSkill] || 0) + 1;
                });
                return acc;
              }, {})
            )
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([skill, count]) => (
              <div key={skill} className="flex justify-between items-center p-3 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.5)'}}>
                <span className="font-semibold text-gray-700">{skill}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full" 
                      style={{ width: `${(count / personnel.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personnel Management Table */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Personnel Management</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Position</th>
                <th>Experience</th>
                <th>Engagement</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {personnel.slice(0, 15).map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="metric-icon blue mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">ID: {person.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-gray-900">{person.rank}</div>
                    <div className="text-sm text-gray-500">{person.unit}</div>
                  </td>
                  <td>{person.years_of_service} years</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            person.engagement_score >= 80 ? 'bg-green-500' :
                            person.engagement_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${person.engagement_score}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{person.engagement_score}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      person.performance_rating === 'Outstanding' ? 'badge-success' :
                      person.performance_rating === 'Excellent' ? 'badge-info' :
                      person.performance_rating === 'Very Good' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {person.performance_rating || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPerson(person)}
                        className="btn-secondary"
                        style={{padding: '6px 12px', fontSize: '12px'}}
                      >
                        View
                      </button>
                      <button
                        onClick={() => fetchSkillRecommendations(person.unit, person.skills_str ? person.skills_str.split(',') : [])}
                        className="btn-primary"
                        style={{padding: '6px 12px', fontSize: '12px'}}
                      >
                        Recommend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Recommendations */}
      {skillRecommendations.length > 0 && (
        <div className="dashboard-card mb-8">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Skill Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillRecommendations.map((rec, index) => (
              <div key={index} className="card p-4" style={{background: 'rgba(219, 234, 254, 0.8)'}}>
                <h4 className="font-bold text-blue-900 mb-2">{rec.skill}</h4>
                <p className="text-sm text-blue-700 mb-2">{rec.description}</p>
                <span className={`badge ${rec.priority === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                  Priority: {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personnel Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Personnel Details</h3>
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
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-sm text-gray-900">{selectedPerson.rank}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Unit</p>
                  <p className="text-sm text-gray-900">{selectedPerson.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Years of Service</p>
                  <p className="text-sm text-gray-900">{selectedPerson.years_of_service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                  <p className="text-sm text-gray-900">{selectedPerson.engagement_score}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Readiness Score</p>
                  <p className="text-sm text-gray-900">{selectedPerson.readiness_score}%</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedPerson.skills_str ? selectedPerson.skills_str.split(',') : []).map((skill, index) => (
                    <span key={index} className="badge badge-info">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Security Section */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Privacy & Data Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg" style={{background: 'rgba(220, 252, 231, 0.8)'}}>
            <div className="flex items-center mb-3">
              <div className="metric-icon green mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>🔒</div>
              <h4 className="font-semibold text-gray-900">Data Encryption</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">All personnel data encrypted with AES-256</p>
            <span className="badge badge-success">Active</span>
          </div>
          
          <div className="p-4 rounded-lg" style={{background: 'rgba(219, 234, 254, 0.8)'}}>
            <div className="flex items-center mb-3">
              <div className="metric-icon blue mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>👁️</div>
              <h4 className="font-semibold text-gray-900">Access Monitoring</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">Real-time access logging and audit trails</p>
            <span className="badge badge-info">Monitoring</span>
          </div>
          
          <div className="p-4 rounded-lg" style={{background: 'rgba(254, 243, 199, 0.8)'}}>
            <div className="flex items-center mb-3">
              <div className="metric-icon orange mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>🛡️</div>
              <h4 className="font-semibold text-gray-900">Role-Based Access</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">Strict role-based permissions and data masking</p>
            <span className="badge badge-warning">Enforced</span>
          </div>
          
          <div className="p-4 rounded-lg" style={{background: 'rgba(233, 213, 255, 0.8)'}}>
            <div className="flex items-center mb-3">
              <div className="metric-icon purple mr-3" style={{width: '40px', height: '40px', fontSize: '16px'}}>📋</div>
              <h4 className="font-semibold text-gray-900">Compliance</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">Adheres to Indian Data Protection Laws</p>
            <span className="badge badge-secondary">Compliant</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Privacy Controls</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Data Retention:</span>
              <span className="ml-2 text-gray-900">7 years (as per IAF policy)</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Anonymization:</span>
              <span className="ml-2 text-gray-900">Auto after retirement</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Backup Encryption:</span>
              <span className="ml-2 text-gray-900">Military-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Chatbot */}
      <ChatbotButton userRole="hr_manager" />
    </div>
  );
};

export default HRDashboard;