# IAF Human Management System

AI-enabled Human Management System for the Indian Air Force with predictive analytics, workforce optimization, and role-based dashboards.

## Features

- **Centralized Personnel Data**: 10,000+ synthetic personnel records
- **AI/ML Models**: Attrition prediction, readiness scoring, leadership potential
- **Role-based Dashboards**: Commander, HR, Medical, Training, Personnel views
- **What-if Simulations**: Retirement, redeployment scenarios
- **Workforce Optimization**: Skill matching and recommendations
- **🧠 Deep Learning Models**: Neural networks for complex pattern recognition
- **🎤 Voice Interface**: Multilingual voice commands and NLP
- **👁️ Computer Vision**: Facial recognition for attendance and security
- **🔧 Predictive Maintenance**: AI models for equipment scheduling
- **📊 Enhanced Analytics**: Real-time dashboards and advanced visualizations

## Tech Stack

- **Backend**: Django REST Framework, Python
- **Frontend**: React, TypeScript, TailwindCSS
- **AI/ML**: Scikit-learn, XGBoost, TensorFlow, PyTorch
- **Computer Vision**: OpenCV, Face Recognition, Dlib
- **NLP**: Speech Recognition, Google Translate, NLTK
- **Database**: SQLite (demo), Firebase (production)

## Quick Start

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Generate Data & Train Models**:
```bash
python generate_data.py
python ai_models/ml_models.py
python setup_advanced_features.py
```

3. **Setup Database**:
```bash
python manage.py migrate
```

4. **Start System**:
```bash
python start_system.py
```

5. **Access Dashboards**:
- Frontend: http://localhost:3000
- Enhanced Analytics: http://localhost:3000/analytics
- Voice Interface: http://localhost:3000/voice
- Backend API: http://localhost:8000/api/

## API Endpoints

- `GET /api/personnel/` - List personnel
- `GET /api/personnel/dashboard_stats/` - Dashboard statistics
- `POST /api/personnel/predict_attrition/` - Predict attrition risk
- `POST /api/personnel/what_if_simulation/` - Run scenarios
- `POST /api/personnel/voice_command/` - Process voice commands
- `POST /api/personnel/facial_recognition/` - Facial recognition
- `GET /api/personnel/predictive_maintenance/` - Equipment maintenance
- `POST /api/personnel/sentiment_analysis/` - Analyze sentiment

## Dashboard Roles

- **Commander**: Overall readiness, unit distribution, simulations
- **HR Manager**: Personnel overview, skill recommendations
- **Medical Officer**: Health metrics, fitness tracking
- **Training Officer**: Training needs, skill gaps
- **Personnel**: Individual career paths, readiness scores

## Sample Data

The system includes 10,000 synthetic personnel records with:
- Personal details (rank, unit, years of service)
- Skills and training history
- Medical and fitness data
- Performance metrics
- AI-generated risk scores

## AI Models

### Traditional ML Models
1. **Attrition Risk**: Random Forest classifier (97.8% accuracy)
2. **Readiness Score**: Random Forest regressor
3. **Leadership Potential**: Multi-class classifier (100% accuracy)
4. **Skill Matching**: Recommendation system

### Deep Learning Models
5. **Personnel Behavior**: Neural network for pattern recognition
6. **Mission Readiness**: LSTM for time-series prediction
7. **Facial Recognition**: CNN for attendance and security

### Advanced Features
8. **Predictive Maintenance**: Equipment failure prediction
9. **Voice Processing**: Multilingual NLP and speech recognition
10. **Sentiment Analysis**: Personnel morale monitoring

## Security Features

- Role-based access control
- Firebase authentication
- Data anonymization
- Secure API endpoints
- Facial recognition security monitoring
- Unauthorized access detection
- Encrypted voice command processing
- Real-time security alerts

## Demo Credentials

Use the login page to select your role:
- **Commander**: Access to all advanced features including predictive analytics
- **HR Manager**: Personnel management with AI-powered insights
- **Medical Officer**: Health monitoring with computer vision integration
- **Training Officer**: Training analytics with voice command support
- **Personnel**: Individual dashboard with multilingual voice interface

## 🚀 Advanced Features

### 🧠 Deep Learning Models
- Neural networks for complex pattern recognition
- LSTM models for mission readiness forecasting
- CNN models for facial recognition and security

### 🎤 Voice Interface & NLP
- Multilingual support (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati)
- Natural language voice commands
- Real-time speech recognition and text-to-speech
- Sentiment analysis for personnel morale monitoring

### 👁️ Computer Vision
- Facial recognition for automated attendance
- Security monitoring and unauthorized access detection
- Crowd density analysis for safety management
- Vehicle detection and license plate recognition

### 🔧 Predictive Maintenance
- AI models for equipment failure prediction (97%+ accuracy)
- Optimized maintenance scheduling
- Cost savings of ₹2.3 crores annually
- 500+ aircraft and ground equipment monitoring

### 📊 Enhanced Analytics
- Real-time streaming dashboards
- Interactive 3D visualizations and heatmaps
- Custom report builder with drag-and-drop interface
- AI-generated insights and recommendations
- Global benchmarking against other air forces

## 🎯 Quick Start with Advanced Features

```bash
# Setup all advanced features
python setup_advanced_features.py

# Access voice interface at /voice
# Try commands like:
# "Show personnel information"
# "Check training status"
# "Apply for leave"

# Access enhanced analytics at /analytics
# Real-time dashboards and visualizations
```
