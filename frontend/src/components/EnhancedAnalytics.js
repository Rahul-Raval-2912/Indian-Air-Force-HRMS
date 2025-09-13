import React, { useState, useEffect } from 'react';

const EnhancedAnalytics = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedMetric, setSelectedMetric] = useState('personnel');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [reportConfig, setReportConfig] = useState({
    dataSource: '',
    visualization: '',
    timeRange: ''
  });
  const [generatedReport, setGeneratedReport] = useState(null);

  const [realtimeData, setRealtimeData] = useState({
    personnel: { current: 9847, trend: '+2.3%', status: 'optimal' },
    readiness: { current: 94.2, trend: '+1.8%', status: 'excellent' },
    missions: { current: 23, trend: '+15%', status: 'active' },
    equipment: { current: 89.7, trend: '-0.5%', status: 'good' }
  });

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

  useEffect(() => {
    // Update data when time range changes
    const multiplier = {
      '7d': 1,
      '30d': 1.2,
      '3m': 1.5,
      '1y': 2
    }[timeRange] || 1;

    setRealtimeData({
      personnel: { 
        current: Math.floor(9847 * multiplier), 
        trend: `+${(2.3 * multiplier).toFixed(1)}%`, 
        status: 'optimal' 
      },
      readiness: { 
        current: Math.max(85, Math.min(98, 94.2 + (Math.random() * 4 - 2))), 
        trend: `+${(1.8 * multiplier).toFixed(1)}%`, 
        status: 'excellent' 
      },
      missions: { 
        current: Math.floor(23 * multiplier), 
        trend: `+${(15 * multiplier).toFixed(0)}%`, 
        status: 'active' 
      },
      equipment: { 
        current: Math.max(80, Math.min(95, 89.7 + (Math.random() * 3 - 1.5))), 
        trend: `${(-0.5 * multiplier).toFixed(1)}%`, 
        status: 'good' 
      }
    });
    setLastUpdated(new Date());
  }, [timeRange]);

  const generateCustomReport = () => {
    if (!reportConfig.dataSource || !reportConfig.visualization || !reportConfig.timeRange) {
      alert('⚠️ Please select all required fields for report generation');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate report generation with realistic data
    setTimeout(() => {
      const reportData = {
        personnel: {
          totalRecords: Math.floor(Math.random() * 5000) + 8000,
          activePersonnel: Math.floor(Math.random() * 1000) + 7500,
          avgExperience: (Math.random() * 5 + 12).toFixed(1),
          topPerformers: Math.floor(Math.random() * 500) + 1200
        },
        missions: {
          completed: Math.floor(Math.random() * 100) + 450,
          success_rate: (Math.random() * 10 + 90).toFixed(1),
          avgDuration: (Math.random() * 5 + 8).toFixed(1)
        },
        equipment: {
          operational: (Math.random() * 10 + 85).toFixed(1),
          maintenance: Math.floor(Math.random() * 50) + 120,
          efficiency: (Math.random() * 15 + 80).toFixed(1)
        },
        training: {
          programs: Math.floor(Math.random() * 20) + 45,
          completion: (Math.random() * 15 + 80).toFixed(1),
          certifications: Math.floor(Math.random() * 200) + 800
        }
      };
      
      const selectedData = reportData[reportConfig.dataSource] || reportData.personnel;
      
      setIsLoading(false);
      
      const report = {
        id: Date.now(),
        dataSource: reportConfig.dataSource,
        visualization: reportConfig.visualization,
        timeRange: reportConfig.timeRange,
        data: selectedData,
        generatedAt: new Date().toLocaleString(),
        classification: 'RESTRICTED',
        filename: `IAF_Report_${Date.now()}.pdf`
      };
      
      setGeneratedReport(report);
      
      // Show success alert
      alert('✅ IAF Custom Report Generated Successfully! Check the analysis below.');
    }, 2000);
  };

  const renderRealtimeDashboard = () => (
    <div className="analytics-content">
      <div className="metrics-grid">
        {Object.entries(realtimeData).map(([key, data]) => (
          <div key={key} className="metric-card-analytics">
            <div className="metric-header-analytics">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <div className={`status-indicator ${data.status}`}></div>
            </div>
            <div className="metric-value">
              {typeof data.current === 'number' ? data.current.toFixed(key === 'personnel' ? 0 : 1) : data.current}
              {key === 'readiness' || key === 'equipment' ? '%' : ''}
            </div>
            <div className={`metric-trend ${data.trend.startsWith('+') ? 'positive' : 'negative'}`}>
              {data.trend} from last hour
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Squadron Activity Levels</h3>
          <div className="chart-placeholder">
            <div className="activity-bars">
              {['1 Squadron', '7 Squadron', '17 Squadron', '26 Squadron', 'Transport Wing', 'Helicopter Unit'].map((squadron, index) => (
                <div key={squadron} className="activity-bar">
                  <div className="bar-label">{squadron}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${Math.random() * 80 + 20}%` }}
                    ></div>
                  </div>
                  <div className="bar-value">{Math.floor(Math.random() * 40 + 60)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Performance Radar</h3>
          <div className="radar-chart">
            <div className="radar-center">
              <div className="radar-score">92.4%</div>
              <div className="radar-label">Overall Score</div>
            </div>
            <div className="radar-metrics">
              {['Combat Readiness', 'Training Level', 'Equipment Status', 'Personnel Morale', 'Mission Success'].map((metric, index) => (
                <div key={metric} className="radar-metric">
                  <span className="metric-name">{metric}</span>
                  <span className="metric-score">{Math.floor(Math.random() * 20 + 80)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedVisualizations = () => (
    <div className="analytics-content">
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Performance Correlation Analysis</h3>
          <div className="correlation-chart">
            <div className="correlation-grid">
              <div className="y-axis-label">Performance Score (%)</div>
              <div className="chart-area">
                <div className="grid-lines">
                  {[20, 40, 60, 80, 100].map(val => (
                    <div key={val} className="grid-line horizontal" style={{bottom: `${val}%`}}>
                      <span className="grid-label">{val}</span>
                    </div>
                  ))}
                  {[0, 5, 10, 15, 20].map(val => (
                    <div key={val} className="grid-line vertical" style={{left: `${val * 5}%`}}>
                      <span className="grid-label">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="scatter-points">
                  {Array.from({ length: 50 }, (_, i) => {
                    const experience = Math.random() * 20;
                    const performance = 60 + (experience * 1.5) + (Math.random() * 20 - 10);
                    return (
                      <div 
                        key={i}
                        className="scatter-point"
                        style={{
                          left: `${(experience / 20) * 100}%`,
                          bottom: `${Math.max(0, Math.min(100, performance))}%`
                        }}
                        title={`Experience: ${experience.toFixed(1)} years, Performance: ${performance.toFixed(1)}%`}
                      ></div>
                    );
                  })}
                </div>
                <div className="trend-line"></div>
              </div>
              <div className="x-axis-label">Experience (Years)</div>
            </div>
            <div className="correlation-stats">
              <div className="stat-item">
                <span className="stat-label">Correlation</span>
                <span className="stat-value">+0.73</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">R² Score</span>
                <span className="stat-value">0.68</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Predictive Analytics - Readiness Forecast</h3>
          <div className="prediction-chart">
            <div className="prediction-grid">
              <div className="y-axis-label">Readiness Score (%)</div>
              <div className="chart-area">
                <div className="grid-lines">
                  {[70, 80, 90, 100].map(val => (
                    <div key={val} className="grid-line horizontal" style={{bottom: `${(val-70)/30*100}%`}}>
                      <span className="grid-label">{val}</span>
                    </div>
                  ))}
                </div>
                <svg className="prediction-svg" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="actualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="predictedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                  
                  <polyline
                    fill="none"
                    stroke="url(#actualGradient)"
                    strokeWidth="3"
                    points="0,120 50,110 100,100 150,95 200,105 250,90 300,85"
                  />
                  
                  <polyline
                    fill="none"
                    stroke="url(#predictedGradient)"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    points="250,90 300,85 350,80 400,75"
                  />
                  
                  {[
                    {x: 0, y: 120}, {x: 50, y: 110}, {x: 100, y: 100}, 
                    {x: 150, y: 95}, {x: 200, y: 105}, {x: 250, y: 90}, {x: 300, y: 85}
                  ].map((point, i) => (
                    <circle key={i} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
                  ))}
                  
                  {[
                    {x: 350, y: 80}, {x: 400, y: 75}
                  ].map((point, i) => (
                    <circle key={i} cx={point.x} cy={point.y} r="4" fill="#22c55e" />
                  ))}
                </svg>
              </div>
              <div className="x-axis-labels">
                {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan+1'].map((month, i) => (
                  <span key={month} className="month-label">{month}</span>
                ))}
              </div>
            </div>
            <div className="prediction-legend">
              <div className="legend-item">
                <div className="legend-color actual"></div>
                <span>Historical Data</span>
              </div>
              <div className="legend-item">
                <div className="legend-color predicted"></div>
                <span>AI Prediction</span>
              </div>
            </div>
            <div className="prediction-insights">
              <div className="insight-box">
                <div className="insight-title">Forecast Summary</div>
                <div className="insight-text">Readiness expected to improve by 2.3% over next quarter</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h3>Custom Report Builder</h3>
          <div className="header-badge">
            <span>AI-Powered</span>
          </div>
        </div>
        <div className="report-builder">
          <div className="builder-controls">
            <div className="control-group">
              <label className="form-label">Data Source</label>
              <select 
                className="form-input"
                value={reportConfig.dataSource}
                onChange={(e) => setReportConfig({...reportConfig, dataSource: e.target.value})}
              >
                <option value="">Select Data Source</option>
                <option value="personnel">Personnel Records</option>
                <option value="missions">Mission Data</option>
                <option value="equipment">Equipment Status</option>
                <option value="training">Training Records</option>
                <option value="maintenance">Maintenance Logs</option>
              </select>
            </div>
            <div className="control-group">
              <label className="form-label">Visualization Type</label>
              <select 
                className="form-input"
                value={reportConfig.visualization}
                onChange={(e) => setReportConfig({...reportConfig, visualization: e.target.value})}
              >
                <option value="">Select Visualization</option>
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="heatmap">Heatmap</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>
            <div className="control-group">
              <label className="form-label">Time Range</label>
              <select 
                className="form-input"
                value={reportConfig.timeRange}
                onChange={(e) => setReportConfig({...reportConfig, timeRange: e.target.value})}
              >
                <option value="">Select Time Range</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="3m">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
          <div className="report-generate-section">
            <button 
              className="btn-generate-report"
              onClick={generateCustomReport}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="generate-loading">
                  <div className="loading-spinner-small"></div>
                  <span>Generating IAF Report...</span>
                </div>
              ) : (
                <div className="generate-content">
                  <span className="generate-icon">📊</span>
                  <span>Generate Custom Report</span>
                  <span className="generate-arrow">→</span>
                </div>
              )}
            </button>
            <div className="report-info">
              <span>🔐 Classification: RESTRICTED</span>
              <span>📋 Format: PDF Report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparativeAnalysis = () => (
    <div className="analytics-content">
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Global Air Force Benchmarking</h3>
          <div className="header-badge">
            <span>International Comparison</span>
          </div>
        </div>
        <div className="comparison-table">
          <table className="table">
            <thead>
              <tr>
                <th>Performance Metric</th>
                <th>Indian Air Force</th>
                <th>Global Average</th>
                <th>Best in Class</th>
                <th>Performance Gap</th>
                <th>Ranking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operational Readiness</td>
                <td className="iaf-score">94.2%</td>
                <td>89.5%</td>
                <td>96.8%</td>
                <td className="positive-gap">+4.7%</td>
                <td><span className="rank-badge rank-3">3rd</span></td>
              </tr>
              <tr>
                <td>Training Completion Rate</td>
                <td className="iaf-score">88.3%</td>
                <td>85.2%</td>
                <td>92.1%</td>
                <td className="positive-gap">+3.1%</td>
                <td><span className="rank-badge rank-4">4th</span></td>
              </tr>
              <tr>
                <td>Equipment Availability</td>
                <td className="iaf-score">89.7%</td>
                <td>87.4%</td>
                <td>94.3%</td>
                <td className="positive-gap">+2.3%</td>
                <td><span className="rank-badge rank-5">5th</span></td>
              </tr>
              <tr>
                <td>Mission Success Rate</td>
                <td className="iaf-score">96.1%</td>
                <td>93.8%</td>
                <td>98.2%</td>
                <td className="positive-gap">+2.3%</td>
                <td><span className="rank-badge rank-2">2nd</span></td>
              </tr>
              <tr>
                <td>Personnel Retention</td>
                <td className="iaf-score">91.4%</td>
                <td>88.9%</td>
                <td>95.6%</td>
                <td className="positive-gap">+2.5%</td>
                <td><span className="rank-badge rank-3">3rd</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Performance Trends</h3>
          <div className="trend-metrics">
            {[
              { name: 'Readiness Score', value: 94, color: 'blue' },
              { name: 'Training Efficiency', value: 88, color: 'green' },
              { name: 'Resource Utilization', value: 76, color: 'orange' },
              { name: 'Mission Capability', value: 92, color: 'purple' }
            ].map((metric) => (
              <div key={metric.name} className="trend-item">
                <div className="trend-info">
                  <span className="trend-name">{metric.name}</span>
                  <span className="trend-value">{metric.value}%</span>
                </div>
                <div className="trend-bar">
                  <div 
                    className={`trend-fill ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h3>AI-Generated Strategic Insights</h3>
          <div className="insights-list">
            <div className="insight-item recommendation">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <strong>Strategic Recommendation:</strong> Increase training frequency for 17 Squadron to improve readiness scores by 3.2% within 60 days.
              </div>
            </div>
            <div className="insight-item opportunity">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <strong>Cost Optimization:</strong> Equipment utilization can be optimized to save ₹2.3 crores annually through predictive maintenance.
              </div>
            </div>
            <div className="insight-item alert">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <strong>Early Warning:</strong> Personnel morale in Eastern Command shows declining trend. Immediate intervention recommended.
              </div>
            </div>
            <div className="insight-item success">
              <div className="insight-icon">✅</div>
              <div className="insight-content">
                <strong>Achievement:</strong> Mission success rate improved by 4.2% this quarter, exceeding global benchmarks.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {generatedReport && (
        <div className="generated-report">
          <div className="report-header">
            <h4>📊 Generated Analysis Report</h4>
            <button 
              onClick={() => setGeneratedReport(null)}
              className="close-report-btn"
            >
              ✕
            </button>
          </div>
          
          <div className="report-metadata">
            <div className="metadata-item">
              <span className="label">📊 Data Source:</span>
              <span className="value">{generatedReport.dataSource.toUpperCase()}</span>
            </div>
            <div className="metadata-item">
              <span className="label">📈 Visualization:</span>
              <span className="value">{generatedReport.visualization.toUpperCase()}</span>
            </div>
            <div className="metadata-item">
              <span className="label">📅 Time Range:</span>
              <span className="value">{generatedReport.timeRange.toUpperCase()}</span>
            </div>
            <div className="metadata-item">
              <span className="label">🔐 Classification:</span>
              <span className="value classification">{generatedReport.classification}</span>
            </div>
          </div>
          
          <div className="report-data">
            <h5>📋 Analysis Results:</h5>
            <div className="data-grid">
              {Object.entries(generatedReport.data).map(([key, value]) => (
                <div key={key} className="data-item">
                  <div className="data-label">{key.replace('_', ' ').toUpperCase()}</div>
                  <div className="data-value">
                    {value}{typeof value === 'string' && value.includes('.') ? '%' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="report-footer">
            <div className="generated-info">
              <span>🕰️ Generated: {generatedReport.generatedAt}</span>
              <span>💾 File: {generatedReport.filename}</span>
            </div>
            <div className="report-actions">
              <button className="btn-download">💾 Download PDF</button>
              <button className="btn-share">📤 Share Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="enhanced-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Enhanced Analytics & Intelligence</h1>
          <p>Advanced Data Visualization & AI-Powered Strategic Insights</p>
          <div className="time-range-info">
            <span className="range-label">Data Range: {timeRange.toUpperCase()}</span>
            <span className="last-updated">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="header-controls">
          <select 
            className="form-input"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-tabs">
        {[
          { id: 'realtime', label: 'Real-time Dashboard', icon: '📊' },
          { id: 'advanced', label: 'Advanced Analytics', icon: '📈' },
          { id: 'comparative', label: 'Comparative Analysis', icon: '🔍' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'realtime' && renderRealtimeDashboard()}
      {activeTab === 'advanced' && renderAdvancedVisualizations()}
      {activeTab === 'comparative' && renderComparativeAnalysis()}

      <style jsx>{`
        .enhanced-analytics {
          min-height: 100vh;
          padding: 0;
        }

        .analytics-header {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid rgba(255, 153, 0, 0.3);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .header-content p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          margin: 0;
        }

        .time-range-info {
          display: flex;
          gap: 20px;
          margin-top: 12px;
          font-size: 14px;
        }

        .range-label {
          background: rgba(255, 153, 0, 0.2);
          color: #ff9900;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .last-updated {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .analytics-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px;
          margin: 0 40px;
          border-radius: 16px;
          gap: 8px;
          backdrop-filter: blur(10px);
        }

        .analytics-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .analytics-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .analytics-tab.active {
          background: linear-gradient(135deg, rgba(255, 153, 0, 0.2), rgba(255, 153, 0, 0.1));
          color: #ff9900;
          border: 1px solid rgba(255, 153, 0, 0.3);
        }

        .analytics-content {
          padding: 40px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .metric-card-analytics {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .metric-card-analytics:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 153, 0, 0.3);
        }

        .metric-header-analytics {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-header-analytics h3 {
          font-weight: 600;
          color: #f8fafc;
          margin: 0;
          text-transform: capitalize;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.excellent { background: #22c55e; }
        .status-indicator.optimal { background: #3b82f6; }
        .status-indicator.good { background: #f59e0b; }
        .status-indicator.alert { background: #ef4444; }

        .metric-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }

        .metric-trend {
          font-size: 14px;
          font-weight: 600;
        }

        .metric-trend.positive { color: #22c55e; }
        .metric-trend.negative { color: #ef4444; }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
        }

        .chart-card h3 {
          color: #f8fafc;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .activity-bars {
          space-y: 12px;
        }

        .activity-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .bar-label {
          width: 120px;
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
        }

        .bar-container {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff9900, #ffaa00);
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .bar-value {
          width: 50px;
          text-align: right;
          font-size: 12px;
          font-weight: 600;
          color: #ff9900;
        }

        .radar-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .radar-center {
          text-align: center;
        }

        .radar-score {
          font-family: 'Rajdhani', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: #ff9900;
        }

        .radar-label {
          color: rgba(248, 250, 252, 0.8);
          font-size: 14px;
        }

        .radar-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
        }

        .radar-metric {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 12px;
        }

        .metric-name {
          color: rgba(248, 250, 252, 0.8);
        }

        .metric-score {
          color: #22c55e;
          font-weight: 600;
        }

        .correlation-chart {
          height: 300px;
        }

        .correlation-grid {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .y-axis-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
        }

        .chart-area {
          flex: 1;
          position: relative;
          margin: 20px 20px 40px 50px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .grid-line {
          position: absolute;
          color: rgba(248, 250, 252, 0.4);
        }

        .grid-line.horizontal {
          left: 0;
          right: 0;
          height: 1px;
          border-top: 1px dashed rgba(255, 255, 255, 0.2);
        }

        .grid-line.vertical {
          top: 0;
          bottom: 0;
          width: 1px;
          border-left: 1px dashed rgba(255, 255, 255, 0.2);
        }

        .grid-label {
          font-size: 10px;
          color: rgba(248, 250, 252, 0.6);
          position: absolute;
        }

        .grid-line.horizontal .grid-label {
          left: -30px;
          top: -6px;
        }

        .grid-line.vertical .grid-label {
          bottom: -20px;
          left: -8px;
        }

        .scatter-points {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .scatter-point {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          opacity: 0.8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .scatter-point:hover {
          transform: scale(1.5);
          opacity: 1;
          background: #ff9900;
        }

        .trend-line {
          position: absolute;
          top: 20%;
          left: 10%;
          right: 10%;
          bottom: 30%;
          background: linear-gradient(135deg, transparent, rgba(34, 197, 94, 0.3));
          border-top: 2px solid #22c55e;
          transform: rotate(15deg);
          border-radius: 2px;
        }

        .x-axis-label {
          text-align: center;
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
          margin-top: 10px;
        }

        .correlation-stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
          justify-content: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #22c55e;
        }

        .prediction-chart {
          height: 350px;
        }

        .prediction-grid {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .prediction-svg {
          width: 100%;
          height: 200px;
        }

        .x-axis-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 20px;
        }

        .month-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
        }

        .prediction-insights {
          margin-top: 15px;
        }

        .insight-box {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          padding: 12px;
        }

        .insight-title {
          font-size: 14px;
          font-weight: 600;
          color: #22c55e;
          margin-bottom: 4px;
        }

        .insight-text {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
        }

        .prediction-legend {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
        }

        .legend-color {
          width: 16px;
          height: 3px;
          border-radius: 2px;
        }

        .legend-color.actual {
          background: #3b82f6;
        }

        .legend-color.predicted {
          background: #22c55e;
        }

        .report-builder {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .builder-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .comparison-table {
          overflow-x: auto;
        }

        .iaf-score {
          font-weight: 700;
          color: #ff9900;
        }

        .positive-gap {
          color: #22c55e;
          font-weight: 600;
        }

        .rank-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: white;
        }

        .rank-badge.rank-1 { background: #ffd700; color: #000; }
        .rank-badge.rank-2 { background: #c0c0c0; color: #000; }
        .rank-badge.rank-3 { background: #cd7f32; }
        .rank-badge.rank-4 { background: #3b82f6; }
        .rank-badge.rank-5 { background: #6b7280; }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .insight-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
        }

        .insight-card h3 {
          color: #f8fafc;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .trend-metrics {
          space-y: 16px;
        }

        .trend-item {
          margin-bottom: 16px;
        }

        .trend-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .trend-name {
          color: rgba(248, 250, 252, 0.8);
          font-size: 14px;
        }

        .trend-value {
          color: #f8fafc;
          font-weight: 600;
        }

        .trend-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .trend-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .trend-fill.blue { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
        .trend-fill.green { background: linear-gradient(90deg, #22c55e, #16a34a); }
        .trend-fill.orange { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .trend-fill.purple { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }

        .insights-list {
          space-y: 16px;
        }

        .insight-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .insight-item.recommendation {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .insight-item.opportunity {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .insight-item.alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .insight-item.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .insight-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .insight-content {
          color: rgba(248, 250, 252, 0.9);
          font-size: 14px;
          line-height: 1.5;
        }

        .loading-spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        .report-generate-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .btn-generate-report {
          background: linear-gradient(135deg, #ff9900 0%, #ffaa00 50%, #ff7700 100%);
          border: 2px solid rgba(255, 153, 0, 0.4);
          color: #0f172a;
          padding: 16px 32px;
          border-radius: 16px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 25px rgba(255, 153, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          min-width: 280px;
        }

        .btn-generate-report::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s;
        }

        .btn-generate-report:hover::before {
          left: 100%;
        }

        .btn-generate-report:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffaa00 0%, #ffbb00 50%, #ff8800 100%);
          transform: translateY(-4px) scale(1.05);
          box-shadow: 
            0 12px 35px rgba(255, 153, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 153, 0, 0.6);
        }

        .btn-generate-report:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(248, 250, 252, 0.5);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .generate-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .generate-icon {
          font-size: 20px;
        }

        .generate-arrow {
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .btn-generate-report:hover .generate-arrow {
          transform: translateX(4px);
        }

        .generate-loading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .report-info {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
          text-align: center;
        }

        .report-info span {
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .generated-report {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 153, 0, 0.3);
          border-radius: 20px;
          padding: 32px;
          margin: 32px 0;
          animation: slideIn 0.5s ease-out;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(255, 153, 0, 0.2);
        }

        .report-header h4 {
          color: #ff9900;
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
        }

        .close-report-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .close-report-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
        }

        .report-metadata {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metadata-item .label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
          font-weight: 600;
        }

        .metadata-item .value {
          font-size: 14px;
          color: #f8fafc;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
        }

        .metadata-item .value.classification {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          text-align: center;
        }

        .report-data {
          margin-bottom: 24px;
        }

        .report-data h5 {
          color: #ff9900;
          font-family: 'Rajdhani', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px 0;
          text-transform: uppercase;
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .data-item {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .data-item:hover {
          background: rgba(255, 153, 0, 0.1);
          border-color: rgba(255, 153, 0, 0.3);
          transform: translateY(-2px);
        }

        .data-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
          font-weight: 600;
          margin-bottom: 8px;
        }

        .data-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #ff9900;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .generated-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
        }

        .report-actions {
          display: flex;
          gap: 12px;
        }

        .btn-download, .btn-share {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f8fafc;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-download:hover, .btn-share:hover {
          background: rgba(255, 153, 0, 0.2);
          border-color: rgba(255, 153, 0, 0.4);
          color: #ff9900;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .analytics-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .analytics-tabs {
            flex-direction: column;
            margin: 0 20px;
          }

          .analytics-content {
            padding: 20px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .builder-controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedAnalytics;