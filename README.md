# IAF Human Management System

AI-enabled Human Management System for the Indian Air Force with predictive analytics, workforce optimization, and role-based dashboards.

## Features

- **Centralized Personnel Data**: 10,000+ synthetic personnel records
- **AI/ML Models**: Attrition prediction, readiness scoring, leadership potential
- **Role-based Dashboards**: Commander, HR, Medical, Training, Personnel views
- **What-if Simulations**: Retirement, redeployment scenarios
- **Workforce Optimization**: Skill matching and recommendations

## Tech Stack

- **Backend**: Django REST Framework, Python
- **Frontend**: React, TypeScript, TailwindCSS
- **AI/ML**: Scikit-learn, XGBoost
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
- Backend API: http://localhost:8000/api/

## API Endpoints

- `GET /api/personnel/` - List personnel
- `GET /api/personnel/dashboard_stats/` - Dashboard statistics
- `POST /api/personnel/predict_attrition/` - Predict attrition risk
- `POST /api/personnel/what_if_simulation/` - Run scenarios

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

1. **Attrition Risk**: Random Forest classifier
2. **Readiness Score**: Random Forest regressor  
3. **Leadership Potential**: Multi-class classifier
4. **Skill Matching**: Recommendation system

## Security Features

- Role-based access control
- Firebase authentication
- Data anonymization
- Secure API endpoints

## Demo Credentials

Use the login page to select your role:
- Commander
- HR Manager
- Medical Officer
- Training Officer
- Personnel
