import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const TrainingDashboard = ({ user }) => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

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
        branch: ['Flying', 'Technical', 'Administrative', 'Medical'][i % 4],
        unit: ['Fighter Squadron 1', 'Transport Squadron', 'Helicopter Unit', 'Training Command'][i % 4],
        readiness_score: Math.floor(Math.random() * 40) + 60,
        performance_rating: ['Outstanding', 'Excellent', 'Very Good', 'Good'][i % 4],
        fitness_score: Math.floor(Math.random() * 30) + 70,
        stress_index: Math.floor(Math.random() * 50) + 20,
        leadership_potential: ['high', 'medium', 'low'][i % 3],
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Calculate training statistics
  const trainingStats = {
    totalPersonnel: personnel.length,
    needsTraining: personnel.filter(p => p.readiness_score < 75).length,
    highPerformers: personnel.filter(p => p.performance_rating === 'Outstanding' || p.performance_rating === 'Excellent').length,
    avgReadiness: personnel.reduce((sum, p) => sum + p.readiness_score, 0) / personnel.length
  };

  // Skill gap analysis
  const skillAnalysis = {};
  personnel.forEach(p => {
    const skills = p.skills_str ? p.skills_str.split(',') : [];
    skills.forEach(skill => {
      const cleanSkill = skill.trim();
      if (!skillAnalysis[cleanSkill]) {
        skillAnalysis[cleanSkill] = { count: 0, avgReadiness: 0, totalReadiness: 0 };
      }
      skillAnalysis[cleanSkill].count++;
      skillAnalysis[cleanSkill].totalReadiness += p.readiness_score;
      skillAnalysis[cleanSkill].avgReadiness = skillAnalysis[cleanSkill].totalReadiness / skillAnalysis[cleanSkill].count;
    });
  });

  const topSkills = Object.entries(skillAnalysis)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="header mb-8 p-6 rounded-2xl">
        <h1 className="text-4xl font-bold" style={{color: '#1e293b', marginBottom: '8px'}}>IAF Training Officer Dashboard</h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: '500'}}>Training Programs, Skill Development & Certification Management</p>
      </div>

      {/* Training Metrics */}
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon blue">
              📚
            </div>
            <div className="metric-content">
              <h3>{trainingStats.totalPersonnel}</h3>
              <p>Total Personnel</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon orange">
              ⏰
            </div>
            <div className="metric-content">
              <h3>{trainingStats.needsTraining}</h3>
              <p>Needs Training</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon green">
              🏆
            </div>
            <div className="metric-content">
              <h3>{trainingStats.highPerformers}</h3>
              <p>High Performers</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon purple">
              📊
            </div>
            <div className="metric-content">
              <h3>{trainingStats.avgReadiness.toFixed(1)}%</h3>
              <p>Avg Readiness</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Distribution */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Skill Distribution & Readiness</h3>
          <div className="space-y-4">
            {topSkills.map(([skill, data]) => (
              <div key={skill} className="p-4 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.5)'}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">{skill}</span>
                  <span className="text-sm text-gray-500">{data.count} personnel</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      data.avgReadiness >= 80 ? 'bg-green-500' :
                      data.avgReadiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.avgReadiness}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">Avg Readiness: {data.avgReadiness.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training Priorities */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Training Priorities</h3>
          <div className="space-y-3">
            {personnel
              .filter(p => p.readiness_score < 75)
              .sort((a, b) => a.readiness_score - b.readiness_score)
              .slice(0, 8)
              .map((person) => (
                <div key={person.id} className="card p-4" style={{background: 'rgba(255, 243, 199, 0.8)'}}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.rank} - {person.branch}</p>
                      <p className="text-sm text-orange-600">
                        Readiness: {person.readiness_score}% | Performance: {person.performance_rating || 'N/A'}
                      </p>
                    </div>
                    <span className="badge badge-warning">Priority</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Training Programs */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Recommended Training Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">🚁 Advanced Combat Training</h4>
            <p className="text-sm text-gray-600 mb-4">
              Enhanced combat readiness for Flying branch personnel with readiness scores below 70%.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600 font-semibold">
                {personnel.filter(p => p.branch === 'Flying' && p.readiness_score < 70).length} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">🔧 Technical Skills Upgrade</h4>
            <p className="text-sm text-gray-600 mb-4">
              Advanced technical training for maintenance and engineering personnel.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 font-semibold">
                {personnel.filter(p => p.branch === 'Technical' && p.readiness_score < 75).length} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">👑 Leadership Development</h4>
            <p className="text-sm text-gray-600 mb-4">
              Leadership training for high-potential personnel identified for advancement.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-600 font-semibold">
                {personnel.filter(p => p.leadership_potential === 'high').length} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">🧘 Stress Management</h4>
            <p className="text-sm text-gray-600 mb-4">
              Stress reduction and mental health training for high-stress personnel.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600 font-semibold">
                {personnel.filter(p => p.stress_index > 60).length} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">🔒 Cyber Security Training</h4>
            <p className="text-sm text-gray-600 mb-4">
              Modern cyber defense training for all branches with focus on digital security.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-indigo-600 font-semibold">
                {Math.floor(personnel.length * 0.3)} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-bold text-gray-900 mb-3">💪 Physical Fitness Program</h4>
            <p className="text-sm text-gray-600 mb-4">
              Intensive fitness training for personnel with fitness scores below 70.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-600 font-semibold">
                {personnel.filter(p => p.fitness_score < 70).length} candidates
              </span>
              <button className="btn-primary">Schedule</button>
            </div>
          </div>
        </div>
      </div>

      {/* Personnel Training Status */}
      <div className="dashboard-card">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Personnel Training Status</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Branch</th>
                <th>Readiness</th>
                <th>Performance</th>
                <th>Skills</th>
                <th>Training Need</th>
              </tr>
            </thead>
            <tbody>
              {personnel.slice(0, 15).map((person) => {
                const trainingNeed = person.readiness_score < 60 ? 'Critical' :
                                   person.readiness_score < 75 ? 'High' :
                                   person.readiness_score < 85 ? 'Medium' : 'Low';
                
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
                    <td>{person.branch}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              person.readiness_score >= 80 ? 'bg-green-500' :
                              person.readiness_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${person.readiness_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{person.readiness_score}%</span>
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
                      <div className="flex flex-wrap gap-1">
                        {(person.skills_str ? person.skills_str.split(',').slice(0, 2) : []).map((skill, index) => (
                          <span key={index} className="badge badge-secondary" style={{fontSize: '10px'}}>
                            {skill.trim()}
                          </span>
                        ))}
                        {person.skills_str && person.skills_str.split(',').length > 2 && (
                          <span className="text-xs text-gray-500">+{person.skills_str.split(',').length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        trainingNeed === 'Critical' ? 'badge-danger' :
                        trainingNeed === 'High' ? 'badge-warning' :
                        trainingNeed === 'Medium' ? 'badge-info' :
                        'badge-success'
                      }`}>
                        {trainingNeed}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Assistant Chatbot */}
      <ChatbotButton userRole="training_officer" />
    </div>
  );
};

export default TrainingDashboard;