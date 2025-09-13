import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const PersonnelDashboard = ({ user }) => {
  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const fetchPersonalData = async () => {
    try {
      // In a real app, this would fetch the current user's data
      const response = await fetch('http://localhost:8000/api/personnel/');
      const data = await response.json();
      setPersonalData(data[0]); // Use first record as example
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personal data:', error);
      // Fallback mock data
      setPersonalData({
        id: 1,
        name: 'Flight Lieutenant Kumar',
        rank: 'Flight Lieutenant',
        unit: 'Fighter Squadron 1',
        branch: 'Flying',
        age: 28,
        years_of_service: 6,
        fitness_score: 85,
        stress_index: 35,
        readiness_score: 88,
        engagement_score: 82,
        leadership_potential: 'high',
        performance_rating: 'Excellent',
        skills_str: 'Fighter Aircraft, Navigation, Leadership, Emergency Procedures',
        last_medical_check: '2024-01-15',
        leave_balance: 25,
        next_promotion_due: '2025-07-01'
      });
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="header mb-8 p-6 rounded-2xl">
        <h1 className="text-4xl font-bold" style={{color: '#1e293b', marginBottom: '8px'}}>My IAF Dashboard</h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: '500'}}>Personal Career Management & Development Portal</p>
      </div>

      {/* Personal Overview */}
      <div className="dashboard-card mb-8">
        <div className="flex items-center mb-6">
          <div className="metric-icon blue mr-6" style={{width: '80px', height: '80px', fontSize: '32px'}}>
            {personalData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{personalData.name}</h2>
            <p className="text-lg text-gray-600">{personalData.rank}</p>
            <p className="text-sm text-gray-500">{personalData.unit} • {personalData.branch} Branch</p>
            <p className="text-sm text-gray-500">{personalData.years_of_service} years of service</p>
          </div>
        </div>
      </div>

      {/* Key Personal Metrics */}
      <div className="dashboard-grid mb-8">
        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon green">
              ✅
            </div>
            <div className="metric-content">
              <h3>{personalData.readiness_score}%</h3>
              <p>Readiness Score</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon blue">
              💪
            </div>
            <div className="metric-content">
              <h3>{personalData.fitness_score}</h3>
              <p>Fitness Score</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon purple">
              🎯
            </div>
            <div className="metric-content">
              <h3>{personalData.engagement_score}%</h3>
              <p>Engagement Score</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card slide-up">
          <div className="metric-card">
            <div className="metric-icon orange">
              🏖️
            </div>
            <div className="metric-content">
              <h3>{personalData.leave_balance}</h3>
              <p>Leave Balance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Career Progress */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Career Progress</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.8)'}}>
              <h4 className="font-semibold text-gray-900 mb-2">Current Position</h4>
              <p className="text-sm text-gray-600">{personalData.rank} in {personalData.unit}</p>
              <p className="text-sm text-gray-600">Service: {personalData.years_of_service} years</p>
            </div>
            
            <div className="p-4 rounded-lg" style={{background: 'rgba(220, 252, 231, 0.8)'}}>
              <h4 className="font-semibold text-gray-900 mb-2">Performance Rating</h4>
              <span className="badge badge-success">{personalData.performance_rating}</span>
            </div>
            
            <div className="p-4 rounded-lg" style={{background: 'rgba(233, 213, 255, 0.8)'}}>
              <h4 className="font-semibold text-gray-900 mb-2">Leadership Potential</h4>
              <span className={`badge ${
                personalData.leadership_potential === 'high' ? 'badge-success' :
                personalData.leadership_potential === 'medium' ? 'badge-warning' : 'badge-secondary'
              }`}>
                {personalData.leadership_potential.toUpperCase()}
              </span>
            </div>
            
            <div className="p-4 rounded-lg" style={{background: 'rgba(254, 243, 199, 0.8)'}}>
              <h4 className="font-semibold text-gray-900 mb-2">Next Promotion</h4>
              <p className="text-sm text-gray-600">Expected: {new Date(personalData.next_promotion_due).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Target Rank: Squadron Leader</p>
            </div>
          </div>
        </div>

        {/* Skills & Training */}
        <div className="dashboard-card">
          <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Skills & Training</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Current Skills</h4>
              <div className="flex flex-wrap gap-2">
                {personalData.skills_str.split(',').map((skill, index) => (
                  <span key={index} className="badge badge-info">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.8)'}}>
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Training</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Advanced Leadership Course</span>
                  <span className="badge badge-warning">High Priority</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Cyber Security Training</span>
                  <span className="badge badge-info">Medium Priority</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Strategic Planning Workshop</span>
                  <span className="badge badge-secondary">Low Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health & Wellness */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Health & Wellness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg" style={{background: 'rgba(220, 252, 231, 0.8)'}}>
            <h4 className="font-semibold text-gray-900 mb-2">Fitness Status</h4>
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${personalData.fitness_score}%` }}
                ></div>
              </div>
              <span className="font-bold text-green-600">{personalData.fitness_score}/100</span>
            </div>
            <p className="text-sm text-gray-600">Excellent fitness level</p>
          </div>
          
          <div className="p-4 rounded-lg" style={{background: 'rgba(219, 234, 254, 0.8)'}}>
            <h4 className="font-semibold text-gray-900 mb-2">Stress Level</h4>
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${personalData.stress_index}%` }}
                ></div>
              </div>
              <span className="font-bold text-blue-600">{personalData.stress_index}/100</span>
            </div>
            <p className="text-sm text-gray-600">Manageable stress level</p>
          </div>
          
          <div className="p-4 rounded-lg" style={{background: 'rgba(254, 243, 199, 0.8)'}}>
            <h4 className="font-semibold text-gray-900 mb-2">Last Medical Check</h4>
            <p className="text-lg font-bold text-gray-900">{new Date(personalData.last_medical_check).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Next due: {new Date(new Date(personalData.last_medical_check).getTime() + 6*30*24*60*60*1000).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card mb-8">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={() => alert('Leave Application Form\n\nLeave Type: Annual Leave\nStart Date: Select date\nEnd Date: Select date\nReason: Enter reason\n\nStatus: Form would open in real application')}
          >
            <div className="text-lg mb-2">📝</div>
            <div className="font-semibold">Apply for Leave</div>
            <div className="text-sm opacity-80">Submit leave application</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={() => alert('Training Enrollment\n\nAvailable Courses:\n• Advanced Leadership Course\n• Cyber Security Training\n• Strategic Planning Workshop\n• Combat Readiness Program\n\nClick to enroll in selected course')}
          >
            <div className="text-lg mb-2">📚</div>
            <div className="font-semibold">Enroll in Course</div>
            <div className="text-sm opacity-80">Browse training programs</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={() => alert('Medical Appointment Booking\n\nNext Available Slots:\n• Tomorrow 10:00 AM\n• Day after 2:00 PM\n• Next week 9:00 AM\n\nAppointment Type:\n• Routine Checkup\n• Fitness Assessment\n• Specialist Consultation')}
          >
            <div className="text-lg mb-2">🏥</div>
            <div className="font-semibold">Medical Appointment</div>
            <div className="text-sm opacity-80">Schedule checkup</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={() => alert('Performance Review Report\n\nOverall Rating: Excellent (4.8/5.0)\n\nStrengths:\n• Leadership skills\n• Technical expertise\n• Team collaboration\n\nAreas for Development:\n• Strategic planning\n• Advanced communication\n\nNext Review: July 2024')}
          >
            <div className="text-lg mb-2">📊</div>
            <div className="font-semibold">Performance Review</div>
            <div className="text-sm opacity-80">View detailed report</div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="dashboard-card">
        <h3 className="text-xl font-bold mb-6" style={{color: '#1e293b'}}>Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.5)'}}>
            <div className="metric-icon green mr-4" style={{width: '40px', height: '40px', fontSize: '16px'}}>
              ✅
            </div>
            <div>
              <p className="font-semibold text-gray-900">Completed Advanced Navigation Training</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.5)'}}>
            <div className="metric-icon blue mr-4" style={{width: '40px', height: '40px', fontSize: '16px'}}>
              🏥
            </div>
            <div>
              <p className="font-semibold text-gray-900">Annual Medical Examination</p>
              <p className="text-sm text-gray-600">1 week ago</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-lg" style={{background: 'rgba(240, 249, 255, 0.5)'}}>
            <div className="metric-icon purple mr-4" style={{width: '40px', height: '40px', fontSize: '16px'}}>
              🎖️
            </div>
            <div>
              <p className="font-semibold text-gray-900">Received Commendation for Excellence</p>
              <p className="text-sm text-gray-600">2 weeks ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Chatbot */}
      <ChatbotButton userRole="personnel" />
    </div>
  );
};

export default PersonnelDashboard;