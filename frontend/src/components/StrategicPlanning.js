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

    // Knowledge transfer - always critical for retirements
    recommendations.push({
      title: `Implement knowledge transfer for ${actualRetirements} retiring personnel`,
      details: {
        timeline: age > 55 ? '1-2 months' : '2-4 months',
        resources: 'Training Command, Senior Officers',
        steps: [
          'Create mentorship programs',
          'Document critical procedures',
          'Establish cross-training initiatives',
          'Record expertise from retiring personnel'
        ],
        kpis: ['Knowledge retention rate', 'Training completion', 'Skill transfer success']
      }
    });

    // Unit-specific recommendations
    const mostImpactedUnit = Object.entries(impactByUnit).sort((a, b) => b[1] - a[1])[0];
    if (mostImpactedUnit && mostImpactedUnit[1] > 5) {
      recommendations.push({
        title: `Priority focus on ${mostImpactedUnit[0]} - ${mostImpactedUnit[1]} retirements`,
        details: {
          timeline: '1-3 months',
          resources: 'Unit Commander, HR Analytics',
          steps: [
            'Assess critical skill gaps in unit',
            'Identify internal transfer candidates',
            'Plan specialized recruitment',
            'Implement retention strategies'
          ],
          kpis: ['Unit readiness score', 'Skill gap closure', 'Retention improvement']
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

    // Skills assessment - always needed
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

    // Training based on skill gaps
    const criticalSkills = Object.entries(skillImpact).filter(([, count]) => count > 2);
    if (criticalSkills.length > 0) {
      recommendations.push({
        title: `Specialized training for ${criticalSkills.map(([skill]) => skill).join(', ')} roles`,
        details: {
          timeline: '2-4 weeks',
          resources: 'Training Command, Subject Matter Experts',
          steps: [
            `Design ${toUnit}-specific training modules`,
            'Schedule intensive skill workshops',
            'Arrange equipment familiarization',
            'Conduct operational simulations'
          ],
          kpis: ['Training completion rate', 'Competency improvement', 'Operational readiness']
        }
      });
    }

    // Communication protocols
    recommendations.push({
      title: `Establish ${fromUnit}-${toUnit} transition communication`,
      details: {
        timeline: '1 week',
        resources: 'Communications Team, Unit Leaders',
        steps: [
          'Set up secure communication channels',
          'Brief personnel on new command structure',
          'Establish transition timeline',
          'Create feedback and support systems'
        ],
        kpis: ['Communication clarity', 'Transition smoothness', 'Personnel satisfaction']
      }
    });

    // Risk mitigation for high impact transfers
    if (impactLevel > 0.4) {
      recommendations.push({
        title: `High-impact transfer mitigation for ${fromUnit}`,
        details: {
          timeline: '1-2 weeks',
          resources: 'Strategic Planning, Unit Commanders',
          steps: [
            'Identify critical functions at risk',
            'Plan temporary personnel backfill',
            'Accelerate replacement recruitment',
            'Implement knowledge transfer protocols'
          ],
          kpis: ['Operational continuity', 'Mission readiness', 'Risk reduction']
        }
      });
    }

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

    const unitReadiness = {};
    personnelData.forEach(person => {
      if (!unitReadiness[person.unit]) {
        unitReadiness[person.unit] = { total: 0, ready: 0 };
      }
      unitReadiness[person.unit].total++;
      if (person.readiness_score >= readinessLevel) {
        unitReadiness[person.unit].ready++;
      }
    });

    const overallReadinessPercent = (readyPersonnel.length / personnelData.length) * 100;
    const criticalGaps = Object.entries(unitReadiness).filter(([, data]) => (data.ready / data.total) < 0.8);
    const subThresholdPersonnel = personnelData.length - readyPersonnel.length;
    
    const recommendations = [];

    // Reserve activation based on readiness gap
    if (overallReadinessPercent < 80) {
      recommendations.push({
        title: `Emergency reserve activation - ${Math.ceil(subThresholdPersonnel * 0.5)} personnel needed`,
        details: {
          timeline: timeframe <= 12 ? '4-8 hours' : '6-12 hours',
          resources: 'Reserve Command, Emergency Communications',
          steps: [
            'Issue immediate activation orders',
            'Deploy emergency transport',
            'Conduct rapid integration protocols',
            'Establish emergency command structure'
          ],
          kpis: ['Activation response time', 'Reserve integration rate', 'Readiness improvement']
        }
      });
    } else {
      recommendations.push({
        title: `Selective reserve activation - ${Math.ceil(subThresholdPersonnel * 0.2)} personnel`,
        details: {
          timeline: '6-12 hours',
          resources: 'Reserve Command, Communications',
          steps: [
            'Activate specialized reserve units',
            'Coordinate targeted transportation',
            'Conduct readiness assessments',
            'Integrate with active units'
          ],
          kpis: ['Targeted activation success', 'Readiness enhancement', 'Integration efficiency']
        }
      });
    }

    // Training for sub-threshold personnel
    if (subThresholdPersonnel > 0) {
      recommendations.push({
        title: `Rapid training for ${subThresholdPersonnel} sub-threshold personnel`,
        details: {
          timeline: timeframe <= 24 ? '12-18 hours' : '24-48 hours',
          resources: 'Training Command, Mobile Units, Simulators',
          steps: [
            'Deploy mobile training units',
            'Conduct intensive skill refreshers',
            'Use simulation-based rapid training',
            'Focus on critical operational skills'
          ],
          kpis: ['Training completion rate', 'Readiness score improvement', 'Operational capability']
        }
      });
    }

    // Critical unit support
    if (criticalGaps.length > 0) {
      recommendations.push({
        title: `Priority support for ${criticalGaps.length} critical units: ${criticalGaps.map(([unit]) => unit).join(', ')}`,
        details: {
          timeline: timeframe <= 12 ? '6-12 hours' : '12-24 hours',
          resources: 'Logistics Command, Strategic Reserve',
          steps: [
            'Reallocate personnel to critical units',
            'Deploy emergency equipment',
            'Establish priority supply chains',
            'Implement emergency protocols'
          ],
          kpis: ['Critical unit readiness', 'Resource allocation speed', 'Operational continuity']
        }
      });
    }

    // Emergency protocols
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
      unitReadiness: Object.entries(unitReadiness).map(([unit, data]) => ({
        unit,
        readyPersonnel: data.ready,
        totalPersonnel: data.total,
        readinessPercentage: ((data.ready / data.total) * 100).toFixed(1)
      })),
      criticalGaps: criticalGaps.map(([unit]) => unit),
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategic Scenario Planning</h1>
          <p className="text-gray-600">AI-powered what-if analysis for strategic decision making</p>
        </div>

        {/* Scenario Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
              className={`card p-6 text-left transition-all hover:transform hover:scale-105 ${
                activeScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="text-3xl mb-3">{scenario.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{scenario.name}</h3>
              <p className="text-sm text-gray-600">
                {scenario.id === 'retirement' && 'Analyze impact of mass retirements'}
                {scenario.id === 'redeployment' && 'Simulate personnel reallocation'}
                {scenario.id === 'mobilization' && 'Assess emergency response capability'}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parameters Panel */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Simulation Parameters</h3>
            
            {activeScenario === 'retirement' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retirement Age Threshold
                  </label>
                  <input
                    type="number"
                    value={parameters.retirement.age}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      retirement: { ...prev.retirement, age: parseInt(e.target.value) }
                    }))}
                    className="form-input"
                    min="50"
                    max="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Retirement Rate (%)
                  </label>
                  <input
                    type="number"
                    value={parameters.retirement.percentage}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      retirement: { ...prev.retirement, percentage: parseInt(e.target.value) }
                    }))}
                    className="form-input"
                    min="5"
                    max="50"
                  />
                </div>
              </div>
            )}

            {activeScenario === 'redeployment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Unit
                  </label>
                  <select
                    value={parameters.redeployment.fromUnit}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, fromUnit: e.target.value }
                    }))}
                    className="form-input"
                  >
                    <option value="">Select Unit</option>
                    <option value="Fighter Squadron 1">Fighter Squadron 1</option>
                    <option value="Transport Squadron">Transport Squadron</option>
                    <option value="Helicopter Unit">Helicopter Unit</option>
                    <option value="Training Command">Training Command</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Unit
                  </label>
                  <select
                    value={parameters.redeployment.toUnit}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, toUnit: e.target.value }
                    }))}
                    className="form-input"
                  >
                    <option value="">Select Unit</option>
                    <option value="Fighter Squadron 2">Fighter Squadron 2</option>
                    <option value="Special Operations">Special Operations</option>
                    <option value="Air Defense">Air Defense</option>
                    <option value="Logistics Command">Logistics Command</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personnel to Move (%)
                  </label>
                  <input
                    type="number"
                    value={parameters.redeployment.percentage}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      redeployment: { ...prev.redeployment, percentage: parseInt(e.target.value) }
                    }))}
                    className="form-input"
                    min="5"
                    max="50"
                  />
                </div>
              </div>
            )}

            {activeScenario === 'mobilization' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobilization Timeframe (hours)
                  </label>
                  <input
                    type="number"
                    value={parameters.mobilization.timeframe}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      mobilization: { ...prev.mobilization, timeframe: parseInt(e.target.value) }
                    }))}
                    className="form-input"
                    min="6"
                    max="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Readiness Level (%)
                  </label>
                  <input
                    type="number"
                    value={parameters.mobilization.readinessLevel}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      mobilization: { ...prev.mobilization, readinessLevel: parseInt(e.target.value) }
                    }))}
                    className="form-input"
                    min="70"
                    max="100"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => runSimulation(activeScenario)}
              disabled={isRunning}
              className="btn-primary w-full mt-6"
            >
              {isRunning ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {isRunning && (
              <div className="card p-8 text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Running AI Simulation</h3>
                <p className="text-gray-600">Analyzing personnel data and generating strategic insights...</p>
              </div>
            )}

            {simulationResults && (
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{simulationResults.type}</h3>
                  <span className={`badge ${
                    simulationResults.riskLevel === 'High' ? 'badge-danger' :
                    simulationResults.riskLevel === 'Medium' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {simulationResults.riskLevel} Risk
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {activeScenario === 'retirement' && (
                    <>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.totalEligible || 0}</div>
                        <div className="text-sm text-blue-800">Eligible for Retirement</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{simulationResults.projectedRetirements || 0}</div>
                        <div className="text-sm text-red-800">Projected Retirements</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.percentageImpact || 0}%</div>
                        <div className="text-sm text-yellow-800">Force Impact</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{simulationResults.timeline || 'N/A'}</div>
                        <div className="text-sm text-green-800">Recovery Timeline</div>
                      </div>
                    </>
                  )}

                  {activeScenario === 'redeployment' && (
                    <>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.personnelToMove || 0}</div>
                        <div className="text-sm text-blue-800">Personnel Moving</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{simulationResults.sourceUnitRemaining || 0}</div>
                        <div className="text-sm text-green-800">Remaining in Source</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.operationalImpact?.sourceUnit || 'N/A'}</div>
                        <div className="text-sm text-yellow-800">Source Impact</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{simulationResults.timeline || 'N/A'}</div>
                        <div className="text-sm text-purple-800">Transition Timeline</div>
                      </div>
                    </>
                  )}

                  {activeScenario === 'mobilization' && (
                    <>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{simulationResults.overallReadiness}%</div>
                        <div className="text-sm text-green-800">Overall Readiness</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.mobilizationCapacity?.immediate || 0}</div>
                        <div className="text-sm text-blue-800">Immediate Ready</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.mobilizationCapacity?.within24h || 0}</div>
                        <div className="text-sm text-yellow-800">Ready in 24h</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{simulationResults.timeframe || 'N/A'}</div>
                        <div className="text-sm text-purple-800">Mobilization Window</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendations</h4>
                  <div className="space-y-3">
                    {simulationResults.recommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedRecommendation(expandedRecommendation === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <span className="text-blue-500 mr-3">•</span>
                            <span className="text-gray-800 font-medium">{rec.title}</span>
                          </div>
                          <span className="text-gray-400">
                            {expandedRecommendation === index ? '−' : '+'}
                          </span>
                        </button>
                        
                        {expandedRecommendation === index && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-2">Timeline</h6>
                                <p className="text-sm text-gray-600 mb-3">{rec.details.timeline}</p>
                                
                                <h6 className="font-semibold text-gray-900 mb-2">Resources Required</h6>
                                <p className="text-sm text-gray-600">{rec.details.resources}</p>
                              </div>
                              
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-2">Action Steps</h6>
                                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                  {rec.details.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start">
                                      <span className="text-blue-400 mr-2 mt-1">→</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                                
                                <h6 className="font-semibold text-gray-900 mb-2">Key Performance Indicators</h6>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {rec.details.kpis.map((kpi, kpiIndex) => (
                                    <li key={kpiIndex} className="flex items-start">
                                      <span className="text-green-400 mr-2 mt-1">📊</span>
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

                {/* Aircraft Impact Alert */}
                {simulationResults.aircraftImpact && Object.keys(simulationResults.aircraftImpact).length > 0 && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-red-600 text-xl mr-2">⚠️</span>
                      <h4 className="text-lg font-semibold text-red-900">Critical: Aircraft Operations at Risk</h4>
                    </div>
                    <div className="text-sm text-red-700 mb-3">
                      {Object.keys(simulationResults.aircraftImpact).length} aircraft will lose qualified pilots
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(simulationResults.aircraftImpact).map(([aircraft, impact]) => (
                        <div key={aircraft} className="p-3 bg-white border border-red-300 rounded">
                          <div className="font-medium text-gray-900">{aircraft}</div>
                          <div className="text-xs text-red-600">Pilot retiring - Aircraft grounded</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-sm font-medium text-yellow-900">Immediate Actions Required:</div>
                      <div className="text-xs text-yellow-800 mt-1">
                        • Identify backup pilots • Accelerate pilot training • Consider aircraft redistribution
                      </div>
                    </div>
                  </div>
                )}

                {/* Base Impact Analysis */}
                {simulationResults.baseImpact && Object.keys(simulationResults.baseImpact).length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Air Base Impact Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(simulationResults.baseImpact).map(([base, impact]) => {
                        const criticalityLevel = impact > 10 ? 'Critical' : impact > 5 ? 'High' : 'Moderate';
                        const colorClass = impact > 10 ? 'bg-red-50 border-red-200' : impact > 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
                        return (
                          <div key={base} className={`p-4 rounded-lg border ${colorClass}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-gray-900">{base}</div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                impact > 10 ? 'bg-red-100 text-red-800' : 
                                impact > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {criticalityLevel}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{impact} personnel retiring</div>
                            <div className="text-xs text-gray-500">
                              {impact > 10 ? 'Base operations severely compromised' :
                               impact > 5 ? 'Significant operational impact expected' : 'Manageable operational impact'}
                            </div>
                            <div className="mt-2 text-xs font-medium">
                              Action: {impact > 10 ? 'Emergency staffing required' :
                                      impact > 5 ? 'Accelerated recruitment needed' : 'Standard replacement planning'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Squadron Impact Analysis */}
                {simulationResults.unitImpact && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Squadron Impact Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(simulationResults.unitImpact).map(([unit, impact]) => {
                        const impactLevel = impact > 5 ? 'Critical' : impact > 2 ? 'High' : 'Moderate';
                        const colorClass = impact > 5 ? 'bg-red-50 border-red-200' : impact > 2 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
                        return (
                          <div key={unit} className={`p-4 rounded-lg border ${colorClass}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-gray-900">{unit}</div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                impact > 5 ? 'bg-red-100 text-red-800' : 
                                impact > 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {impactLevel}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{impact} personnel retiring</div>
                            <div className="text-xs text-gray-500">
                              {impact > 5 ? 'Squadron combat readiness at risk' :
                               impact > 2 ? 'Operational capability reduced' : 'Minimal impact on operations'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {simulationResults.unitReadiness && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Unit Readiness Status</h4>
                    <div className="space-y-2">
                      {simulationResults.unitReadiness.map((unit, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{unit.unit}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{unit.readyPersonnel}/{unit.totalPersonnel}</span>
                            <span className={`badge ${
                              parseFloat(unit.readinessPercentage) >= 90 ? 'badge-success' :
                              parseFloat(unit.readinessPercentage) >= 80 ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {unit.readinessPercentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPlanning;