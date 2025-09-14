import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const HRDashboard = ({ user }) => {
  const [personnel, setPersonnel] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
    fetchDashboardData();
    
    // Realistic update: Only refresh data every 30 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/dashboard_stats/');
      if (!response.ok) throw new Error('Backend not available');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.log('Using mock data - backend not available');
      setStats({
        total_personnel: 10000,
        pending_requests: 3,
        high_attrition_risk: 850,
        high_potential: 1250,
        recruitment_pipeline: 450,
        training_completion: 89.2,
        last_updated: new Date().toLocaleString()
      });
    }
  };

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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading IAF HR Center...</p>
        </div>
      </div>
    );
  }

  const highRiskPersonnel = personnel.filter(p => p.attrition_risk);

  return (
    <div className="hr-dashboard">
      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">👥</span>
            <span>HR COMMAND CENTER</span>
          </div>
          <h1 className="hero-title">
            भारतीय वायु सेना मानव संसाधन केंद्र
          </h1>
          <h2 className="hero-subtitle">
            IAF Human Resource Management Center
          </h2>
          <p className="hero-description">
            Personnel Management, Recruitment & Workforce Analytics Dashboard
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">{stats?.total_personnel || 0}</span>
              <span className="stat-label">Total Personnel</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{stats?.pending_requests || 0}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{stats?.training_completion?.toFixed(1) || 0}%</span>
              <span className="stat-label">Training Completion</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="iaf-background-container">
            <img 
              src="https://www.bing.com/ck/a?!&&p=cc009386cdaa6e75b96712c1eefb2b860647dbc0c11289bac8996f1278687b82JmltdHM9MTc1NzcyMTYwMA&ptn=3&ver=2&hsh=4&fclid=25db678c-2c47-6811-1c55-72562df56958&u=a1L2ltYWdlcy9zZWFyY2g_cT1pbmRpYW4lMjBhaXIlMjBmb3JjZSUyMGxvZ28mRk9STT1JUUZSQkEmaWQ9MTBERTY4MThDMjUyRkUzQUQ3NDE1MjhEMjlGQzlGMDBEMTFCOTlCRg" 
              alt="Indian Air Force" 
              className="iaf-bg-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="iaf-emblem-large" style={{display: 'none'}}>
              <img 
                src="/images/indian-air-force-day-air-force-day-indian-air-force-day-wallpaper-free-vector.jpg" 
                alt="Indian Air Force" 
                className="emblem-fallback-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="emblem-wings">✈️</div><div class="emblem-chakra">⚡</div><div class="emblem-glow"></div>';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          <span>Overview</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          <span className="tab-icon">👥</span>
          <span>Personnel</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recruitment' ? 'active' : ''}`}
          onClick={() => setActiveTab('recruitment')}
        >
          <span className="tab-icon">📝</span>
          <span>Recruitment</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📈</span>
          <span>Analytics</span>
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            {/* Key HR Metrics */}
            <div className="metrics-grid">
              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon orange">👥</div>
                  <div className="metric-trend positive">+2.3%</div>
                </div>
                <div className="metric-body">
                  <h3>{personnel.length}</h3>
                  <p>Active Personnel</p>
                  <div className="metric-detail">Across all units</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon blue">📝</div>
                  <div className="metric-trend neutral">3 New</div>
                </div>
                <div className="metric-body">
                  <h3>3</h3>
                  <p>Pending Requests</p>
                  <div className="metric-detail">Awaiting approval</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon red">⚠️</div>
                  <div className="metric-trend negative">-0.5%</div>
                </div>
                <div className="metric-body">
                  <h3>{highRiskPersonnel.length}</h3>
                  <p>Attrition Risk</p>
                  <div className="metric-detail">Requiring attention</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon green">⚡</div>
                  <div className="metric-trend positive">+3.1%</div>
                </div>
                <div className="metric-body">
                  <h3>{personnel.filter(p => p.leadership_potential === 'high').length}</h3>
                  <p>High Potential</p>
                  <div className="metric-detail">Future leaders</div>
                </div>
              </div>
            </div>

            {/* HR Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* High Risk Personnel */}
              <div className="dashboard-card slide-in-left">
                <div className="card-header">
                  <h3>High Attrition Risk Personnel</h3>
                  <div className="header-badge">
                    <span>{highRiskPersonnel.length} At Risk</span>
                  </div>
                </div>
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
              <div className="dashboard-card slide-in-right">
                <div className="card-header">
                  <h3>Top Skills by Frequency</h3>
                  <div className="header-badge">
                    <span>Skill Analysis</span>
                  </div>
                </div>
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
          </>
        )}

        {activeTab === 'recruitment' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Pending Signup Requests</h3>
              <div className="header-badge">
                <span>3 Pending</span>
              </div>
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
        )}

        {activeTab === 'personnel' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Personnel Management</h3>
              <div className="header-badge">
                <span>{personnel.length} Officers</span>
              </div>
            </div>
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
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Skill Recommendations */}
            {skillRecommendations.length > 0 && (
              <div className="dashboard-card mb-8">
                <div className="card-header">
                  <h3>Skill Recommendations</h3>
                  <div className="header-badge">
                    <span>{skillRecommendations.length} Recommendations</span>
                  </div>
                </div>
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

            {/* Privacy & Security Section */}
            <div className="dashboard-card mb-8">
              <div className="card-header">
                <h3>Privacy & Data Security</h3>
                <div className="header-badge">
                  <span>Compliant</span>
                </div>
              </div>
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
          </>
        )}
      </div>

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

      <ChatbotButton userRole="hr_manager" />

      <style>{`
        .hr-dashboard {
          min-height: 100vh;
          padding: 0;
        }

        .hero-header {
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 50%, 
            rgba(51, 65, 85, 0.85) 100%
          );
          backdrop-filter: blur(20px);
          border-bottom: 3px solid rgba(255, 153, 0, 0.5);
          padding: 60px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .hero-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 153, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 170, 0, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          flex: 1;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 153, 0, 0.2);
          border: 2px solid rgba(255, 153, 0, 0.4);
          padding: 8px 16px;
          border-radius: 20px;
          color: #ff9900;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-icon {
          font-size: 16px;
          animation: pulse 2s infinite;
        }

        .hero-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 32px;
          font-weight: 600;
          color: #ff9900;
          margin: 0 0 16px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .hero-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 32px 0;
          font-weight: 500;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #ff9900;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .iaf-background-container {
          position: relative;
          width: 350px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .iaf-bg-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
          opacity: 0.9;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .iaf-emblem-large {
          width: 280px;
          height: 280px;
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 
            0 25px 80px rgba(255, 153, 0, 0.5),
            inset 0 6px 0 rgba(255, 255, 255, 0.2);
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .emblem-wings {
          font-size: 60px;
          animation: fly 4s ease-in-out infinite;
        }

        .emblem-fallback-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          filter: drop-shadow(0 4px 12px rgba(255, 153, 0, 0.4));
        }

        .emblem-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 153, 0, 0.3) 0%, transparent 70%);
          animation: rotate 10s linear infinite;
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 
              0 20px 60px rgba(255, 153, 0, 0.4),
              inset 0 4px 0 rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 
              0 25px 80px rgba(255, 153, 0, 0.6),
              inset 0 4px 0 rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes fly {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-2deg); }
          75% { transform: translateY(-5px) rotate(2deg); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .dashboard-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px;
          margin: 0 40px;
          border-radius: 16px;
          gap: 8px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tab-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 153, 0, 0.1), transparent);
          transition: left 0.6s;
        }

        .tab-btn:hover::before {
          left: 100%;
        }

        .tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.1));
          color: #ff9900;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .tab-icon {
          font-size: 18px;
        }

        .dashboard-content {
          padding: 40px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .metric-card-enhanced {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .metric-card-enhanced:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 153, 0, 0.3);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-trend {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 8px;
          text-transform: uppercase;
        }

        .metric-trend.positive {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .metric-trend.negative {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .metric-trend.neutral {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .metric-body h3 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 42px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .metric-body p {
          font-size: 16px;
          color: rgba(248, 250, 252, 0.8);
          margin: 0 0 8px 0;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-detail {
          font-size: 14px;
          color: rgba(248, 250, 252, 0.6);
          font-style: italic;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(255, 153, 0, 0.2);
        }

        .card-header h3 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .header-badge {
          background: rgba(255, 153, 0, 0.1);
          border: 1px solid rgba(255, 153, 0, 0.3);
          padding: 6px 12px;
          border-radius: 12px;
          color: #ff9900;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-header {
            flex-direction: column;
            text-align: center;
            gap: 32px;
          }

          .hero-stats {
            justify-content: center;
          }

          .dashboard-tabs {
            margin: 0 20px;
          }

          .dashboard-content {
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 24px;
          }

          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }

          .dashboard-tabs {
            flex-direction: column;
            margin: 0 16px;
          }

          .tab-btn {
            justify-content: center;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .iaf-emblem-large {
            width: 150px;
            height: 150px;
          }

          .emblem-wings {
            font-size: 45px;
          }
        }

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
};

export default HRDashboard;
