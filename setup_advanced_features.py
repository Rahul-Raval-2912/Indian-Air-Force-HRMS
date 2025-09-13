#!/usr/bin/env python3
"""
Advanced Features Setup Script for IAF Human Management System
Initializes deep learning models, computer vision, NLP, and predictive maintenance systems
"""

import os
import sys
import subprocess
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.append(str(project_dir))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_system.settings')
django.setup()

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True, text=True)
        print("✅ Packages installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        print("Continuing with available packages...")

def setup_deep_learning_models():
    """Initialize and train deep learning models"""
    print("\n🧠 Setting up Deep Learning Models...")
    try:
        from ai_models.deep_learning_models import DeepLearningModels
        
        dl_models = DeepLearningModels()
        trained_models = dl_models.train_models()
        
        # Create models directory if it doesn't exist
        models_dir = project_dir / 'ai_models' / 'trained_models'
        models_dir.mkdir(exist_ok=True)
        
        # Save models
        for name, model in trained_models.items():
            model_path = models_dir / f'{name}_model.h5'
            model.save(str(model_path))
            print(f"  ✅ Saved {name} model")
        
        print("✅ Deep Learning models setup complete")
        
    except Exception as e:
        print(f"❌ Error setting up deep learning models: {e}")

def setup_computer_vision():
    """Initialize computer vision system"""
    print("\n👁️ Setting up Computer Vision System...")
    try:
        from ai_models.computer_vision import ComputerVisionSystem
        
        cv_system = ComputerVisionSystem()
        
        # Generate sample personnel data for face recognition
        from personnel.models import Personnel
        personnel_data = []
        
        for person in Personnel.objects.all()[:100]:  # Use first 100 personnel
            personnel_data.append({
                'personnel_id': person.personnel_id,
                'name': person.name,
                'rank': person.rank,
                'unit': person.unit,
                'clearance_level': getattr(person, 'clearance_level', 'Basic')
            })
        
        cv_system.load_personnel_faces(personnel_data)
        print("✅ Computer Vision system setup complete")
        
    except Exception as e:
        print(f"❌ Error setting up computer vision: {e}")

def setup_nlp_voice_system():
    """Initialize NLP and voice processing system"""
    print("\n🎤 Setting up NLP & Voice System...")
    try:
        from ai_models.nlp_voice_system import VoiceNLPSystem
        
        voice_system = VoiceNLPSystem()
        status = voice_system.get_voice_interface_status()
        
        print(f"  📢 Speech Recognition: {'✅' if status['speech_recognition'] else '❌'}")
        print(f"  🔊 Text-to-Speech: {'✅' if status['text_to_speech'] else '❌'}")
        print(f"  🌐 Translation: {'✅' if status['translation'] else '❌'}")
        print(f"  🎯 Supported Languages: {len(status['supported_languages'])}")
        
        print("✅ NLP & Voice system setup complete")
        
    except Exception as e:
        print(f"❌ Error setting up NLP & Voice system: {e}")

def setup_predictive_maintenance():
    """Initialize predictive maintenance system"""
    print("\n🔧 Setting up Predictive Maintenance System...")
    try:
        from ai_models.predictive_maintenance import PredictiveMaintenanceSystem
        
        pm_system = PredictiveMaintenanceSystem()
        pm_system.initialize_equipment_database()
        
        # Train predictive models
        accuracy = pm_system.train_failure_prediction_model()
        print(f"  📊 Model Accuracy: {accuracy:.3f}")
        
        # Generate sample maintenance schedule
        schedule = pm_system.generate_maintenance_schedule()
        print(f"  📅 Generated maintenance schedule with {len(schedule)} items")
        
        # Save models
        models_dir = project_dir / 'ai_models' / 'trained_models'
        models_dir.mkdir(exist_ok=True)
        
        import joblib
        joblib.dump(pm_system.models, models_dir / 'predictive_maintenance_models.pkl')
        joblib.dump(pm_system.scalers, models_dir / 'predictive_maintenance_scalers.pkl')
        
        print("✅ Predictive Maintenance system setup complete")
        
    except Exception as e:
        print(f"❌ Error setting up predictive maintenance: {e}")

def setup_enhanced_ml_models():
    """Setup enhanced ML models"""
    print("\n🤖 Setting up Enhanced ML Models...")
    try:
        from ai_models.advanced_ml_models import AdvancedMLModels
        
        ml_models = AdvancedMLModels()
        
        # Generate training data
        print("  📊 Generating training data...")
        ml_models.generate_training_data()
        
        # Train all models
        print("  🎯 Training ML models...")
        results = ml_models.train_all_models()
        
        for model_name, accuracy in results.items():
            print(f"    ✅ {model_name}: {accuracy:.3f} accuracy")
        
        # Save models
        models_dir = project_dir / 'ai_models' / 'trained_models'
        models_dir.mkdir(exist_ok=True)
        
        import joblib
        joblib.dump(ml_models.models, models_dir / 'advanced_ml_models.pkl')
        joblib.dump(ml_models.scalers, models_dir / 'advanced_ml_scalers.pkl')
        
        print("✅ Enhanced ML models setup complete")
        
    except Exception as e:
        print(f"❌ Error setting up enhanced ML models: {e}")

def create_sample_data():
    """Create additional sample data for advanced features"""
    print("\n📊 Creating sample data for advanced features...")
    try:
        # Create equipment records
        from personnel.models import Equipment, MaintenanceRecord
        
        # Sample equipment data
        equipment_types = [
            'Sukhoi Su-30MKI', 'HAL Tejas', 'Mirage 2000', 'MiG-29',
            'C-130J Hercules', 'An-32', 'Tank T-90', 'BMP-2'
        ]
        
        for i in range(50):
            equipment, created = Equipment.objects.get_or_create(
                equipment_id=f'EQ{i+1:04d}',
                defaults={
                    'name': f'{equipment_types[i % len(equipment_types)]} - {i+1}',
                    'type': equipment_types[i % len(equipment_types)],
                    'status': 'Operational',
                    'location': f'Base {chr(65 + (i % 5))}'
                }
            )
            
            if created:
                # Create maintenance records
                MaintenanceRecord.objects.create(
                    equipment=equipment,
                    maintenance_type='Routine',
                    description='Regular maintenance check',
                    status='Completed'
                )
        
        print("✅ Sample data created successfully")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")

def main():
    """Main setup function"""
    print("🚀 IAF Advanced Features Setup")
    print("=" * 50)
    
    # Install requirements
    install_requirements()
    
    # Setup all advanced features
    setup_enhanced_ml_models()
    setup_deep_learning_models()
    setup_computer_vision()
    setup_nlp_voice_system()
    setup_predictive_maintenance()
    create_sample_data()
    
    print("\n" + "=" * 50)
    print("🎉 Advanced Features Setup Complete!")
    print("\nAvailable Features:")
    print("  🧠 Deep Learning Models - Neural networks for pattern recognition")
    print("  🎤 Voice Interface - Multilingual voice commands and responses")
    print("  👁️ Computer Vision - Facial recognition and security monitoring")
    print("  🔧 Predictive Maintenance - AI-powered equipment maintenance scheduling")
    print("  📊 Enhanced Analytics - Real-time dashboards and advanced visualizations")
    print("  🌐 Sentiment Analysis - Personnel morale monitoring")
    print("  📈 Comparative Analysis - Benchmarking against global standards")
    print("\nAccess these features through:")
    print("  • Frontend: http://localhost:3000/analytics")
    print("  • Frontend: http://localhost:3000/voice")
    print("  • API: http://localhost:8000/api/advanced/")

if __name__ == "__main__":
    main()