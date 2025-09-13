import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.decomposition import PCA
from sklearn.cluster import DBSCAN
import networkx as nx
from datetime import datetime, timedelta
import joblib

class AdvancedAnalytics:
    def __init__(self):
        self.models = {}
        
    def workforce_optimization(self, personnel_df):
        """Optimize workforce allocation across units"""
        # Skill-based optimization
        skill_matrix = self._create_skill_matrix(personnel_df)
        unit_requirements = self._calculate_unit_requirements()
        
        optimization_results = {
            'skill_gaps': self._identify_skill_gaps(skill_matrix, unit_requirements),
            'surplus_skills': self._identify_skill_surplus(skill_matrix, unit_requirements),
            'reallocation_suggestions': self._suggest_reallocations(personnel_df),
            'cross_training_opportunities': self._identify_cross_training(personnel_df)
        }
        
        return optimization_results
    
    def predictive_succession_planning(self, personnel_df):
        """Predict succession planning needs"""
        # Identify retirement pipeline
        retirement_pipeline = personnel_df[
            (personnel_df['age'] > 55) | 
            (personnel_df['years_of_service'] > 25)
        ].copy()
        
        # Leadership pipeline analysis
        leadership_pipeline = personnel_df[
            (personnel_df['leadership_potential'] == 'high') &
            (personnel_df['years_of_service'] > 8) &
            (personnel_df['performance_rating'].isin(['Outstanding', 'Excellent']))
        ].copy()
        
        succession_plan = {
            'critical_positions_at_risk': self._identify_critical_positions(retirement_pipeline),
            'ready_successors': self._match_successors(retirement_pipeline, leadership_pipeline),
            'development_needs': self._identify_development_gaps(leadership_pipeline),
            'timeline_analysis': self._create_succession_timeline(retirement_pipeline)
        }
        
        return succession_plan
    
    def anomaly_detection(self, personnel_df):
        """Detect anomalies in personnel data"""
        # Prepare features for anomaly detection
        numeric_features = ['age', 'years_of_service', 'fitness_score', 'stress_index',
                           'mission_success_rate', 'engagement_score', 'readiness_score']
        
        X = personnel_df[numeric_features].fillna(0)
        
        # Isolation Forest for anomaly detection
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        anomalies = iso_forest.fit_predict(X)
        
        anomaly_personnel = personnel_df[anomalies == -1].copy()
        
        return {
            'anomalous_records': len(anomaly_personnel),
            'anomaly_details': self._analyze_anomalies(anomaly_personnel),
            'risk_indicators': self._extract_risk_patterns(anomaly_personnel)
        }
    
    def network_analysis(self, personnel_df):
        """Analyze organizational network and relationships"""
        # Create network based on units and ranks
        G = nx.Graph()
        
        # Add nodes (personnel)
        for _, person in personnel_df.iterrows():
            G.add_node(person['id'], 
                      rank=person['rank'], 
                      unit=person['unit'],
                      leadership_score=person['leadership_score'])
        
        # Add edges (relationships within units)
        for unit in personnel_df['unit'].unique():
            unit_personnel = personnel_df[personnel_df['unit'] == unit]['id'].tolist()
            for i, person1 in enumerate(unit_personnel):
                for person2 in unit_personnel[i+1:]:
                    G.add_edge(person1, person2, weight=1)
        
        # Network metrics
        centrality = nx.degree_centrality(G)
        betweenness = nx.betweenness_centrality(G)
        
        return {
            'network_density': nx.density(G),
            'key_connectors': sorted(centrality.items(), key=lambda x: x[1], reverse=True)[:10],
            'bridge_personnel': sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:10],
            'unit_connectivity': self._analyze_unit_connectivity(G, personnel_df)
        }
    
    def scenario_modeling(self, personnel_df, scenario_params):
        """Model what-if scenarios"""
        scenario_type = scenario_params.get('type', 'retirement')
        affected_ids = scenario_params.get('personnel_ids', [])
        
        if scenario_type == 'retirement':
            return self._model_retirement_scenario(personnel_df, affected_ids)
        elif scenario_type == 'redeployment':
            return self._model_redeployment_scenario(personnel_df, scenario_params)
        elif scenario_type == 'emergency_mobilization':
            return self._model_emergency_scenario(personnel_df)
        
        return {'error': 'Unknown scenario type'}
    
    def _create_skill_matrix(self, personnel_df):
        """Create skill matrix for analysis"""
        all_skills = set()
        for skills_str in personnel_df['skills_str'].dropna():
            skills = [s.strip() for s in skills_str.split(',')]
            all_skills.update(skills)
        
        skill_matrix = pd.DataFrame(0, index=personnel_df.index, columns=list(all_skills))
        
        for idx, row in personnel_df.iterrows():
            if pd.notna(row['skills_str']):
                skills = [s.strip() for s in row['skills_str'].split(',')]
                for skill in skills:
                    if skill in skill_matrix.columns:
                        skill_matrix.loc[idx, skill] = 1
        
        return skill_matrix
    
    def _calculate_unit_requirements(self):
        """Calculate skill requirements per unit"""
        return {
            'Fighter Squadron': {'Fighter Aircraft': 20, 'Air Combat': 15, 'Navigation': 10},
            'Transport Squadron': {'Transport Aircraft': 15, 'Logistics': 10, 'Navigation': 8},
            'Technical Wing': {'Aircraft Maintenance': 25, 'Avionics': 15, 'Ground Equipment': 10},
            'Medical Wing': {'Aviation Medicine': 8, 'Emergency Medicine': 6, 'Psychology': 4}
        }
    
    def _identify_skill_gaps(self, skill_matrix, requirements):
        """Identify skill gaps across units"""
        gaps = {}
        for unit, req_skills in requirements.items():
            unit_gaps = {}
            for skill, required_count in req_skills.items():
                if skill in skill_matrix.columns:
                    available_count = skill_matrix[skill].sum()
                    if available_count < required_count:
                        unit_gaps[skill] = required_count - available_count
            if unit_gaps:
                gaps[unit] = unit_gaps
        return gaps
    
    def _identify_skill_surplus(self, skill_matrix, requirements):
        """Identify skill surplus"""
        surplus = {}
        total_required = {}
        for unit_req in requirements.values():
            for skill, count in unit_req.items():
                total_required[skill] = total_required.get(skill, 0) + count
        
        for skill in skill_matrix.columns:
            available = skill_matrix[skill].sum()
            required = total_required.get(skill, 0)
            if available > required:
                surplus[skill] = available - required
        
        return surplus
    
    def _suggest_reallocations(self, personnel_df):
        """Suggest personnel reallocations"""
        suggestions = []
        
        # Find overloaded units
        unit_counts = personnel_df['unit'].value_counts()
        avg_size = unit_counts.mean()
        
        overloaded = unit_counts[unit_counts > avg_size * 1.2]
        underloaded = unit_counts[unit_counts < avg_size * 0.8]
        
        for over_unit in overloaded.index:
            for under_unit in underloaded.index:
                candidates = personnel_df[
                    (personnel_df['unit'] == over_unit) &
                    (personnel_df['readiness_score'] > 75)
                ].head(2)
                
                for _, candidate in candidates.iterrows():
                    suggestions.append({
                        'personnel_id': candidate['id'],
                        'name': candidate['name'],
                        'from_unit': over_unit,
                        'to_unit': under_unit,
                        'reason': 'Load balancing'
                    })
        
        return suggestions[:10]
    
    def _identify_cross_training(self, personnel_df):
        """Identify cross-training opportunities"""
        opportunities = []
        
        # Find personnel with high learning potential
        candidates = personnel_df[
            (personnel_df['leadership_score'] >= 7) &
            (personnel_df['engagement_score'] >= 75) &
            (personnel_df['years_of_service'] >= 3) &
            (personnel_df['years_of_service'] <= 15)
        ]
        
        skill_recommendations = {
            'Flying': ['Cyber Security', 'Advanced Avionics', 'Leadership Development'],
            'Technical': ['Project Management', 'Quality Assurance', 'Training'],
            'Ground Duty': ['Data Analytics', 'Strategic Planning', 'Communication'],
            'Medical': ['Emergency Response', 'Stress Management', 'Research'],
            'Education': ['Digital Learning', 'Curriculum Development', 'Assessment']
        }
        
        for _, person in candidates.head(20).iterrows():
            branch = person['branch']
            recommended_skills = skill_recommendations.get(branch, ['Leadership Development'])
            
            opportunities.append({
                'personnel_id': person['id'],
                'name': person['name'],
                'current_branch': branch,
                'recommended_skills': recommended_skills[:2],
                'priority': 'High' if person['leadership_potential'] == 'high' else 'Medium'
            })
        
        return opportunities
    
    def _model_retirement_scenario(self, personnel_df, retiring_ids):
        """Model retirement scenario impact"""
        retiring_personnel = personnel_df[personnel_df['id'].isin(retiring_ids)]
        
        impact = {
            'personnel_lost': len(retiring_personnel),
            'experience_lost': retiring_personnel['years_of_service'].sum(),
            'skill_impact': self._calculate_skill_loss(retiring_personnel),
            'unit_impact': retiring_personnel['unit'].value_counts().to_dict(),
            'readiness_impact': -retiring_personnel['readiness_score'].mean() * 0.1,
            'mitigation_strategies': [
                'Accelerate promotion pipeline',
                'Implement knowledge transfer programs',
                'Recruit external talent',
                'Cross-train existing personnel'
            ]
        }
        
        return impact
    
    def _calculate_skill_loss(self, retiring_personnel):
        """Calculate skill loss from retirements"""
        skill_loss = {}
        for _, person in retiring_personnel.iterrows():
            if pd.notna(person['skills_str']):
                skills = [s.strip() for s in person['skills_str'].split(',')]
                for skill in skills:
                    skill_loss[skill] = skill_loss.get(skill, 0) + 1
        return skill_loss

def main():
    """Test advanced analytics"""
    print("Testing Advanced Analytics...")
    
    analytics = AdvancedAnalytics()
    
    # Load sample data
    try:
        df = pd.read_csv('personnel_data.csv')
        
        # Test workforce optimization
        optimization = analytics.workforce_optimization(df)
        print(f"Skill gaps identified: {len(optimization['skill_gaps'])}")
        
        # Test anomaly detection
        anomalies = analytics.anomaly_detection(df)
        print(f"Anomalies detected: {anomalies['anomalous_records']}")
        
        print("✅ Advanced analytics models ready!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()