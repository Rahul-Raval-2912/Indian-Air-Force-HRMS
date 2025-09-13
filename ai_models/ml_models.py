import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import json

class IAFMLModels:
    def __init__(self):
        self.attrition_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.readiness_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.leadership_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.encoders = {}
        
    def prepare_features(self, df):
        # Create feature matrix
        features = []
        
        # Encode categorical variables
        for col in ['rank', 'unit']:
            if col not in self.encoders:
                self.encoders[col] = LabelEncoder()
                df[f'{col}_encoded'] = self.encoders[col].fit_transform(df[col])
            else:
                df[f'{col}_encoded'] = self.encoders[col].transform(df[col])
        
        # Select numerical features
        feature_cols = [
            'years_of_service', 'age', 'fitness_score', 'stress_index',
            'missions_participated', 'mission_success_rate', 'peer_review_score',
            'leadership_score', 'leave_records', 'disciplinary_actions',
            'complaints', 'engagement_score', 'rank_encoded', 'unit_encoded'
        ]
        
        return df[feature_cols]
    
    def train_models(self, data_path='personnel_data.csv'):
        df = pd.read_csv(data_path)
        
        # Prepare features
        X = self.prepare_features(df)
        
        # Train attrition model
        y_attrition = df['attrition_risk']
        X_train, X_test, y_train, y_test = train_test_split(X, y_attrition, test_size=0.2, random_state=42)
        self.attrition_model.fit(X_train, y_train)
        
        # Train readiness model - use same split
        y_readiness = df['readiness_score']
        _, _, y_readiness_train, _ = train_test_split(X, y_readiness, test_size=0.2, random_state=42)
        self.readiness_model.fit(X_train, y_readiness_train)
        
        # Train leadership model - use same split
        if 'leadership_potential' not in self.encoders:
            self.encoders['leadership_potential'] = LabelEncoder()
        y_leadership = self.encoders['leadership_potential'].fit_transform(df['leadership_potential'])
        _, _, y_leadership_train, _ = train_test_split(X, y_leadership, test_size=0.2, random_state=42)
        self.leadership_model.fit(X_train, y_leadership_train)
        
        # Save models
        joblib.dump(self.attrition_model, 'attrition_model.pkl')
        joblib.dump(self.readiness_model, 'readiness_model.pkl')
        joblib.dump(self.leadership_model, 'leadership_model.pkl')
        joblib.dump(self.encoders, 'encoders.pkl')
        
        print("Models trained and saved successfully")
        
    def load_models(self):
        try:
            self.attrition_model = joblib.load('attrition_model.pkl')
            self.readiness_model = joblib.load('readiness_model.pkl')
            self.leadership_model = joblib.load('leadership_model.pkl')
            self.encoders = joblib.load('encoders.pkl')
            return True
        except:
            return False
    
    def predict_attrition_risk(self, personnel_data):
        df = pd.DataFrame([personnel_data])
        X = self.prepare_features(df)
        return self.attrition_model.predict_proba(X)[0][1]
    
    def predict_readiness(self, personnel_data):
        df = pd.DataFrame([personnel_data])
        X = self.prepare_features(df)
        return self.readiness_model.predict(X)[0]
    
    def predict_leadership_potential(self, personnel_data):
        df = pd.DataFrame([personnel_data])
        X = self.prepare_features(df)
        pred = self.leadership_model.predict(X)[0]
        return self.encoders['leadership_potential'].inverse_transform([pred])[0]
    
    def get_skill_recommendations(self, unit, required_skills):
        # Mock recommendation system
        recommendations = [
            {"id": "IAF_001234", "name": "Officer_1234", "match_score": 0.95},
            {"id": "IAF_005678", "name": "Officer_5678", "match_score": 0.87}
        ]
        return recommendations

if __name__ == "__main__":
    models = IAFMLModels()
    models.train_models()
