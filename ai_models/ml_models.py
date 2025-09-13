import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class IAFMLModels:
    def __init__(self):
        self.models = {}
        self.encoders = {}
        self.scalers = {}
        
    def load_data(self):
        """Load personnel data"""
        try:
            self.df = pd.read_csv('personnel_data.csv')
            print(f"Loaded {len(self.df)} personnel records")
            return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def preprocess_data(self):
        """Preprocess data for ML models"""
        # Handle missing values
        self.df = self.df.fillna(0)
        
        # Create feature encoders
        categorical_cols = ['rank', 'branch', 'unit', 'gender', 'family_status', 
                           'education_level', 'deployment_status', 'security_clearance', 
                           'performance_rating', 'leadership_potential']
        
        for col in categorical_cols:
            if col in self.df.columns:
                le = LabelEncoder()
                self.df[f'{col}_encoded'] = le.fit_transform(self.df[col].astype(str))
                self.encoders[col] = le
        
        # Create numerical features
        feature_cols = ['age', 'years_of_service', 'fitness_score', 'stress_index',
                       'missions_participated', 'mission_success_rate', 'peer_review_score',
                       'leadership_score', 'engagement_score', 'leave_records',
                       'disciplinary_actions', 'complaints', 'salary_grade']
        
        # Add encoded categorical features
        encoded_cols = [f'{col}_encoded' for col in categorical_cols if f'{col}_encoded' in self.df.columns]
        self.feature_cols = feature_cols + encoded_cols
        
        # Scale features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.df[self.feature_cols])
        self.scalers['main'] = self.scaler
        
    def train_attrition_model(self):
        """Train attrition risk prediction model"""
        print("Training attrition prediction model...")
        
        X = self.X_scaled
        y = self.df['attrition_risk']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Attrition model accuracy: {accuracy:.3f}")
        
        self.models['attrition'] = model
        joblib.dump(model, 'attrition_model.pkl')
        
    def train_readiness_model(self):
        """Train readiness score prediction model"""
        print("Training readiness prediction model...")
        
        X = self.X_scaled
        y = self.df['readiness_score']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        print(f"Readiness model MSE: {mse:.3f}")
        
        self.models['readiness'] = model
        joblib.dump(model, 'readiness_model.pkl')
        
    def train_leadership_model(self):
        """Train leadership potential classification model"""
        print("Training leadership potential model...")
        
        X = self.X_scaled
        y = self.df['leadership_potential']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Leadership model accuracy: {accuracy:.3f}")
        
        self.models['leadership'] = model
        joblib.dump(model, 'leadership_model.pkl')
        
    def train_skill_clustering(self):
        """Train skill clustering model"""
        print("Training skill clustering model...")
        
        # Create skill-based features
        skill_features = []
        for idx, row in self.df.iterrows():
            skills = row['skills_str'].split(',') if pd.notna(row['skills_str']) else []
            skill_vector = [1 if skill.strip() in skills else 0 for skill in [
                'Fighter Aircraft', 'Transport Aircraft', 'Helicopter Operations',
                'Aircraft Maintenance', 'Avionics', 'Radar Systems',
                'Administration', 'Logistics', 'Intelligence',
                'Aviation Medicine', 'Emergency Medicine', 'Training'
            ]]
            skill_features.append(skill_vector)
        
        skill_array = np.array(skill_features)
        
        model = KMeans(n_clusters=5, random_state=42)
        clusters = model.fit_predict(skill_array)
        
        self.df['skill_cluster'] = clusters
        self.models['skill_clustering'] = model
        joblib.dump(model, 'skill_clustering_model.pkl')
        
    def train_career_progression_model(self):
        """Train career progression prediction model"""
        print("Training career progression model...")
        
        # Create promotion timeline features
        rank_hierarchy = {
            'Pilot Officer': 1, 'Flying Officer': 2, 'Flight Lieutenant': 3,
            'Squadron Leader': 4, 'Wing Commander': 5, 'Group Captain': 6,
            'Air Commodore': 7, 'Air Vice Marshal': 8, 'Air Marshal': 9,
            'Air Chief Marshal': 10
        }
        
        self.df['rank_level'] = self.df['rank'].map(rank_hierarchy)
        
        # Predict next promotion timeline
        X = self.X_scaled
        y = self.df['rank_level']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        self.models['career_progression'] = model
        joblib.dump(model, 'career_progression_model.pkl')
        
    def train_mission_readiness_model(self):
        """Train mission readiness prediction model"""
        print("Training mission readiness model...")
        
        # Create mission readiness score based on multiple factors
        mission_readiness = (
            self.df['fitness_score'] * 0.3 +
            (100 - self.df['stress_index']) * 0.2 +
            self.df['mission_success_rate'] * 100 * 0.25 +
            self.df['engagement_score'] * 0.15 +
            self.df['leadership_score'] * 10 * 0.1
        )
        
        X = self.X_scaled
        y = mission_readiness
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        self.models['mission_readiness'] = model
        joblib.dump(model, 'mission_readiness_model.pkl')
        
    def train_training_needs_model(self):
        """Train training needs prediction model"""
        print("Training training needs model...")
        
        # Create training priority score
        training_priority = np.where(
            (self.df['readiness_score'] < 75) | 
            (self.df['fitness_score'] < 70) |
            (self.df['stress_index'] > 60), 1, 0
        )
        
        X = self.X_scaled
        y = training_priority
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        self.models['training_needs'] = model
        joblib.dump(model, 'training_needs_model.pkl')
        
    def save_encoders(self):
        """Save all encoders and scalers"""
        joblib.dump(self.encoders, 'encoders.pkl')
        joblib.dump(self.scalers, 'scalers.pkl')
        
    def load_models(self):
        """Load pre-trained models"""
        model_files = {
            'attrition': 'attrition_model.pkl',
            'readiness': 'readiness_model.pkl',
            'leadership': 'leadership_model.pkl',
            'skill_clustering': 'skill_clustering_model.pkl',
            'career_progression': 'career_progression_model.pkl',
            'mission_readiness': 'mission_readiness_model.pkl',
            'training_needs': 'training_needs_model.pkl'
        }
        
        for name, file in model_files.items():
            if os.path.exists(file):
                self.models[name] = joblib.load(file)
        
        if os.path.exists('encoders.pkl'):
            self.encoders = joblib.load('encoders.pkl')
        if os.path.exists('scalers.pkl'):
            self.scalers = joblib.load('scalers.pkl')
            
    def predict_attrition_risk(self, personnel_data):
        """Predict attrition risk for personnel"""
        if 'attrition' not in self.models:
            return 0.5
        
        # Process input data
        features = self._prepare_features(personnel_data)
        prediction = self.models['attrition'].predict_proba([features])[0][1]
        return prediction
        
    def predict_readiness(self, personnel_data):
        """Predict readiness score for personnel"""
        if 'readiness' not in self.models:
            return 75.0
        
        features = self._prepare_features(personnel_data)
        prediction = self.models['readiness'].predict([features])[0]
        return max(0, min(100, prediction))
        
    def predict_leadership_potential(self, personnel_data):
        """Predict leadership potential"""
        if 'leadership' not in self.models:
            return 'medium'
        
        features = self._prepare_features(personnel_data)
        prediction = self.models['leadership'].predict([features])[0]
        return prediction
        
    def get_skill_recommendations(self, unit, current_skills):
        """Get skill recommendations for unit"""
        recommendations = [
            {'skill': 'Cyber Security', 'priority': 'High', 'description': 'Critical for modern operations'},
            {'skill': 'Advanced Avionics', 'priority': 'Medium', 'description': 'Technology upgrade needed'},
            {'skill': 'Leadership Development', 'priority': 'High', 'description': 'Succession planning'}
        ]
        return recommendations
        
    def _prepare_features(self, personnel_data):
        """Prepare features for prediction"""
        # Default feature vector
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
        
        # Add encoded categorical features (simplified)
        features.extend([1, 2, 3, 1, 2, 1, 2, 1, 3, 2])  # Placeholder encoded values
        
        return features

def main():
    """Main training function"""
    print("Starting IAF ML Models Training...")
    
    ml_models = IAFMLModels()
    
    # Load and preprocess data
    if not ml_models.load_data():
        print("Failed to load data")
        return
    
    ml_models.preprocess_data()
    
    # Train all models
    ml_models.train_attrition_model()
    ml_models.train_readiness_model()
    ml_models.train_leadership_model()
    ml_models.train_skill_clustering()
    ml_models.train_career_progression_model()
    ml_models.train_mission_readiness_model()
    ml_models.train_training_needs_model()
    
    # Save encoders and scalers
    ml_models.save_encoders()
    
    print("\nAll ML models trained and saved successfully!")
    print("Models available:")
    for model_name in ml_models.models.keys():
        print(f"  - {model_name}")

if __name__ == "__main__":
    main()