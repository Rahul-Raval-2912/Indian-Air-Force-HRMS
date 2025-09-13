import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';

const CommanderDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [simulationResults, setSimulationResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    fetchPersonnelData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/dashboard_stats/');
      if (!response.ok) throw new Error('Backend not available');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.log('Using mock data - backend not available');
      // Enhanced mock data with IAF-specific units
      setStats({
        total_personnel: 10000,
        high_attrition_risk: 850,
        avg_readiness: 82.5,
        high_leadership_potential: 1250,
        operational_readiness: 87.3,
        mission_critical_personnel: 2340,
        units: {
          '1 Squadron (Tigers)': 450,
          '7 Squadron (Battleaxes)': 420,
          '17 Squadron (Golden Arrows)': 380,
          '26 Squadron (Warriors)': 350,
          'Transport Wing': 320,
          'Helicopter Unit': 280,
          'Training Command': 380,
          'Maintenance Wing': 420,
          'Air Defense Command': 350,
          'Logistics Wing': 300,
          'Medical Wing': 180,
          'Intelligence Wing': 150
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
        },
        aircraft_status: {
          'Sukhoi Su-30MKI': { total: 272, operational: 245, maintenance: 27 },
          'Mirage 2000': { total: 49, operational: 44, maintenance: 5 },
          'MiG-29': { total: 69, operational: 62, maintenance: 7 },
          'Tejas LCA': { total: 40, operational: 38, maintenance: 2 },
          'C-130J Super Hercules': { total: 12, operational: 11, maintenance: 1 },
          'Chinook CH-47': { total: 15, operational: 14, maintenance: 1 }
        }
      });
    }
  };

  const fetchPersonnelData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/');
      if (!response.ok) throw new Error('Backend not available');
      const data = await response.json();
      setPersonnel(data);
      setLoading(false);
    } catch (error) {
      console.log('Using mock personnel data - backend not available');
      // Enhanced mock data with IAF ranks and units
      const iafRanks = ['Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer', 'Pilot Officer'];
      const iafUnits = ['1 Squadron (Tigers)', '7 Squadron (Battleaxes)', '17 Squadron (Golden Arrows)', '26 Squadron (Warriors)', 'Transport Wing', 'Helicopter Unit', 'Training Command', 'Maintenance Wing'];
      
      const mockPersonnel = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `${['Wg Cdr', 'Sqn Ldr', 'Flt Lt', 'Fg Offr'][i % 4]} ${['Singh', 'Sharma', 'Patel', 'Kumar', 'Gupta', 'Verma', 'Yadav', 'Mishra'][i % 8]}`,
        rank: iafRanks[i % iafRanks.length],
        unit: iafUnits[i % iafUnits.length],
        readiness_score: Math.floor(Math.random() * 40) + 60,
        attrition_risk: Math.random() > 0.8,
        leadership_potential: ['high', 'medium', 'low'][i % 3],
        specialization: ['Fighter Pilot', 'Transport Pilot', 'Helicopter Pilot', 'Ground Crew', 'Technician', 'Intelligence', 'Logistics'][i % 7],
        years_of_service: Math.floor(Math.random() * 25) + 1,
        medals: Math.floor(Math.random() * 5)
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
      if (!response.ok) throw new Error('Backend not available');
      const data = await response.json();
      setSimulationResults(data);
    } catch (error) {
      console.log('Using mock simulation data - backend not available');
      const scenarioData = {
        mass_retirement: {
          affected_count: 1250,
          readiness_impact: -15.3,
          skill_gaps: ['Senior Fighter Pilots', 'Squadron Leaders', 'Technical Specialists'],
          recommended_actions: [
            'Accelerate promotion of Flight Lieutenants to Squadron Leader',
            'Implement knowledge transfer programs',
            'Recruit experienced pilots from civilian aviation',
            'Extend service tenure for critical personnel'
          ]
        },
        unit_redeployment: {
          affected_count: 850,
          readiness_impact: 8.7,
          skill_gaps: ['Transport Pilots', 'Ground Support Crew'],
          recommended_actions: [
            'Cross-train fighter pilots for transport operations',
            'Establish temporary training facilities',
            'Coordinate with allied forces for support',
            'Optimize logistics and supply chains'
          ]
        },
        emergency_mobilization: {
          affected_count: 3200,
          readiness_impact: 12.4,
          skill_gaps: ['Reserve Personnel', 'Emergency Response Teams'],
          recommended_actions: [
            'Activate all reserve squadrons immediately',
            'Implement 24/7 operational readiness',
            'Coordinate with Army and Navy commands',
            'Prepare emergency supply chains'
          ]
        }
      };
      
      setSimulationResults({
        scenario: scenario,
        ...scenarioData[scenario]
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const filteredPersonnel = selectedUnit === 'all' 
    ? personnel 
    : personnel.filter(p => p.unit === selectedUnit);

  const units = [...new Set(personnel.map(p => p.unit))];

  return (
    <div className="commander-dashboard">
      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⭐</span>
            <span>STRATEGIC COMMAND</span>
          </div>
          <h1 className="hero-title">
            भारतीय वायु सेना कमांड सेंटर
          </h1>
          <h2 className="hero-subtitle">
            Indian Air Force Command Center
          </h2>
          <p className="hero-description">
            Real-time Personnel Management & Strategic Operations Dashboard
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-value">{stats?.total_personnel || 0}</span>
              <span className="stat-label">Active Personnel</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{stats?.operational_readiness?.toFixed(1) || 0}%</span>
              <span className="stat-label">Operational Readiness</span>
            </div>
            <div className="hero-stat">
              <span className="stat-value">{Object.values(stats?.aircraft_status || {}).reduce((acc, aircraft) => acc + aircraft.operational, 0)}</span>
              <span className="stat-label">Aircraft Operational</span>
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
              <div className="emblem-wings">✈️</div>
              <div className="emblem-chakra">⚡</div>
              <div className="emblem-glow"></div>
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
          className={`tab-btn ${activeTab === 'aircraft' ? 'active' : ''}`}
          onClick={() => setActiveTab('aircraft')}
        >
          <span className="tab-icon">✈️</span>
          <span>Aircraft</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          <span className="tab-icon">🎯</span>
          <span>Operations</span>
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon orange">👥</div>
                  <div className="metric-trend positive">+2.3%</div>
                </div>
                <div className="metric-body">
                  <h3>{stats?.total_personnel || 0}</h3>
                  <p>Total Personnel</p>
                  <div className="metric-detail">Active across all commands</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon green">✅</div>
                  <div className="metric-trend positive">+1.8%</div>
                </div>
                <div className="metric-body">
                  <h3>{stats?.avg_readiness?.toFixed(1) || 0}%</h3>
                  <p>Average Readiness</p>
                  <div className="metric-detail">Mission ready personnel</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon red">⚠️</div>
                  <div className="metric-trend negative">-0.5%</div>
                </div>
                <div className="metric-body">
                  <h3>{stats?.high_attrition_risk || 0}</h3>
                  <p>High Risk Personnel</p>
                  <div className="metric-detail">Requiring attention</div>
                </div>
              </div>

              <div className="metric-card-enhanced fade-in">
                <div className="metric-header">
                  <div className="metric-icon blue">🎖️</div>
                  <div className="metric-trend positive">+3.1%</div>
                </div>
                <div className="metric-body">
                  <h3>{stats?.high_leadership_potential || 0}</h3>
                  <p>Leadership Potential</p>
                  <div className="metric-detail">Future commanders</div>
                </div>
              </div>
            </div>

            {/* Squadron & Rank Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="dashboard-card slide-in-left">
                <div className="card-header">
                  <h3>Squadron Distribution</h3>
                  <div className="header-badge">
                    <span>12 Active Squadrons</span>
                  </div>
                </div>
                <div className="distribution-list">
                  {Object.entries(stats?.units || {}).slice(0, 8).map(([unit, count]) => (
                    <div key={unit} className="distribution-item">
                      <div className="item-info">
                        <span className="item-name">{unit}</span>
                        <span className="item-count">{count}</span>
                      </div>
                      <div className="item-bar">
                        <div 
                          className="bar-fill"
                          style={{ width: `${(count / Math.max(...Object.values(stats?.units || {}))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card slide-in-right">
                <div className="card-header">
                  <h3>Rank Distribution</h3>
                  <div className="header-badge">
                    <span>10 Rank Levels</span>
                  </div>
                </div>
                <div className="distribution-list">
                  {Object.entries(stats?.ranks || {}).slice(0, 8).map(([rank, count]) => (
                    <div key={rank} className="distribution-item">
                      <div className="item-info">
                        <span className="item-name">{rank}</span>
                        <span className="item-count">{count}</span>
                      </div>
                      <div className="item-bar">
                        <div 
                          className="bar-fill green"
                          style={{ width: `${(count / Math.max(...Object.values(stats?.ranks || {}))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'personnel' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Personnel Management</h3>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="form-input"
                style={{width: 'auto', minWidth: '250px'}}
              >
                <option value="all">All Squadrons & Units</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Officer Details</th>
                    <th>Rank & Unit</th>
                    <th>Specialization</th>
                    <th>Service Record</th>
                    <th>Readiness</th>
                    <th>Risk Assessment</th>
                    <th>Leadership</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonnel.slice(0, 20).map((person) => (
                    <tr key={person.id}>
                      <td>
                        <div className="officer-info">
                          <div className="officer-name">{person.name}</div>
                          <div className="officer-id">ID: IAF{String(person.id).padStart(4, '0')}</div>
                        </div>
                      </td>
                      <td>
                        <div className="rank-unit">
                          <div className="rank">{person.rank}</div>
                          <div className="unit">{person.unit}</div>
                        </div>
                      </td>
                      <td>
                        <span className="specialization-badge">
                          {person.specialization}
                        </span>
                      </td>
                      <td>
                        <div className="service-record">
                          <div>{person.years_of_service} years</div>
                          <div className="medals">🏅 {person.medals} medals</div>
                        </div>
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
        )}

        {activeTab === 'aircraft' && (
          <div className="aircraft-status-grid">
            {Object.entries(stats?.aircraft_status || {}).map(([aircraft, status]) => (
              <div key={aircraft} className="aircraft-card">
                <div className="aircraft-header">
                  <h4>{aircraft}</h4>
                  <div className="aircraft-total">{status.total} Total</div>
                </div>
                <div className="aircraft-status">
                  <div className="status-item operational">
                    <span className="status-count">{status.operational}</span>
                    <span className="status-label">Operational</span>
                  </div>
                  <div className="status-item maintenance">
                    <span className="status-count">{status.maintenance}</span>
                    <span className="status-label">Maintenance</span>
                  </div>
                </div>
                <div className="aircraft-readiness">
                  <div className="readiness-bar">
                    <div 
                      className="readiness-fill"
                      style={{ width: `${(status.operational / status.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="readiness-percent">
                    {((status.operational / status.total) * 100).toFixed(1)}% Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Strategic Operations & Simulations</h3>
              <div className="header-badge">
                <span>Mission Planning</span>
              </div>
            </div>
            
            <div className="operations-grid">
              <button
                onClick={() => runSimulation('mass_retirement')}
                className="operation-btn"
              >
                <div className="op-icon">📅</div>
                <div className="op-content">
                  <h4>Mass Retirement Analysis</h4>
                  <p>Analyze impact of upcoming retirements</p>
                </div>
              </button>
              
              <button
                onClick={() => runSimulation('unit_redeployment')}
                className="operation-btn"
              >
                <div className="op-icon">🔄</div>
                <div className="op-content">
                  <h4>Unit Redeployment</h4>
                  <p>Strategic personnel redistribution</p>
                </div>
              </button>
              
              <button
                onClick={() => runSimulation('emergency_mobilization')}
                className="operation-btn"
              >
                <div className="op-icon">🚨</div>
                <div className="op-content">
                  <h4>Emergency Mobilization</h4>
                  <p>Rapid response capability assessment</p>
                </div>
              </button>
            </div>

            {simulationResults && (
              <div className="simulation-results">
                <h4>Simulation Results: {simulationResults.scenario.replace('_', ' ').toUpperCase()}</h4>
                <div className="results-grid">
                  <div className="result-metric">
                    <span className="metric-label">Affected Personnel</span>
                    <span className="metric-value">{simulationResults.affected_count}</span>
                  </div>
                  <div className="result-metric">
                    <span className="metric-label">Readiness Impact</span>
                    <span className={`metric-value ${simulationResults.readiness_impact > 0 ? 'positive' : 'negative'}`}>
                      {simulationResults.readiness_impact > 0 ? '+' : ''}{simulationResults.readiness_impact}%
                    </span>
                  </div>
                </div>
                <div className="recommendations">
                  <h5>Recommended Actions:</h5>
                  <ul>
                    {simulationResults.recommended_actions?.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChatbotButton userRole="commander" />

      <style jsx>{`
        .commander-dashboard {
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
          width: 300px;
          height: 200px;
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
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #ff9900, #ffaa00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 
            0 20px 60px rgba(255, 153, 0, 0.4),
            inset 0 4px 0 rgba(255, 255, 255, 0.2);
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .emblem-wings {
          font-size: 60px;
          animation: fly 4s ease-in-out infinite;
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

        .distribution-list {
          space-y: 16px;
        }

        .distribution-item {
          margin-bottom: 16px;
        }

        .item-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .item-name {
          font-weight: 600;
          color: #f8fafc;
          font-size: 14px;
        }

        .item-count {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          color: #ff9900;
          font-size: 16px;
        }

        .item-bar {
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

        .bar-fill.green {
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        .table-container {
          overflow-x: auto;
          border-radius: 16px;
        }

        .officer-info {
          display: flex;
          flex-direction: column;
        }

        .officer-name {
          font-weight: 700;
          color: #f8fafc;
          font-size: 14px;
        }

        .officer-id {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.6);
          font-family: 'Rajdhani', monospace;
        }

        .rank-unit {
          display: flex;
          flex-direction: column;
        }

        .rank {
          font-weight: 600;
          color: #ff9900;
          font-size: 14px;
        }

        .unit {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
        }

        .specialization-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .service-record {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }

        .medals {
          color: #fbbf24;
          font-weight: 600;
        }

        .aircraft-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .aircraft-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .aircraft-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 153, 0, 0.3);
        }

        .aircraft-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .aircraft-header h4 {
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          font-size: 16px;
        }

        .aircraft-total {
          background: rgba(255, 153, 0, 0.1);
          color: #ff9900;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .aircraft-status {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .status-count {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .status-item.operational .status-count {
          color: #22c55e;
        }

        .status-item.maintenance .status-count {
          color: #f59e0b;
        }

        .status-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
          text-transform: uppercase;
          font-weight: 600;
        }

        .aircraft-readiness {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .readiness-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .readiness-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .readiness-percent {
          font-size: 12px;
          font-weight: 700;
          color: #22c55e;
        }

        .operations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .operation-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .operation-btn:hover {
          background: rgba(255, 153, 0, 0.1);
          border-color: rgba(255, 153, 0, 0.3);
          transform: translateY(-4px);
        }

        .op-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: rgba(255, 153, 0, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 153, 0, 0.3);
        }

        .op-content h4 {
          font-weight: 700;
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        .op-content p {
          margin: 0;
          color: rgba(248, 250, 252, 0.7);
          font-size: 14px;
        }

        .simulation-results {
          background: rgba(255, 153, 0, 0.1);
          border: 2px solid rgba(255, 153, 0, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin-top: 24px;
        }

        .simulation-results h4 {
          color: #ff9900;
          margin: 0 0 16px 0;
          font-weight: 700;
          text-transform: uppercase;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .result-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }

        .metric-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.7);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .metric-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
        }

        .metric-value.positive {
          color: #22c55e;
        }

        .metric-value.negative {
          color: #ef4444;
        }

        .recommendations h5 {
          color: #ff9900;
          margin: 0 0 12px 0;
          font-weight: 700;
        }

        .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .recommendations li {
          color: rgba(248, 250, 252, 0.8);
          margin-bottom: 8px;
          font-size: 14px;
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
      `}</style>
    </div>
  );
};

export default CommanderDashboard;