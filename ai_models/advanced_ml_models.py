import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import LabelEncoder, StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
from sklearn.feature_selection import SelectKBest, f_classif
import xgboost as xgb
import joblib
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class AdvancedIAFMLModels:
    def __init__(self):
        self.models = {}
        self.encoders = {}
        self.scalers = {}
        self.feature_selectors = {}
        
    def load_data(self):
        """Load personnel data"""
        try:
            self.df = pd.read_csv('personnel_data.csv')
            print(f"Loaded {len(self.df)} personnel records")
            return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def advanced_feature_engineering(self):
        """Advanced feature engineering for better predictions"""
        # Handle missing values intelligently
        self.df = self.df.fillna(method='ffill').fillna(0)
        
        # Encode categorical features first
        categorical_cols = ['rank', 'branch', 'unit', 'gender', 'family_status', 
                           'education_level', 'deployment_status', 'security_clearance', 
                           'performance_rating', 'leadership_potential']
        
        for col in categorical_cols:
            if col in self.df.columns:
                le = LabelEncoder()
                self.df[f'{col}_encoded'] = le.fit_transform(self.df[col].astype(str))
                self.encoders[col] = le
        
        # Create advanced features
        self.df['service_efficiency'] = self.df['missions_participated'] / (self.df['years_of_service'] + 1)
        self.df['stress_fitness_ratio'] = self.df['stress_index'] / (self.df['fitness_score'] + 1)
        self.df['leadership_engagement'] = self.df['leadership_score'] * self.df['engagement_score'] / 100
        self.df['performance_consistency'] = self.df['peer_review_score'] * self.df['mission_success_rate']
        self.df['career_velocity'] = self.df['rank_encoded'] / (self.df['years_of_service'] + 1)
        
        # Age groups for better categorization
        self.df['age_group'] = pd.cut(self.df['age'], bins=[0, 25, 35, 45, 60], labels=['Young', 'Mid', 'Senior', 'Veteran'])
        
        # Service tenure categories
        self.df['service_category'] = pd.cut(self.df['years_of_service'], 
                                           bins=[0, 5, 15, 25, 40], 
                                           labels=['New', 'Experienced', 'Veteran', 'Senior'])
        
        # Add age and service category encodings
        for col in ['age_group', 'service_category']:
            if col in self.df.columns:
                le = LabelEncoder()
                self.df[f'{col}_encoded'] = le.fit_transform(self.df[col].astype(str))
                self.encoders[col] = le
        
        # Feature selection
        self.feature_cols = [
            'age', 'years_of_service', 'fitness_score', 'stress_index',
            'missions_participated', 'mission_success_rate', 'peer_review_score',
            'leadership_score', 'engagement_score', 'leave_records',
            'disciplinary_actions', 'complaints', 'salary_grade',
            'service_efficiency', 'stress_fitness_ratio', 'leadership_engagement',
            'performance_consistency', 'career_velocity'
        ]
        
        # Add encoded features
        encoded_cols = [f'{col}_encoded' for col in categorical_cols if f'{col}_encoded' in self.df.columns]
        self.feature_cols.extend(encoded_cols)
        
        # Scale features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.df[self.feature_cols])
        self.scalers['main'] = self.scaler
        
    def train_advanced_attrition_model(self):
        """Train advanced attrition prediction with ensemble methods"""
        print("Training advanced attrition prediction model...")
        
        X = self.X_scaled
        y = self.df['attrition_risk']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Ensemble of models
        models = {
            'rf': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
            'xgb': xgb.XGBClassifier(n_estimators=200, max_depth=6, random_state=42),
            'gb': GradientBoostingClassifier(n_estimators=100, random_state=42),
            'mlp': MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
        }
        
        best_model = None
        best_score = 0
        
        for name, model in models.items():
            model.fit(X_train, y_train)
            score = model.score(X_test, y_test)
            print(f"{name.upper()} Attrition Accuracy: {score:.4f}")
            
            if score > best_score:
                best_score = score
                best_model = model
        
        self.models['attrition'] = best_model
        joblib.dump(best_model, 'advanced_attrition_model.pkl')
        
        # Feature importance
        if hasattr(best_model, 'feature_importances_'):
            importance_df = pd.DataFrame({
                'feature': self.feature_cols,
                'importance': best_model.feature_importances_
            }).sort_values('importance', ascending=False)
            print("Top 5 Attrition Risk Features:")
            print(importance_df.head())
        
    def train_readiness_prediction_model(self):
        """Train advanced readiness prediction model"""
        print("Training advanced readiness prediction model...")
        
        X = self.X_scaled
        y = self.df['readiness_score']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Advanced regression models
        models = {
            'rf': RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42),
            'xgb': xgb.XGBRegressor(n_estimators=200, max_depth=6, random_state=42),
            'mlp': MLPRegressor(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
        }
        
        best_model = None
        best_r2 = -1
        
        for name, model in models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            r2 = r2_score(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            print(f"{name.upper()} Readiness R²: {r2:.4f}, MSE: {mse:.4f}")
            
            if r2 > best_r2:
                best_r2 = r2
                best_model = model
        
        self.models['readiness'] = best_model
        joblib.dump(best_model, 'advanced_readiness_model.pkl')
        
    def train_leadership_assessment_model(self):
        """Train advanced leadership potential assessment"""
        print("Training advanced leadership assessment model...")
        
        X = self.X_scaled
        y = self.df['leadership_potential']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Grid search for best parameters
        param_grid = {
            'n_estimators': [100, 200],
            'max_depth': [8, 10, 12],
            'min_samples_split': [2, 5]
        }
        
        rf = RandomForestClassifier(random_state=42)
        grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy')
        grid_search.fit(X_train, y_train)
        
        best_model = grid_search.best_estimator_
        accuracy = best_model.score(X_test, y_test)
        print(f"Leadership Assessment Accuracy: {accuracy:.4f}")
        print(f"Best Parameters: {grid_search.best_params_}")
        
        self.models['leadership'] = best_model
        joblib.dump(best_model, 'advanced_leadership_model.pkl')
        
    def train_career_trajectory_model(self):
        """Train career trajectory prediction model"""
        print("Training career trajectory model...")
        
        # Create promotion timeline prediction
        rank_hierarchy = {
            'Pilot Officer': 1, 'Flying Officer': 2, 'Flight Lieutenant': 3,
            'Squadron Leader': 4, 'Wing Commander': 5, 'Group Captain': 6,
            'Air Commodore': 7, 'Air Vice Marshal': 8, 'Air Marshal': 9,
            'Air Chief Marshal': 10
        }
        
        self.df['rank_level'] = self.df['rank'].map(rank_hierarchy)
        self.df['promotion_potential'] = (
            self.df['leadership_score'] * 0.3 +
            self.df['performance_consistency'] * 0.25 +
            self.df['engagement_score'] * 0.2 +
            (100 - self.df['stress_index']) * 0.15 +
            self.df['fitness_score'] * 0.1
        ) / 100
        
        X = self.X_scaled
        y = self.df['promotion_potential']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = xgb.XGBRegressor(n_estimators=200, max_depth=8, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        print(f"Career Trajectory R²: {r2:.4f}")
        
        self.models['career_trajectory'] = model
        joblib.dump(model, 'career_trajectory_model.pkl')
        
    def train_mission_optimization_model(self):
        """Train mission assignment optimization model"""
        print("Training mission optimization model...")
        
        # Create mission suitability score
        self.df['mission_suitability'] = (
            self.df['fitness_score'] * 0.25 +
            (100 - self.df['stress_index']) * 0.2 +
            self.df['mission_success_rate'] * 100 * 0.3 +
            self.df['readiness_score'] * 0.15 +
            self.df['leadership_score'] * 10 * 0.1
        )
        
        X = self.X_scaled
        y = self.df['mission_suitability']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        print(f"Mission Optimization R²: {r2:.4f}")
        
        self.models['mission_optimization'] = model
        joblib.dump(model, 'mission_optimization_model.pkl')
        
    def train_wellness_prediction_model(self):
        """Train personnel wellness prediction model"""
        print("Training wellness prediction model...")
        
        # Create wellness risk score
        wellness_risk = np.where(
            (self.df['stress_index'] > 70) | 
            (self.df['fitness_score'] < 60) |
            (self.df['engagement_score'] < 50), 1, 0
        )
        
        X = self.X_scaled
        y = wellness_risk
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        model = GradientBoostingClassifier(n_estimators=150, random_state=42)
        model.fit(X_train, y_train)
        
        accuracy = model.score(X_test, y_test)
        print(f"Wellness Prediction Accuracy: {accuracy:.4f}")
        
        self.models['wellness'] = model
        joblib.dump(model, 'wellness_model.pkl')
        
    def train_skill_gap_analysis_model(self):
        """Train skill gap analysis and recommendation model"""
        print("Training skill gap analysis model...")
        
        # Advanced skill clustering
        skill_features = []
        all_skills = ['Fighter Aircraft', 'Transport Aircraft', 'Helicopter Operations',
                     'Aircraft Maintenance', 'Avionics', 'Radar Systems', 'Cyber Security',
                     'Administration', 'Logistics', 'Intelligence', 'Aviation Medicine', 
                     'Emergency Medicine', 'Training', 'Leadership', 'Strategic Planning']
        
        for idx, row in self.df.iterrows():
            skills = row['skills_str'].split(',') if pd.notna(row['skills_str']) else []
            skill_vector = [1 if skill.strip() in skills else 0 for skill in all_skills]
            skill_features.append(skill_vector)
        
        skill_array = np.array(skill_features)
        
        # Use DBSCAN for better clustering
        dbscan = DBSCAN(eps=0.5, min_samples=5)
        clusters = dbscan.fit_predict(skill_array)
        
        self.df['skill_cluster'] = clusters
        self.models['skill_clustering'] = dbscan
        joblib.dump(dbscan, 'advanced_skill_clustering_model.pkl')
        
    def get_personnel_insights(self, personnel_id):
        """Get comprehensive insights for a personnel"""
        if personnel_id not in self.df['personnel_id'].values:
            return None
            
        person = self.df[self.df['personnel_id'] == personnel_id].iloc[0]
        features = self._prepare_features(person.to_dict())
        
        insights = {
            'attrition_risk': self.predict_attrition_risk(person.to_dict()),
            'readiness_score': self.predict_readiness(person.to_dict()),
            'leadership_potential': self.predict_leadership_potential(person.to_dict()),
            'career_trajectory': self.predict_career_trajectory(person.to_dict()),
            'mission_suitability': self.predict_mission_suitability(person.to_dict()),
            'wellness_risk': self.predict_wellness_risk(person.to_dict()),
            'recommended_training': self.get_training_recommendations(person.to_dict()),
            'skill_gaps': self.identify_skill_gaps(person.to_dict())
        }
        
        return insights
        
    def predict_attrition_risk(self, personnel_data):
        """Enhanced attrition risk prediction"""
        if 'attrition' not in self.models:
            return 0.3
        
        features = self._prepare_features(personnel_data)
        prediction = self.models['attrition'].predict_proba([features])[0][1]
        
        # Risk categorization
        if prediction < 0.3:
            risk_level = "Low"
        elif prediction < 0.6:
            risk_level = "Medium"
        else:
            risk_level = "High"
            
        return {
            'probability': float(prediction),
            'risk_level': risk_level,
            'factors': self._get_attrition_factors(personnel_data)
        }
        
    def predict_readiness(self, personnel_data):
        """Enhanced readiness prediction"""
        if 'readiness' not in self.models:
            return 75.0
        
        features = self._prepare_features(personnel_data)
        prediction = self.models['readiness'].predict([features])[0]
        score = max(0, min(100, prediction))
        
        return {
            'score': float(score),
            'category': 'Excellent' if score > 85 else 'Good' if score > 70 else 'Needs Improvement',
            'recommendations': self._get_readiness_recommendations(score)
        }
        
    def predict_leadership_potential(self, personnel_data):
        """Enhanced leadership potential prediction"""
        if 'leadership' not in self.models:
            return 'medium'
        
        features = self._prepare_features(personnel_data)
        prediction = self.models['leadership'].predict([features])[0]
        
        return {
            'level': prediction,
            'development_areas': self._get_leadership_development_areas(personnel_data),
            'timeline': self._estimate_leadership_timeline(personnel_data)
        }
        
    def predict_career_trajectory(self, personnel_data):
        """Predict career advancement trajectory"""
        if 'career_trajectory' not in self.models:
            return {'next_promotion': '2-3 years', 'potential_rank': 'Next Level'}
        
        features = self._prepare_features(personnel_data)
        score = self.models['career_trajectory'].predict([features])[0]
        
        current_rank = personnel_data.get('rank', 'Flight Lieutenant')
        years_service = personnel_data.get('years_of_service', 5)
        
        return {
            'promotion_score': float(score),
            'estimated_timeline': self._calculate_promotion_timeline(score, years_service),
            'development_needs': self._get_career_development_needs(personnel_data)
        }
        
    def predict_mission_suitability(self, personnel_data):
        """Predict mission assignment suitability"""
        if 'mission_optimization' not in self.models:
            return {'score': 75, 'suitable_missions': ['Training', 'Support']}
        
        features = self._prepare_features(personnel_data)
        score = self.models['mission_optimization'].predict([features])[0]
        
        return {
            'suitability_score': float(score),
            'recommended_missions': self._get_mission_recommendations(score, personnel_data),
            'readiness_factors': self._analyze_mission_readiness(personnel_data)
        }
        
    def predict_wellness_risk(self, personnel_data):
        """Predict wellness and mental health risks"""
        if 'wellness' not in self.models:
            return {'risk': 'Low', 'recommendations': []}
        
        features = self._prepare_features(personnel_data)
        risk_prob = self.models['wellness'].predict_proba([features])[0][1]
        
        risk_level = 'High' if risk_prob > 0.7 else 'Medium' if risk_prob > 0.4 else 'Low'
        
        return {
            'risk_probability': float(risk_prob),
            'risk_level': risk_level,
            'wellness_recommendations': self._get_wellness_recommendations(risk_level, personnel_data)
        }
        
    def get_training_recommendations(self, personnel_data):
        """Get personalized training recommendations"""
        recommendations = []
        
        fitness_score = personnel_data.get('fitness_score', 75)
        stress_index = personnel_data.get('stress_index', 40)
        leadership_score = personnel_data.get('leadership_score', 6)
        
        if fitness_score < 70:
            recommendations.append({
                'type': 'Physical Fitness',
                'priority': 'High',
                'description': 'Intensive fitness program required'
            })
            
        if stress_index > 60:
            recommendations.append({
                'type': 'Stress Management',
                'priority': 'High',
                'description': 'Stress reduction and coping strategies'
            })
            
        if leadership_score < 7:
            recommendations.append({
                'type': 'Leadership Development',
                'priority': 'Medium',
                'description': 'Leadership skills enhancement program'
            })
            
        return recommendations
        
    def identify_skill_gaps(self, personnel_data):
        """Identify skill gaps and development opportunities"""
        current_skills = personnel_data.get('skills_str', '').split(',')
        rank = personnel_data.get('rank', 'Flight Lieutenant')
        
        required_skills = self._get_required_skills_by_rank(rank)
        missing_skills = [skill for skill in required_skills if skill not in current_skills]
        
        return {
            'missing_skills': missing_skills,
            'development_priority': self._prioritize_skill_development(missing_skills, rank),
            'training_programs': self._suggest_training_programs(missing_skills)
        }
        
    def save_encoders(self):
        """Save all encoders and scalers"""
        joblib.dump(self.encoders, 'encoders.pkl')
        joblib.dump(self.scalers, 'scalers.pkl')
        
    def _prepare_features(self, personnel_data):
        """Prepare features for prediction with advanced engineering"""
        # Base features
        features = [
            personnel_data.get('age', 30),
            personnel_data.get('years_of_service', 5),
            personnel_data.get('fitness_score', 75),
            personnel_data.get('stress_index', 40),
            personnel_data.get('missions_participated', 20),
            personnel_data.get('mission_success_rate', 0.9),
            personnel_data.get('peer_review_score', 7),
            personnel_data.get('leadership_score', 6),
            personnel_data.get('engagement_score', 75),
            personnel_data.get('leave_records', 30),
            personnel_data.get('disciplinary_actions', 0),
            personnel_data.get('complaints', 0),
            personnel_data.get('salary_grade', 5)
        ]
        
        # Advanced engineered features
        years_service = personnel_data.get('years_of_service', 5)
        missions = personnel_data.get('missions_participated', 20)
        fitness = personnel_data.get('fitness_score', 75)
        stress = personnel_data.get('stress_index', 40)
        leadership = personnel_data.get('leadership_score', 6)
        engagement = personnel_data.get('engagement_score', 75)
        
        features.extend([
            missions / (years_service + 1),  # service_efficiency
            stress / (fitness + 1),  # stress_fitness_ratio
            leadership * engagement / 100,  # leadership_engagement
            personnel_data.get('peer_review_score', 7) * personnel_data.get('mission_success_rate', 0.9),  # performance_consistency
            1 / (years_service + 1)  # career_velocity (simplified)
        ])
        
        # Add encoded categorical features (simplified for prediction)
        features.extend([1, 2, 3, 1, 2, 1, 2, 1, 3, 2, 1, 2])
        
        return features
        
    def _get_attrition_factors(self, personnel_data):
        """Identify key attrition risk factors"""
        factors = []
        
        if personnel_data.get('stress_index', 0) > 70:
            factors.append('High stress levels')
        if personnel_data.get('engagement_score', 100) < 50:
            factors.append('Low engagement')
        if personnel_data.get('years_of_service', 0) > 20:
            factors.append('Long service tenure')
            
        return factors
        
    def _get_readiness_recommendations(self, score):
        """Get readiness improvement recommendations"""
        if score < 60:
            return ['Intensive training required', 'Medical evaluation', 'Stress assessment']
        elif score < 80:
            return ['Additional training', 'Fitness improvement', 'Skill development']
        else:
            return ['Maintain current standards', 'Advanced training opportunities']
            
    def _get_leadership_development_areas(self, personnel_data):
        """Identify leadership development areas"""
        areas = []
        
        if personnel_data.get('peer_review_score', 10) < 7:
            areas.append('Team collaboration')
        if personnel_data.get('mission_success_rate', 1) < 0.8:
            areas.append('Decision making under pressure')
            
        return areas
        
    def _estimate_leadership_timeline(self, personnel_data):
        """Estimate leadership development timeline"""
        current_score = personnel_data.get('leadership_score', 5)
        
        if current_score >= 8:
            return '6-12 months'
        elif current_score >= 6:
            return '1-2 years'
        else:
            return '2-3 years'
            
    def _calculate_promotion_timeline(self, score, years_service):
        """Calculate estimated promotion timeline"""
        if score > 0.8 and years_service >= 3:
            return '1-2 years'
        elif score > 0.6:
            return '2-4 years'
        else:
            return '4+ years'
            
    def _get_career_development_needs(self, personnel_data):
        """Identify career development needs"""
        needs = []
        
        if personnel_data.get('leadership_score', 5) < 7:
            needs.append('Leadership training')
        if personnel_data.get('engagement_score', 100) < 70:
            needs.append('Motivation enhancement')
            
        return needs
        
    def _get_mission_recommendations(self, score, personnel_data):
        """Get mission assignment recommendations"""
        if score > 80:
            return ['Combat missions', 'Leadership roles', 'Critical operations']
        elif score > 60:
            return ['Support missions', 'Training roles', 'Administrative tasks']
        else:
            return ['Ground duties', 'Training programs', 'Administrative support']
            
    def _analyze_mission_readiness(self, personnel_data):
        """Analyze mission readiness factors"""
        factors = {
            'physical': personnel_data.get('fitness_score', 75),
            'mental': 100 - personnel_data.get('stress_index', 40),
            'experience': min(100, personnel_data.get('missions_participated', 0) * 5),
            'leadership': personnel_data.get('leadership_score', 5) * 10
        }
        
        return factors
        
    def _get_wellness_recommendations(self, risk_level, personnel_data):
        """Get wellness recommendations based on risk level"""
        if risk_level == 'High':
            return ['Immediate counseling', 'Stress management program', 'Workload adjustment']
        elif risk_level == 'Medium':
            return ['Regular check-ins', 'Wellness activities', 'Work-life balance']
        else:
            return ['Maintain current wellness practices', 'Preventive care']
            
    def _get_required_skills_by_rank(self, rank):
        """Get required skills by rank"""
        skill_requirements = {
            'Pilot Officer': ['Basic Flying', 'Safety Protocols'],
            'Flying Officer': ['Advanced Flying', 'Navigation', 'Communication'],
            'Flight Lieutenant': ['Leadership', 'Mission Planning', 'Team Management'],
            'Squadron Leader': ['Strategic Planning', 'Advanced Leadership', 'Training'],
            'Wing Commander': ['Operations Management', 'Strategic Leadership', 'Policy Development']
        }
        
        return skill_requirements.get(rank, ['Leadership', 'Technical Skills'])
        
    def _prioritize_skill_development(self, missing_skills, rank):
        """Prioritize skill development based on rank and career stage"""
        priority_map = {
            'Leadership': 'High',
            'Strategic Planning': 'High',
            'Technical Skills': 'Medium',
            'Communication': 'Medium'
        }
        
        return [(skill, priority_map.get(skill, 'Low')) for skill in missing_skills]
        
    def _suggest_training_programs(self, missing_skills):
        """Suggest specific training programs for missing skills"""
        program_map = {
            'Leadership': 'Advanced Leadership Development Program',
            'Strategic Planning': 'Strategic Management Course',
            'Technical Skills': 'Technical Certification Program',
            'Communication': 'Effective Communication Workshop'
        }
        
        return [program_map.get(skill, f'{skill} Training Program') for skill in missing_skills]

def main():
    """Main training function for advanced models"""
    print("Starting Advanced IAF ML Models Training...")
    
    ml_models = AdvancedIAFMLModels()
    
    if not ml_models.load_data():
        print("Failed to load data")
        return
    
    ml_models.advanced_feature_engineering()
    
    # Train all advanced models
    ml_models.train_advanced_attrition_model()
    ml_models.train_readiness_prediction_model()
    ml_models.train_leadership_assessment_model()
    ml_models.train_career_trajectory_model()
    ml_models.train_mission_optimization_model()
    ml_models.train_wellness_prediction_model()
    ml_models.train_skill_gap_analysis_model()
    
    print("\nAll advanced ML models trained successfully!")
    print("Available models:")
    for model_name in ml_models.models.keys():
        print(f"  - {model_name}")

if __name__ == "__main__":
    main()