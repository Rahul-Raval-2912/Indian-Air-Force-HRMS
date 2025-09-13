import React, { useState, useEffect } from 'react';

const StrategicPlanning = ({ userRole }) => {
  const [activeScenario, setActiveScenario] = useState('retirement');
  const [personnelData, setPersonnelData] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);
  const [parameters, setParameters] = useState({
    retirement: { age: 58, percentage: 15 },
    redeployment: { fromUnit: '', toUnit: '', percentage: 20 },
    mobilization: { timeframe: 24, readinessLevel: 90 }
  });

  useEffect(() => {
    fetchPersonnelData();
  }, []);

  const fetchPersonnelData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personnel/');
      const data = await response.json();
      setPersonnelData(data);
    } catch (error) {
      // Mock data with air bases and aircraft
      const airBases = ['Hindon Air Base', 'Pathankot Air Base', 'Jodhpur Air Base', 'Pune Air Base', 'Kalaikunda Air Base'];
      const squadrons = ['No. 1 Squadron', 'No. 7 Squadron', 'No. 17 Squadron', 'No. 26 Squadron', 'No. 32 Squadron'];
      const mockData = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `Officer ${i + 1}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant'][i % 3],
        unit: squadrons[i % 5],
        base_location: airBases[i % 5],
        age: 25 + Math.floor(Math.random() * 30),
        years_of_service: Math.floor(Math.random() * 25) + 5,
        readiness_score: Math.floor(Math.random() * 30) + 70,
        specialization: ['Pilot', 'Engineer', 'Navigator', 'Support'][i % 4],
        aircraft_assigned: i % 3 === 0 ? `IAF-${1000 + i}` : null
      }));
      setPersonnelData(mockData);
    }
  };

  const runSimulation = async (scenarioType) => {
    setIsRunning(true);
    setSimulationResults(null);

    // Simulate API call delay
    setTimeout(() => {
      let results = {};
      
      switch(scenarioType) {
        case 'retirement':
          results = runRetirementAnalysis();
          break;
        case 'redeployment':
          results = runRedeploymentAnalysis();
          break;
        case 'mobilization':
          results = runMobilizationAnalysis();
          break;
        default:
          results = { error: 'Unknown scenario type' };
      }
      
      setSimulationResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const runRetirementAnalysis = () => {
    const { age, percentage } = parameters.retirement;
    const eligibleForRetirement = personnelData.filter(p => p.age >= age);
    const actualRetirements = Math.floor(eligibleForRetirement.length * (percentage / 100));
    
    const impactByUnit = {};
    const impactByBase = {};
    const aircraftImpact = {};
    
    eligibleForRetirement.slice(0, actualRetirements).forEach(person => {
      impactByUnit[person.unit] = (impactByUnit[person.unit] || 0) + 1;
      impactByBase[person.base_location] = (impactByBase[person.base_location] || 0) + 1;
      if (person.aircraft_assigned) {
        aircraftImpact[person.aircraft_assigned] = (aircraftImpact[person.aircraft_assigned] || 0) + 1;
      }
    });

    const percentageImpact = ((actualRetirements / personnelData.length) * 100);
    const recommendations = [];

    // Dynamic recommendations based on impact level
    if (actualRetirements > 50) {
      recommendations.push({
        title: `Emergency recruitment drive - hire ${Math.ceil(actualRetirements * 1.2)} personnel`,
        details: {
          timeline: '2-4 months',
          resources: 'HR Department, Recruitment Team, External Agencies',
          steps: [
            'Declare recruitment emergency',
            'Partner with external recruitment agencies',
            'Offer immediate joining bonuses',
            'Fast-track all selection processes'
          ],
          kpis: ['Weekly recruitment numbers', 'Time-to-hire reduction', 'Emergency hiring success rate']
        }
      });
    } else if (actualRetirements > 20) {
      recommendations.push({
        title: `Accelerate recruitment by ${Math.ceil(percentageImpact)}%`,
        details: {
          timeline: '3-6 months',
          resources: 'HR Department, Recruitment Team',
          steps: [
            'Increase recruitment budget allocation',
            'Expand recruitment channels',
            'Fast-track selection processes',
            'Offer competitive packages'
          ],
          kpis: ['Monthly recruitment numbers', 'Time-to-hire metrics', 'Quality of recruits']
        }
      });
    } else {
      recommendations.push({
        title: 'Maintain steady recruitment pipeline',
        details: {
          timeline: '6-12 months',
          resources: 'HR Department',
          steps: [
            'Continue regular recruitment cycles',
            'Focus on quality over quantity',
            'Build talent pipeline',
            'Strengthen employer branding'
          ],
          kpis: ['Recruitment quality index', 'Pipeline strength', 'Brand perception']
        }
      });
    }

    return {
      type: 'Mass Retirement Analysis',
      totalEligible: eligibleForRetirement.length,
      projectedRetirements: actualRetirements,
      percentageImpact: percentageImpact.toFixed(1),
      unitImpact: impactByUnit,
      baseImpact: impactByBase,
      aircraftImpact: aircraftImpact,
      recommendations,
      timeline: actualRetirements > 50 ? '6-12 months' : '12-18 months',
      riskLevel: actualRetirements > 50 ? 'High' : actualRetirements > 20 ? 'Medium' : 'Low'
    };
  };

  const runRedeploymentAnalysis = () => {
    const { fromUnit, toUnit, percentage } = parameters.redeployment;
    const sourcePersonnel = personnelData.filter(p => p.unit === fromUnit);
    const personnelToMove = Math.floor(sourcePersonnel.length * (percentage / 100));
    
    const skillImpact = {};
    sourcePersonnel.slice(0, personnelToMove).forEach(person => {
      skillImpact[person.specialization] = (skillImpact[person.specialization] || 0) + 1;
    });

    const impactLevel = personnelToMove / sourcePersonnel.length;
    const recommendations = [];

    recommendations.push({
      title: `Assess ${personnelToMove} personnel for ${fromUnit} to ${toUnit} transfer`,
      details: {
        timeline: impactLevel > 0.3 ? '2-3 weeks' : '1-2 weeks',
        resources: 'Training Officers, Unit Commanders',
        steps: [
          'Evaluate current skill levels of selected personnel',
          `Identify skill requirements for ${toUnit}`,
          'Match personnel skills to unit requirements',
          'Create individual development plans'
        ],
        kpis: ['Skill match percentage', 'Assessment completion rate', 'Readiness score']
      }
    });

    return {
      type: 'Unit Redeployment Analysis',
      sourceUnit: fromUnit,
      targetUnit: toUnit,
      personnelToMove: personnelToMove,
      sourceUnitRemaining: sourcePersonnel.length - personnelToMove,
      skillsTransferred: skillImpact,
      operationalImpact: {
        sourceUnit: impactLevel > 0.3 ? 'Significant' : 'Moderate',
        targetUnit: 'Enhanced capability'
      },
      recommendations,
      timeline: impactLevel > 0.4 ? '4-6 weeks' : '2-4 weeks',
      riskLevel: impactLevel > 0.4 ? 'High' : impactLevel > 0.2 ? 'Medium' : 'Low'
    };
  };

  const runMobilizationAnalysis = () => {
    const { timeframe, readinessLevel } = parameters.mobilization;
    const readyPersonnel = personnelData.filter(p => p.readiness_score >= readinessLevel);
    
    const mobilizationCapacity = {
      immediate: readyPersonnel.length,
      within24h: Math.floor(personnelData.length * 0.85),
      within48h: Math.floor(personnelData.length * 0.95)
    };

    const overallReadinessPercent = (readyPersonnel.length / personnelData.length) * 100;
    const recommendations = [];

    recommendations.push({
      title: `Activate ${timeframe}-hour emergency mobilization protocols`,
      details: {
        timeline: 'Immediate',
        resources: 'Command Center, All Units',
        steps: [
          'Activate emergency command structure',
          'Implement security condition escalation',
          'Establish rapid communication networks',
          'Deploy emergency response teams'
        ],
        kpis: ['Protocol activation time', 'Communication effectiveness', 'Security readiness']
      }
    });

    return {
      type: 'Emergency Mobilization Analysis',
      timeframe: `${timeframe} hours`,
      readinessThreshold: `${readinessLevel}%`,
      mobilizationCapacity,
      recommendations,
      overallReadiness: overallReadinessPercent.toFixed(1)
    };
  };

  const scenarios = [
    { id: 'retirement', name: 'Mass Retirement Analysis', icon: '📅', color: 'blue' },
    { id: 'redeployment', name: 'Unit Redeployment', icon: '🔄', color: 'green' },
    { id: 'mobilization', name: 'Emergency Mobilization', icon: '🚨', color: 'red' }
  ];

  return (
    <div className="strategic-planning">
      <div className="strategic-header">
        <div className="header-content">
          <h1>रणनीतिक योजना केंद्र</h1>
          <h2>Strategic Scenario Planning Center</h2>
          <p>AI-powered what-if analysis for strategic decision making</p>
        </div>
        <div className="iaf-emblem">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Indian_Air_Force_Logo.svg" 
            alt="Indian Air Force" 
            className="emblem-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="emblem-fallback" style={{display: 'none'}}>
            <img 
              src="/images/indian-air-force-day-air-force-day-indian-air-force-day-wallpaper-free-vector.jpg" 
              alt="Indian Air Force" 
              className="fallback-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span>✈️</span>';
              }}
            />
          </div>
        </div>
      </div>

      <div className="strategic-content">
        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
              className={`scenario-card ${activeScenario === scenario.id ? 'active' : ''}`}
            >
              <div className="scenario-icon">{scenario.icon}</div>
              <h3>{scenario.name}</h3>
              <p>
                {scenario.id === 'retirement' && 'Analyze impact of mass retirements'}
                {scenario.id === 'redeployment' && 'Simulate personnel reallocation'}
                {scenario.id === 'mobilization' && 'Assess emergency response capability'}
              </p>
            </button>
          ))}
        </div>

        <div className="planning-grid">
          <div className="parameters-panel">
            <h3>Simulation Parameters</h3>
            
            {activeScenario === 'retirement' && (
              <div className="parameter-group">
                <div className="input-group">
                  <label>Retirement Age Threshold</label>
                  <input
                    type="number"
                    value={parameters.retirement.age}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      retirement: { ...prev.retirement, age: parseInt(e.target.value) }
                    }))}
                    className="iaf-input"
                    min="50"
                    max="65"
                  />
                </div>
                <div className="input-group">
                  <label>Expected Retirement Rate (%)</label>
                  <input
                    type="number"
                    value={parameters.retirement.percentage}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      retirement: { ...prev.retirement, percentage: parseInt(e.target.value) }
                    }))}
                    className="iaf-input"
                    min="5"
                    max="50"
                  />
                </div>
              </div>
            )}

            {activeScenario === 'redeployment' && (
              <div className="parameter-group">
                <div className="input-group">
                  <label>From Unit</label>
                  <select
                    value={parameters.redeployment.fromUnit}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, fromUnit: e.target.value }
                    }))}
                    className="iaf-input"
                  >
                    <option value="">Select Unit</option>
                    <option value="Fighter Squadron 1">Fighter Squadron 1</option>
                    <option value="Transport Squadron">Transport Squadron</option>
                    <option value="Helicopter Unit">Helicopter Unit</option>
                    <option value="Training Command">Training Command</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>To Unit</label>
                  <select
                    value={parameters.redeployment.toUnit}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, toUnit: e.target.value }
                    }))}
                    className="iaf-input"
                  >
                    <option value="">Select Unit</option>
                    <option value="Fighter Squadron 2">Fighter Squadron 2</option>
                    <option value="Special Operations">Special Operations</option>
                    <option value="Air Defense">Air Defense</option>
                    <option value="Logistics Command">Logistics Command</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Personnel to Move (%)</label>
                  <input
                    type="number"
                    value={parameters.redeployment.percentage}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, percentage: parseInt(e.target.value) }
                    }))}
                    className="iaf-input"
                    min="5"
                    max="50"
                  />
                </div>
              </div>
            )}

            {activeScenario === 'mobilization' && (
              <div className="parameter-group">
                <div className="input-group">
                  <label>Mobilization Timeframe (hours)</label>
                  <input
                    type="number"
                    value={parameters.mobilization.timeframe}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      mobilization: { ...prev.mobilization, timeframe: parseInt(e.target.value) }
                    }))}
                    className="iaf-input"
                    min="6"
                    max="72"
                  />
                </div>
                <div className="input-group">
                  <label>Minimum Readiness Level (%)</label>
                  <input
                    type="number"
                    value={parameters.mobilization.readinessLevel}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      mobilization: { ...prev.mobilization, readinessLevel: parseInt(e.target.value) }
                    }))}
                    className="iaf-input"
                    min="70"
                    max="100"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => runSimulation(activeScenario)}
              disabled={isRunning}
              className="run-simulation-btn"
            >
              {isRunning ? (
                <>
                  <div className="loading-spinner-small"></div>
                  <span>Running Simulation...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Run Simulation</span>
                </>
              )}
            </button>
          </div>

          <div className="results-panel">
            {isRunning && (
              <div className="simulation-loading">
                <div className="loading-spinner"></div>
                <h3>Running AI Simulation</h3>
                <p>Analyzing personnel data and generating strategic insights...</p>
              </div>
            )}

            {simulationResults && (
              <div className="results-card">
                <div className="results-header">
                  <h3>{simulationResults.type}</h3>
                  <span className={`risk-badge ${
                    simulationResults.riskLevel === 'High' ? 'high-risk' :
                    simulationResults.riskLevel === 'Medium' ? 'medium-risk' : 'low-risk'
                  }`}>
                    {simulationResults.riskLevel} Risk
                  </span>
                </div>

                <div className="metrics-grid">
                  {activeScenario === 'retirement' && (
                    <>
                      <div className="metric-card blue">
                        <div className="metric-value">{simulationResults.totalEligible || 0}</div>
                        <div className="metric-label">Eligible for Retirement</div>
                      </div>
                      <div className="metric-card red">
                        <div className="metric-value">{simulationResults.projectedRetirements || 0}</div>
                        <div className="metric-label">Projected Retirements</div>
                      </div>
                      <div className="metric-card yellow">
                        <div className="metric-value">{simulationResults.percentageImpact || 0}%</div>
                        <div className="metric-label">Force Impact</div>
                      </div>
                      <div className="metric-card green">
                        <div className="metric-value">{simulationResults.timeline || 'N/A'}</div>
                        <div className="metric-label">Recovery Timeline</div>
                      </div>
                    </>
                  )}

                  {activeScenario === 'redeployment' && (
                    <>
                      <div className="metric-card blue">
                        <div className="metric-value">{simulationResults.personnelToMove || 0}</div>
                        <div className="metric-label">Personnel Moving</div>
                      </div>
                      <div className="metric-card green">
                        <div className="metric-value">{simulationResults.sourceUnitRemaining || 0}</div>
                        <div className="metric-label">Remaining in Source</div>
                      </div>
                      <div className="metric-card yellow">
                        <div className="metric-value">{simulationResults.operationalImpact?.sourceUnit || 'N/A'}</div>
                        <div className="metric-label">Source Impact</div>
                      </div>
                      <div className="metric-card purple">
                        <div className="metric-value">{simulationResults.timeline || 'N/A'}</div>
                        <div className="metric-label">Transition Timeline</div>
                      </div>
                    </>
                  )}

                  {activeScenario === 'mobilization' && (
                    <>
                      <div className="metric-card green">
                        <div className="metric-value">{simulationResults.overallReadiness}%</div>
                        <div className="metric-label">Overall Readiness</div>
                      </div>
                      <div className="metric-card blue">
                        <div className="metric-value">{simulationResults.mobilizationCapacity?.immediate || 0}</div>
                        <div className="metric-label">Immediate Ready</div>
                      </div>
                      <div className="metric-card yellow">
                        <div className="metric-value">{simulationResults.mobilizationCapacity?.within24h || 0}</div>
                        <div className="metric-label">Ready in 24h</div>
                      </div>
                      <div className="metric-card purple">
                        <div className="metric-value">{simulationResults.timeframe || 'N/A'}</div>
                        <div className="metric-label">Mobilization Window</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="recommendations-section">
                  <h4>AI Recommendations</h4>
                  <div className="recommendations-list">
                    {simulationResults.recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <button
                          onClick={() => setExpandedRecommendation(expandedRecommendation === index ? null : index)}
                          className="recommendation-header"
                        >
                          <div className="recommendation-title">
                            <span className="bullet">•</span>
                            <span>{rec.title}</span>
                          </div>
                          <span className="expand-icon">
                            {expandedRecommendation === index ? '−' : '+'}
                          </span>
                        </button>
                        
                        {expandedRecommendation === index && (
                          <div className="recommendation-details">
                            <div className="details-grid">
                              <div className="detail-section">
                                <h6>Timeline</h6>
                                <p>{rec.details.timeline}</p>
                                
                                <h6>Resources Required</h6>
                                <p>{rec.details.resources}</p>
                              </div>
                              
                              <div className="detail-section">
                                <h6>Action Steps</h6>
                                <ul>
                                  {rec.details.steps.map((step, stepIndex) => (
                                    <li key={stepIndex}>
                                      <span className="step-arrow">→</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                                
                                <h6>Key Performance Indicators</h6>
                                <ul>
                                  {rec.details.kpis.map((kpi, kpiIndex) => (
                                    <li key={kpiIndex}>
                                      <span className="kpi-icon">📊</span>
                                      {kpi}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .strategic-planning {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 50%, 
            rgba(51, 65, 85, 0.85) 100%
          );
          backdrop-filter: blur(20px);
        }

        .strategic-header {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(25px);
          border-bottom: 3px solid rgba(255, 153, 0, 0.5);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          font-family: 'Rajdhani', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #ff9900;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .header-content h2 {
          font-size: 28px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .header-content p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          margin: 0;
        }

        .iaf-emblem {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emblem-image {
          width: 120px;
          height: 120px;
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
          transition: all 0.3s ease;
        }

        .emblem-image:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
        }

        .emblem-fallback {
          width: 200px;
          height: 200px;
          background: transparent;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: none;
          overflow: visible;
          border: none;
          transition: all 0.3s ease;
        }

        .emblem-fallback:hover {
          transform: scale(1.05);
        }

        .fallback-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 0;
          filter: drop-shadow(0 4px 12px rgba(255, 153, 0, 0.4));
          background: transparent;
        }

        .strategic-content {
          padding: 40px;
        }

        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .scenario-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
          text-align: left;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .scenario-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 153, 0, 0.4);
          background: rgba(255, 255, 255, 0.12);
        }

        .scenario-card.active {
          border-color: rgba(255, 153, 0, 0.6);
          background: rgba(255, 153, 0, 0.1);
          box-shadow: 0 12px 35px rgba(255, 153, 0, 0.3);
        }

        .scenario-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .scenario-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 12px 0;
        }

        .scenario-card p {
          color: rgba(248, 250, 252, 0.8);
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }

        .planning-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 32px;
        }

        .parameters-panel {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
        }

        .parameters-panel h3 {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 24px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .parameter-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(248, 250, 252, 0.9);
        }

        .iaf-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #f8fafc;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .iaf-input:focus {
          outline: none;
          border-color: rgba(255, 153, 0, 0.5);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
        }

        .iaf-input option {
          background: #1e293b;
          color: #f8fafc;
        }

        .run-simulation-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff9900 0%, #ffaa00 50%, #ff7700 100%);
          border: 2px solid rgba(255, 153, 0, 0.4);
          color: #0f172a;
          padding: 16px 24px;
          border-radius: 16px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(255, 153, 0, 0.4);
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .run-simulation-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffaa00 0%, #ffbb00 50%, #ff8800 100%);
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 35px rgba(255, 153, 0, 0.6);
        }

        .run-simulation-btn:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(248, 250, 252, 0.5);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner-small {
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top: 2px solid #0f172a;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        .results-panel {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          min-height: 400px;
        }

        .simulation-loading {
          padding: 60px;
          text-align: center;
        }

        .simulation-loading h3 {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 16px 0 8px 0;
        }

        .simulation-loading p {
          color: rgba(248, 250, 252, 0.8);
          font-size: 16px;
          margin: 0;
        }

        .loading-spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #ff9900;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .results-card {
          padding: 24px;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(255, 153, 0, 0.2);
        }

        .results-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .risk-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .risk-badge.high-risk {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .risk-badge.medium-risk {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .risk-badge.low-risk {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .metric-card {
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .metric-card.blue { background: rgba(59, 130, 246, 0.1); }
        .metric-card.red { background: rgba(239, 68, 68, 0.1); }
        .metric-card.yellow { background: rgba(245, 158, 11, 0.1); }
        .metric-card.green { background: rgba(34, 197, 94, 0.1); }
        .metric-card.purple { background: rgba(139, 92, 246, 0.1); }

        .metric-value {
          font-family: 'Rajdhani', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }

        .metric-label {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.8);
          text-transform: uppercase;
          font-weight: 600;
        }

        .recommendations-section h4 {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 16px 0;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .recommendation-item {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
        }

        .recommendation-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: transparent;
          border: none;
          color: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .recommendation-header:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .recommendation-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bullet {
          color: #ff9900;
          font-size: 18px;
        }

        .expand-icon {
          color: rgba(248, 250, 252, 0.6);
          font-size: 18px;
        }

        .recommendation-details {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.1);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .detail-section h6 {
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .detail-section p {
          color: rgba(248, 250, 252, 0.8);
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .detail-section ul {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }

        .detail-section li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: rgba(248, 250, 252, 0.8);
          font-size: 14px;
          margin-bottom: 8px;
        }

        .step-arrow {
          color: #3b82f6;
          font-weight: 700;
        }

        .kpi-icon {
          color: #22c55e;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .strategic-header {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .planning-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .scenarios-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .strategic-content {
            padding: 20px;
          }

          .header-content h1 {
            font-size: 28px;
          }

          .header-content h2 {
            font-size: 22px;
          }

          .metrics-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StrategicPlanning;