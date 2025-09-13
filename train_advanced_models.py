#!/usr/bin/env python3
"""
Advanced ML Model Training Script for IAF Human Management System
Trains all machine learning models with enhanced features and performance optimization
"""

import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Add ai_models to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai_models'))

from advanced_ml_models import AdvancedIAFMLModels

def main():
    """Main function to train all advanced ML models"""
    print("=" * 60)
    print("IAF ADVANCED ML MODELS TRAINING")
    print("=" * 60)
    print(f"Training started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check if data file exists
    if not os.path.exists('personnel_data.csv'):
        print("❌ Error: personnel_data.csv not found!")
        print("Please run 'python generate_data.py' first to generate the dataset.")
        return False
    
    # Initialize advanced ML models
    print("[*] Initializing Advanced ML Models...")
    ml_models = AdvancedIAFMLModels()
    
    # Load and preprocess data
    print("[*] Loading personnel data...")
    if not ml_models.load_data():
        print("[ERROR] Failed to load data")
        return False
    
    print("[*] Performing advanced feature engineering...")
    ml_models.advanced_feature_engineering()
    
    print(f"[SUCCESS] Data loaded successfully: {len(ml_models.df)} personnel records")
    print(f"[SUCCESS] Features engineered: {len(ml_models.feature_cols)} features")
    print()
    
    # Train all models
    models_to_train = [
        ("Advanced Attrition Prediction", ml_models.train_advanced_attrition_model),
        ("Readiness Assessment", ml_models.train_readiness_prediction_model),
        ("Leadership Evaluation", ml_models.train_leadership_assessment_model),
        ("Career Trajectory", ml_models.train_career_trajectory_model),
        ("Mission Optimization", ml_models.train_mission_optimization_model),
        ("Wellness Prediction", ml_models.train_wellness_prediction_model),
        ("Skill Gap Analysis", ml_models.train_skill_gap_analysis_model)
    ]
    
    print("[*] Training Advanced ML Models:")
    print("-" * 40)
    
    trained_models = []
    failed_models = []
    
    for model_name, train_function in models_to_train:
        try:
            print(f"\n[*] Training {model_name}...")
            train_function()
            trained_models.append(model_name)
            print(f"[SUCCESS] {model_name} trained successfully!")
        except Exception as e:
            print(f"[ERROR] Failed to train {model_name}: {str(e)}")
            failed_models.append((model_name, str(e)))
    
    # Save encoders and scalers
    print("\n[*] Saving encoders and scalers...")
    try:
        ml_models.save_encoders()
        print("[SUCCESS] Encoders and scalers saved successfully!")
    except Exception as e:
        print(f"[ERROR] Failed to save encoders: {str(e)}")
    
    # Training summary
    print("\n" + "=" * 60)
    print("TRAINING SUMMARY")
    print("=" * 60)
    
    print(f"[SUCCESS] Successfully trained models: {len(trained_models)}")
    for model in trained_models:
        print(f"   - {model}")
    
    if failed_models:
        print(f"\n[ERROR] Failed models: {len(failed_models)}")
        for model, error in failed_models:
            print(f"   - {model}: {error}")
    
    # Model files created
    model_files = [
        'advanced_attrition_model.pkl',
        'advanced_readiness_model.pkl',
        'advanced_leadership_model.pkl',
        'career_trajectory_model.pkl',
        'mission_optimization_model.pkl',
        'wellness_model.pkl',
        'advanced_skill_clustering_model.pkl',
        'encoders.pkl',
        'scalers.pkl'
    ]
    
    existing_files = [f for f in model_files if os.path.exists(f)]
    
    print(f"\n[*] Model files created: {len(existing_files)}")
    for file in existing_files:
        size = os.path.getsize(file) / 1024  # Size in KB
        print(f"   - {file} ({size:.1f} KB)")
    
    # Performance metrics summary
    print("\n[*] MODEL CAPABILITIES:")
    print("-" * 30)
    print("- Attrition Risk Prediction - Identifies personnel at risk of leaving")
    print("- Readiness Assessment - Evaluates operational readiness scores")
    print("- Leadership Evaluation - Assesses leadership potential and development")
    print("- Career Trajectory - Predicts promotion timelines and career paths")
    print("- Mission Optimization - Recommends optimal mission assignments")
    print("- Wellness Prediction - Identifies health and wellness risks")
    print("- Skill Gap Analysis - Analyzes skill gaps and training needs")
    
    print("\n[*] INTEGRATION FEATURES:")
    print("-" * 30)
    print("- Role-based AI Chatbot - Provides personalized assistance")
    print("- Real-time Predictions - Instant insights for decision making")
    print("- What-if Simulations - Scenario planning and impact analysis")
    print("- Automated Recommendations - Data-driven suggestions")
    
    print(f"\n[*] Training completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if len(trained_models) == len(models_to_train):
        print("\n[SUCCESS] ALL MODELS TRAINED SUCCESSFULLY!")
        print("The IAF Human Management System is ready for deployment.")
        return True
    else:
        print(f"\n[WARNING] {len(failed_models)} models failed to train. Please check the errors above.")
        return False

def test_models():
    """Test the trained models with sample data"""
    print("\n[*] TESTING TRAINED MODELS:")
    print("-" * 30)
    
    try:
        ml_models = AdvancedIAFMLModels()
        ml_models.load_data()
        ml_models.advanced_feature_engineering()
        
        # Test with sample personnel data
        sample_personnel = {
            'age': 32,
            'years_of_service': 8,
            'fitness_score': 85,
            'stress_index': 35,
            'missions_participated': 45,
            'mission_success_rate': 0.92,
            'peer_review_score': 8.5,
            'leadership_score': 7.2,
            'engagement_score': 82,
            'leave_records': 25,
            'disciplinary_actions': 0,
            'complaints': 0,
            'salary_grade': 6,
            'rank': 'Squadron Leader',
            'skills_str': 'Fighter Aircraft, Leadership, Strategic Planning'
        }
        
        print("Testing with sample personnel data...")
        
        # Test predictions
        attrition_risk = ml_models.predict_attrition_risk(sample_personnel)
        readiness = ml_models.predict_readiness(sample_personnel)
        leadership = ml_models.predict_leadership_potential(sample_personnel)
        
        print(f"[SUCCESS] Attrition Risk: {attrition_risk}")
        print(f"[SUCCESS] Readiness Score: {readiness}")
        print(f"[SUCCESS] Leadership Potential: {leadership}")
        
        print("\n[SUCCESS] Model testing completed successfully!")
        
    except Exception as e:
        print(f"[ERROR] Model testing failed: {str(e)}")

if __name__ == "__main__":
    success = main()
    
    if success:
        # Test the models
        test_models()
        
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("=" * 60)
        print("1. Start the Django backend: python manage.py runserver")
        print("2. Start the React frontend: cd frontend && npm start")
        print("3. Access the dashboards and test the AI chatbot")
        print("4. Use the role-based features for different user types")
        print("\n[SUCCESS] The IAF Human Management System is ready!")
    else:
        print("\n[ERROR] Training incomplete. Please fix the errors and try again.")
        sys.exit(1)