import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EnhancedAnalytics = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedMetric, setSelectedMetric] = useState('personnel');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time data simulation
  const [realtimeData, setRealtimeData] = useState({
    personnel: { current: 9847, trend: '+2.3%', status: 'optimal' },
    readiness: { current: 94.2, trend: '+1.8%', status: 'excellent' },
    missions: { current: 23, trend: '+15%', status: 'active' },
    equipment: { current: 89.7, trend: '-0.5%', status: 'good' }
  });

  // Advanced visualization data
  const heatmapData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Base Activity Level',
      data: [45, 32, 78, 95, 87, 62],
      backgroundColor: [
        'rgba(59, 130, 246, 0.1)',
        'rgba(16, 185, 129, 0.2)',
        'rgba(245, 158, 11, 0.3)',
        'rgba(239, 68, 68, 0.4)',
        'rgba(139, 92, 246, 0.3)',
        'rgba(6, 182, 212, 0.2)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)',
        'rgb(6, 182, 212)'
      ],
      borderWidth: 2
    }]
  };

  const radarData = {
    labels: ['Combat Readiness', 'Training Level', 'Equipment Status', 'Personnel Morale', 'Mission Success', 'Resource Availability'],
    datasets: [{
      label: 'Current Performance',
      data: [92, 88, 85, 91, 94, 87],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }, {
      label: 'Target Performance',
      data: [95, 90, 90, 95, 96, 90],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgb(16, 185, 129)',
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(16, 185, 129)'
    }]
  };

  const scatterData = {
    datasets: [{
      label: 'Personnel Performance vs Experience',
      data: Array.from({ length: 50 }, () => ({
        x: Math.random() * 20 + 1,
        y: Math.random() * 100 + 50
      })),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
    }]
  };

  const predictiveData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Actual Readiness',
      data: [88, 89, 91, 87, 92, 94, 93, 95, 92, 90, 91, 94],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    }, {
      label: 'Predicted Readiness',
      data: [null, null, null, null, null, null, null, null, 92, 93, 95, 96],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderDash: [5, 5],
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#64748b'
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(148, 163, 184, 0.2)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)'
        },
        pointLabels: {
          color: '#64748b',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent'
        },
        min: 0,
        max: 100
      }
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        personnel: {
          current: prev.personnel.current + Math.floor(Math.random() * 10 - 5),
          trend: `${(Math.random() * 4 - 2).toFixed(1)}%`,
          status: Math.random() > 0.8 ? 'alert' : 'optimal'
        },
        readiness: {
          current: Math.max(85, Math.min(98, prev.readiness.current + (Math.random() * 2 - 1))),
          trend: `${(Math.random() * 3 - 1.5).toFixed(1)}%`,
          status: 'excellent'
        },
        missions: {
          current: Math.max(0, prev.missions.current + Math.floor(Math.random() * 6 - 3)),
          trend: `${(Math.random() * 20 - 10).toFixed(0)}%`,
          status: 'active'
        },
        equipment: {
          current: Math.max(80, Math.min(95, prev.equipment.current + (Math.random() * 2 - 1))),
          trend: `${(Math.random() * 2 - 1).toFixed(1)}%`,
          status: 'good'
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderRealtimeDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(realtimeData).map(([key, data]) => (
          <div key={key} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 capitalize">{key}</h3>
              <div className={`w-3 h-3 rounded-full ${
                data.status === 'excellent' ? 'bg-green-500' :
                data.status === 'optimal' ? 'bg-blue-500' :
                data.status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {typeof data.current === 'number' ? data.current.toFixed(key === 'personnel' ? 0 : 1) : data.current}
              {key === 'readiness' || key === 'equipment' ? '%' : ''}
            </div>
            <div className={`text-sm font-medium ${
              data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.trend} from last hour
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
          <div style={{ height: '300px' }}>
            <Bar data={heatmapData} options={chartOptions} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
          <div style={{ height: '300px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedVisualizations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Correlation</h3>
          <div style={{ height: '300px' }}>
            <Scatter data={scatterData} options={chartOptions} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Predictive Analytics</h3>
          <div style={{ height: '300px' }}>
            <Line data={predictiveData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select className="form-input">
            <option>Select Data Source</option>
            <option>Personnel Records</option>
            <option>Mission Data</option>
            <option>Equipment Status</option>
            <option>Training Records</option>
          </select>
          <select className="form-input">
            <option>Select Visualization</option>
            <option>Line Chart</option>
            <option>Bar Chart</option>
            <option>Pie Chart</option>
            <option>Heatmap</option>
          </select>
          <select className="form-input">
            <option>Time Range</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
        <button className="btn-primary">Generate Custom Report</button>
      </div>
    </div>
  );

  const renderComparativeAnalysis = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Global Air Force Benchmarking</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Indian Air Force</th>
                <th>Global Average</th>
                <th>Best in Class</th>
                <th>Performance Gap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operational Readiness</td>
                <td className="font-semibold text-blue-600">94.2%</td>
                <td>89.5%</td>
                <td>96.8%</td>
                <td className="text-green-600">+4.7%</td>
              </tr>
              <tr>
                <td>Training Completion</td>
                <td className="font-semibold text-blue-600">88.3%</td>
                <td>85.2%</td>
                <td>92.1%</td>
                <td className="text-green-600">+3.1%</td>
              </tr>
              <tr>
                <td>Equipment Availability</td>
                <td className="font-semibold text-blue-600">89.7%</td>
                <td>87.4%</td>
                <td>94.3%</td>
                <td className="text-green-600">+2.3%</td>
              </tr>
              <tr>
                <td>Mission Success Rate</td>
                <td className="font-semibold text-blue-600">96.1%</td>
                <td>93.8%</td>
                <td>98.2%</td>
                <td className="text-green-600">+2.3%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Readiness Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Training Efficiency</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Resource Utilization</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
                <span className="text-sm font-medium">76%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">AI-Generated Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> Increase training frequency for Squadron 7 to improve readiness scores by 3.2%.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-green-800">
                <strong>Opportunity:</strong> Equipment utilization can be optimized to save ₹2.3 crores annually.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-yellow-800">
                <strong>Alert:</strong> Personnel morale in Base Delta shows declining trend. Intervention recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Analytics & Reporting</h1>
          <p className="text-gray-600">Advanced data visualization and AI-powered insights</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'realtime', label: 'Real-time Dashboard', icon: '📊' },
            { id: 'advanced', label: 'Advanced Visualizations', icon: '📈' },
            { id: 'comparative', label: 'Comparative Analysis', icon: '🔍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'realtime' && renderRealtimeDashboard()}
        {activeTab === 'advanced' && renderAdvancedVisualizations()}
        {activeTab === 'comparative' && renderComparativeAnalysis()}
      </div>
    </div>
  );
};

export default EnhancedAnalytics;