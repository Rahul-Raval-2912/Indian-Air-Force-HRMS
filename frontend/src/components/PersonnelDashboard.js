import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const PersonnelDashboard = ({ user }) => {
  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [medicalForm, setMedicalForm] = useState({
    appointmentDate: '',
    appointmentType: 'Routine Checkup',
    reason: ''
  });

  useEffect(() => {
    fetchPersonalData();
  }, []);

  const fetchPersonalData = async () => {
    try {
      // In a real app, this would fetch the current user's data
      const response = await fetch('/api/personnel/');
      const data = await response.json();
      setPersonalData(data[0]); // Use first record as example
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personal data:', error);
      // Fallback mock data
      setPersonalData({
        personnel_id: 'IAF001',
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

  const handleApplyLeave = () => setShowLeaveModal(true);

  const handleEnrollCourse = () => setShowCourseModal(true);
  const handleScheduleMedical = () => setShowMedicalModal(true);
  const handlePerformanceReport = () => setShowReportModal(true);

  const submitLeaveApplication = () => {
    const days = Math.ceil((new Date(leaveForm.endDate) - new Date(leaveForm.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    alert(`Leave Application Submitted!\nRequest ID: LR-${Date.now()}\nDays: ${days}\nStatus: Pending Approval`);
    setShowLeaveModal(false);
    setLeaveForm({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
  };

  const enrollInCourse = (course) => {
    alert(`Enrolled in ${course.name}!\nEnrollment ID: EN-${Date.now()}\nStatus: Confirmed`);
    setShowCourseModal(false);
  };

  const scheduleMedicalAppointment = () => {
    alert(`Medical Appointment Scheduled!\nDate: ${medicalForm.appointmentDate}\nType: ${medicalForm.appointmentType}\nAppointment ID: MED-${Date.now()}`);
    setShowMedicalModal(false);
    setMedicalForm({ appointmentDate: '', appointmentType: 'Routine Checkup', reason: '' });
  };

  const courses = [
    { id: 1, name: 'Advanced Leadership Course', duration: '6 months', location: 'Air Force Academy' },
    { id: 2, name: 'Cyber Security Training', duration: '3 months', location: 'Technical Center' },
    { id: 3, name: 'Strategic Planning Workshop', duration: '2 months', location: 'Command College' },
    { id: 4, name: 'Combat Readiness Program', duration: '4 months', location: 'Training Base' }
  ];

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
            onClick={handleApplyLeave}
          >
            <div className="text-lg mb-2">📝</div>
            <div className="font-semibold">Apply for Leave</div>
            <div className="text-sm opacity-80">Submit leave application</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={handleEnrollCourse}
          >
            <div className="text-lg mb-2">📚</div>
            <div className="font-semibold">Enroll in Course</div>
            <div className="text-sm opacity-80">Browse training programs</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={handleScheduleMedical}
          >
            <div className="text-lg mb-2">🏥</div>
            <div className="font-semibold">Medical Appointment</div>
            <div className="text-sm opacity-80">Schedule checkup</div>
          </button>
          
          <button 
            className="btn-primary p-4 text-left hover:transform hover:scale-105 transition-all"
            onClick={handlePerformanceReport}
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

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-xl font-bold mb-4">Apply for Leave</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Medical">Medical Leave</option>
                  <option value="Emergency">Emergency Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  placeholder="Enter reason for leave"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={submitLeaveApplication}
                disabled={!leaveForm.startDate || !leaveForm.endDate}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Enrollment Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-xl font-bold mb-4">Available Training Courses</h3>
            <div className="space-y-3">
              {courses.map(course => (
                <div key={course.id} className="border rounded p-3 hover:bg-gray-50">
                  <h4 className="font-semibold">{course.name}</h4>
                  <p className="text-sm text-gray-600">Duration: {course.duration}</p>
                  <p className="text-sm text-gray-600">Location: {course.location}</p>
                  <button 
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    onClick={() => enrollInCourse(course)}
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowCourseModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Appointment Modal */}
      {showMedicalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-xl font-bold mb-4">Schedule Medical Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded"
                  value={medicalForm.appointmentDate}
                  onChange={(e) => setMedicalForm({...medicalForm, appointmentDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Type</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={medicalForm.appointmentType}
                  onChange={(e) => setMedicalForm({...medicalForm, appointmentType: e.target.value})}
                >
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Fitness Assessment">Fitness Assessment</option>
                  <option value="Specialist Consultation">Specialist Consultation</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason/Symptoms</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={medicalForm.reason}
                  onChange={(e) => setMedicalForm({...medicalForm, reason: e.target.value})}
                  placeholder="Describe symptoms or reason for appointment"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowMedicalModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={scheduleMedicalAppointment}
                disabled={!medicalForm.appointmentDate}
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Performance Review Report</h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold text-green-800">Overall Rating</h4>
                <p className="text-2xl font-bold text-green-600">4.8/5.0 (Excellent)</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Strengths</h4>
                <ul className="text-sm space-y-1">
                  <li>• Leadership skills (4.9/5.0)</li>
                  <li>• Technical expertise (4.8/5.0)</li>
                  <li>• Team collaboration (4.7/5.0)</li>
                  <li>• Mission readiness (4.9/5.0)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Areas for Development</h4>
                <ul className="text-sm space-y-1">
                  <li>• Strategic planning (4.2/5.0)</li>
                  <li>• Advanced communication (4.3/5.0)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Career Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Leadership development program</li>
                  <li>• Strategic planning course</li>
                  <li>• Consider Squadron Leader role</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm"><strong>Next Review:</strong> July 2024</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelDashboard;