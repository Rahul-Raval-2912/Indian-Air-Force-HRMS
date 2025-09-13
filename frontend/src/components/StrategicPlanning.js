import React, { useState, useEffect } from 'react';

const StrategicPlanning = ({ userRole }) => {
  const [activeScenario, setActiveScenario] = useState('retirement');
  const [personnelData, setPersonnelData] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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
      // Mock data fallback
      const mockData = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        name: `Officer ${i + 1}`,
        rank: ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant'][i % 3],
        unit: ['Fighter Squadron 1', 'Transport Squadron', 'Helicopter Unit', 'Training Command'][i % 4],
        age: 25 + Math.floor(Math.random() * 30),
        years_of_service: Math.floor(Math.random() * 25) + 5,
        readiness_score: Math.floor(Math.random() * 30) + 70,
        specialization: ['Pilot', 'Engineer', 'Navigator', 'Support'][i % 4]
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
    eligibleForRetirement.slice(0, actualRetirements).forEach(person => {
      impactByUnit[person.unit] = (impactByUnit[person.unit] || 0) + 1;
    });

    return {
      type: 'Mass Retirement Analysis',
      totalEligible: eligibleForRetirement.length,
      projectedRetirements: actualRetirements,
      percentageImpact: ((actualRetirements / personnelData.length) * 100).toFixed(1),
      unitImpact: impactByUnit,
      recommendations: [
        'Accelerate recruitment by 25%',
        'Implement knowledge transfer programs',
        'Identify succession candidates',
        'Review retention incentives'
      ],
      timeline: '12-18 months',
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

    return {
      type: 'Unit Redeployment Analysis',
      sourceUnit: fromUnit,
      targetUnit: toUnit,
      personnelToMove: personnelToMove,
      sourceUnitRemaining: sourcePersonnel.length - personnelToMove,
      skillsTransferred: skillImpact,
      operationalImpact: {
        sourceUnit: personnelToMove > sourcePersonnel.length * 0.3 ? 'Significant' : 'Moderate',
        targetUnit: 'Enhanced capability'
      },
      recommendations: [
        'Conduct skills assessment',
        'Plan transition training',
        'Establish communication protocols',
        'Monitor performance metrics'
      ],
      timeline: '2-4 weeks',
      riskLevel: personnelToMove > sourcePersonnel.length * 0.4 ? 'High' : 'Medium'
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
      criticalGaps: Object.entries(unitReadiness)
        .filter(([, data]) => (data.ready / data.total) < 0.8)
        .map(([unit]) => unit),
      recommendations: [
        'Activate reserve personnel',
        'Expedite training for sub-threshold personnel',
        'Redistribute resources to critical units',
        'Implement emergency protocols'
      ],
      overallReadiness: ((readyPersonnel.length / personnelData.length) * 100).toFixed(1)
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
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.totalEligible}</div>
                        <div className="text-sm text-blue-800">Eligible for Retirement</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{simulationResults.projectedRetirements}</div>
                        <div className="text-sm text-red-800">Projected Retirements</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.percentageImpact}%</div>
                        <div className="text-sm text-yellow-800">Force Impact</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{simulationResults.timeline}</div>
                        <div className="text-sm text-green-800">Timeline</div>
                      </div>
                    </>
                  )}

                  {activeScenario === 'redeployment' && (
                    <>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.personnelToMove}</div>
                        <div className="text-sm text-blue-800">Personnel Moving</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{simulationResults.sourceUnitRemaining}</div>
                        <div className="text-sm text-green-800">Remaining in Source</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.operationalImpact.sourceUnit}</div>
                        <div className="text-sm text-yellow-800">Source Impact</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{simulationResults.timeline}</div>
                        <div className="text-sm text-purple-800">Timeline</div>
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
                        <div className="text-2xl font-bold text-blue-600">{simulationResults.mobilizationCapacity.immediate}</div>
                        <div className="text-sm text-blue-800">Immediate Ready</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{simulationResults.mobilizationCapacity.within24h}</div>
                        <div className="text-sm text-yellow-800">Ready in 24h</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{simulationResults.criticalGaps?.length || 0}</div>
                        <div className="text-sm text-red-800">Critical Gaps</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendations</h4>
                  <div className="space-y-2">
                    {simulationResults.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-500 mr-3">•</span>
                        <span className="text-gray-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Analysis */}
                {simulationResults.unitImpact && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Unit Impact Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(simulationResults.unitImpact).map(([unit, impact]) => (
                        <div key={unit} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">{unit}</div>
                          <div className="text-sm text-gray-600">{impact} personnel affected</div>
                        </div>
                      ))}
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