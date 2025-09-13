import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CommanderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/personnel/dashboard_stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const runSimulation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/personnel/what_if_simulation/', {
        scenario: 'retirement',
        personnel_ids: ['IAF_000001', 'IAF_000002']
      });
      setSimulation(response.data);
    } catch (error) {
      console.error('Error running simulation:', error);
    }
  };

  if (!stats) return <div className="p-8">Loading...</div>;

  const unitChartData = {
    labels: Object.keys(stats.units),
    datasets: [{
      data: Object.values(stats.units),
      backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
    }]
  };

  const rankChartData = {
    labels: Object.keys(stats.ranks),
    datasets: [{
      label: 'Personnel Count',
      data: Object.values(stats.ranks),
      backgroundColor: '#3b82f6'
    }]
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">IAF Commander Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Personnel</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total_personnel}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Average Readiness</h3>
          <p className="text-3xl font-bold text-green-600">{Math.round(stats.avg_readiness)}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">High Attrition Risk</h3>
          <p className="text-3xl font-bold text-red-600">{stats.high_attrition_risk}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Leadership Potential</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.high_leadership_potential}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Unit Distribution</h3>
          <div className="h-64">
            <Doughnut data={unitChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Rank Distribution</h3>
          <div className="h-64">
            <Bar data={rankChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">What-If Simulation</h3>
        <button 
          onClick={runSimulation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Run Retirement Simulation
        </button>
        
        {simulation && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold">Simulation Results:</h4>
            <p>Scenario: {simulation.scenario}</p>
            <p>Affected Personnel: {simulation.affected_count}</p>
            <p>Readiness Impact: {simulation.readiness_impact}%</p>
            <p>Skill Gaps: {simulation.skill_gaps.join(', ')}</p>
            <div className="mt-2">
              <h5 className="font-semibold">Recommended Actions:</h5>
              <ul className="list-disc list-inside">
                {simulation.recommended_actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommanderDashboard;
