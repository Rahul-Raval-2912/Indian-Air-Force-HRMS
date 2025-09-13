import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HRDashboard = () => {
  const [personnel, setPersonnel] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadPersonnel();
    loadRecommendations();
  }, []);

  const loadPersonnel = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/personnel/');
      setPersonnel(response.data.slice(0, 20)); // Show first 20
    } catch (error) {
      console.error('Error loading personnel:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/personnel/skill_recommendations/?unit=Airbase1&skills=fighter_jets');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">HR Management Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Personnel Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readiness</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {personnel.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        person.readiness_score >= 80 ? 'bg-green-100 text-green-800' :
                        person.readiness_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {person.readiness_score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Skill Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">{rec.name}</h4>
                <p className="text-sm text-blue-700">ID: {rec.id}</p>
                <p className="text-sm text-blue-700">Match Score: {(rec.match_score * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
