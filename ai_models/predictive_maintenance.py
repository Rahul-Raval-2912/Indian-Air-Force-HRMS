import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import json

class PredictiveMaintenanceSystem:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.equipment_data = {}
        self.maintenance_history = []
        self.failure_predictions = []
        
    def initialize_equipment_database(self):
        """Initialize equipment database with aircraft and vehicles"""
        aircraft_types = ['Sukhoi Su-30MKI', 'HAL Tejas', 'Mirage 2000', 'MiG-29', 'C-130J Hercules', 'An-32']
        vehicle_types = ['Tank T-90', 'BMP-2', 'Artillery Gun', 'Radar System', 'Communication Equipment']
        
        equipment_list = []
        
        # Generate aircraft data
        for i in range(200):
            aircraft = {
                'equipment_id': f'AC{i+1:04d}',
                'type': np.random.choice(aircraft_types),
                'category': 'Aircraft',
                'manufacture_date': datetime.now() - timedelta(days=np.random.randint(365, 7300)),
                'last_maintenance': datetime.now() - timedelta(days=np.random.randint(1, 180)),
                'flight_hours': np.random.randint(500, 8000),
                'cycles': np.random.randint(100, 2000),
                'base_location': np.random.choice(['Ambala', 'Gwalior', 'Pune', 'Bangalore', 'Jodhpur']),
                'operational_status': np.random.choice(['Operational', 'Maintenance', 'Grounded'], p=[0.8, 0.15, 0.05]),
                'criticality': np.random.choice(['High', 'Medium', 'Low'], p=[0.3, 0.5, 0.2])
            }
            equipment_list.append(aircraft)
        
        # Generate vehicle/equipment data
        for i in range(300):
            vehicle = {
                'equipment_id': f'VH{i+1:04d}',
                'type': np.random.choice(vehicle_types),
                'category': 'Ground Equipment',
                'manufacture_date': datetime.now() - timedelta(days=np.random.randint(365, 5475)),
                'last_maintenance': datetime.now() - timedelta(days=np.random.randint(1, 90)),
                'operating_hours': np.random.randint(100, 5000),
                'cycles': np.random.randint(50, 1500),
                'base_location': np.random.choice(['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad']),
                'operational_status': np.random.choice(['Operational', 'Maintenance', 'Repair'], p=[0.85, 0.12, 0.03]),
                'criticality': np.random.choice(['High', 'Medium', 'Low'], p=[0.25, 0.55, 0.2])
            }
            equipment_list.append(vehicle)
        
        self.equipment_data = {eq['equipment_id']: eq for eq in equipment_list}
        print(f"✅ Initialized {len(equipment_list)} equipment records")
        
    def generate_sensor_data(self, equipment_id):
        """Generate realistic sensor data for equipment"""
        equipment = self.equipment_data.get(equipment_id, {})
        
        if equipment.get('category') == 'Aircraft':
            return {
                'engine_temperature': np.random.normal(750, 50),
                'oil_pressure': np.random.normal(45, 5),
                'fuel_flow_rate': np.random.normal(2500, 200),
                'vibration_level': np.random.normal(2.5, 0.5),
                'hydraulic_pressure': np.random.normal(3000, 200),
                'electrical_load': np.random.normal(85, 10),
                'cabin_pressure': np.random.normal(8000, 500),
                'navigation_accuracy': np.random.normal(0.95, 0.05),
                'communication_signal': np.random.normal(90, 8),
                'landing_gear_cycles': equipment.get('cycles', 0) + np.random.randint(0, 5)
            }
        else:
            return {
                'engine_temperature': np.random.normal(90, 10),
                'oil_pressure': np.random.normal(35, 3),
                'fuel_consumption': np.random.normal(15, 2),
                'vibration_level': np.random.normal(1.8, 0.3),
                'hydraulic_pressure': np.random.normal(2000, 150),
                'electrical_voltage': np.random.normal(24, 2),
                'transmission_temp': np.random.normal(80, 8),
                'brake_wear': np.random.uniform(0.1, 0.9),
                'tire_pressure': np.random.normal(35, 3),
                'operational_cycles': equipment.get('cycles', 0) + np.random.randint(0, 3)
            }
    
    def train_failure_prediction_model(self):
        """Train ML model to predict equipment failures"""
        # Generate training data
        training_data = []
        
        for equipment_id in list(self.equipment_data.keys())[:100]:  # Use subset for training
            equipment = self.equipment_data[equipment_id]
            
            # Generate historical sensor readings
            for _ in range(50):  # 50 historical readings per equipment
                sensor_data = self.generate_sensor_data(equipment_id)
                
                # Calculate age and usage factors
                age_days = (datetime.now() - equipment['manufacture_date']).days
                usage_factor = equipment.get('flight_hours', equipment.get('operating_hours', 0)) / 1000
                
                # Create feature vector
                features = [
                    age_days,
                    usage_factor,
                    equipment.get('cycles', 0),
                    (datetime.now() - equipment['last_maintenance']).days,
                    1 if equipment['criticality'] == 'High' else 0,
                    *sensor_data.values()
                ]
                
                # Simulate failure probability (higher for older, heavily used equipment)
                failure_prob = min(0.95, (age_days / 7300) * 0.3 + (usage_factor / 10) * 0.4 + np.random.normal(0, 0.1))
                failure_prob = max(0.05, failure_prob)
                
                training_data.append(features + [failure_prob])
        
        # Convert to DataFrame
        feature_names = [
            'age_days', 'usage_factor', 'cycles', 'days_since_maintenance', 'high_criticality'
        ] + list(self.generate_sensor_data(list(self.equipment_data.keys())[0]).keys())
        
        df = pd.DataFrame(training_data, columns=feature_names + ['failure_probability'])
        
        # Train model
        X = df[feature_names]
        y = df['failure_probability']
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train Random Forest model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Train anomaly detection model
        anomaly_model = IsolationForest(contamination=0.1, random_state=42)
        anomaly_model.fit(X_scaled)
        
        self.models['failure_prediction'] = model
        self.models['anomaly_detection'] = anomaly_model
        self.scalers['main'] = scaler
        
        print("✅ Predictive maintenance models trained successfully")
        return model.score(X_scaled, y)
    
    def predict_equipment_failure(self, equipment_id):
        """Predict failure probability for specific equipment"""
        if 'failure_prediction' not in self.models:
            return {'error': 'Model not trained'}
        
        equipment = self.equipment_data.get(equipment_id)
        if not equipment:
            return {'error': 'Equipment not found'}
        
        # Get current sensor data
        sensor_data = self.generate_sensor_data(equipment_id)
        
        # Prepare features
        age_days = (datetime.now() - equipment['manufacture_date']).days
        usage_factor = equipment.get('flight_hours', equipment.get('operating_hours', 0)) / 1000
        
        features = [
            age_days,
            usage_factor,
            equipment.get('cycles', 0),
            (datetime.now() - equipment['last_maintenance']).days,
            1 if equipment['criticality'] == 'High' else 0,
            *sensor_data.values()
        ]
        
        # Scale and predict
        features_scaled = self.scalers['main'].transform([features])
        failure_prob = self.models['failure_prediction'].predict(features_scaled)[0]
        
        # Detect anomalies
        anomaly_score = self.models['anomaly_detection'].decision_function(features_scaled)[0]
        is_anomaly = self.models['anomaly_detection'].predict(features_scaled)[0] == -1
        
        # Determine maintenance priority
        if failure_prob > 0.8 or is_anomaly:
            priority = 'Critical'
            recommended_action = 'Immediate maintenance required'
        elif failure_prob > 0.6:
            priority = 'High'
            recommended_action = 'Schedule maintenance within 7 days'
        elif failure_prob > 0.4:
            priority = 'Medium'
            recommended_action = 'Schedule maintenance within 30 days'
        else:
            priority = 'Low'
            recommended_action = 'Continue normal operations'
        
        return {
            'equipment_id': equipment_id,
            'failure_probability': round(failure_prob, 3),
            'anomaly_detected': is_anomaly,
            'anomaly_score': round(anomaly_score, 3),
            'priority': priority,
            'recommended_action': recommended_action,
            'sensor_readings': sensor_data,
            'next_maintenance_due': equipment['last_maintenance'] + timedelta(days=90),
            'prediction_timestamp': datetime.now().isoformat()
        }
    
    def generate_maintenance_schedule(self, days_ahead=30):
        """Generate optimized maintenance schedule"""
        schedule = []
        
        for equipment_id, equipment in self.equipment_data.items():
            prediction = self.predict_equipment_failure(equipment_id)
            
            if prediction.get('priority') in ['Critical', 'High']:
                # Calculate optimal maintenance date
                if prediction['priority'] == 'Critical':
                    maintenance_date = datetime.now() + timedelta(days=np.random.randint(1, 3))
                else:
                    maintenance_date = datetime.now() + timedelta(days=np.random.randint(3, 14))
                
                schedule.append({
                    'equipment_id': equipment_id,
                    'equipment_type': equipment['type'],
                    'base_location': equipment['base_location'],
                    'scheduled_date': maintenance_date.isoformat(),
                    'priority': prediction['priority'],
                    'failure_probability': prediction['failure_probability'],
                    'estimated_duration': np.random.randint(4, 24),  # hours
                    'maintenance_type': 'Preventive' if prediction['priority'] == 'High' else 'Emergency',
                    'required_parts': self.get_required_parts(equipment['type']),
                    'technician_required': np.random.randint(2, 6)
                })
        
        # Sort by priority and date
        schedule.sort(key=lambda x: (x['priority'] == 'Critical', x['scheduled_date']))
        
        return schedule[:50]  # Return top 50 items
    
    def get_required_parts(self, equipment_type):
        """Get commonly required parts for equipment type"""
        parts_database = {
            'Sukhoi Su-30MKI': ['Engine Oil Filter', 'Hydraulic Seals', 'Navigation Module'],
            'HAL Tejas': ['Fuel Pump', 'Avionics Unit', 'Landing Gear Component'],
            'Tank T-90': ['Track Pads', 'Engine Filter', 'Transmission Oil'],
            'Radar System': ['Antenna Element', 'Power Supply Unit', 'Signal Processor']
        }
        
        return parts_database.get(equipment_type, ['General Maintenance Kit', 'Lubricants', 'Filters'])
    
    def get_maintenance_analytics(self):
        """Get comprehensive maintenance analytics"""
        # Calculate fleet statistics
        total_equipment = len(self.equipment_data)
        operational = sum(1 for eq in self.equipment_data.values() if eq['operational_status'] == 'Operational')
        in_maintenance = sum(1 for eq in self.equipment_data.values() if eq['operational_status'] == 'Maintenance')
        
        # Predict failures for all equipment
        high_risk_count = 0
        critical_count = 0
        
        for equipment_id in list(self.equipment_data.keys())[:100]:  # Sample for performance
            prediction = self.predict_equipment_failure(equipment_id)
            if prediction.get('priority') == 'Critical':
                critical_count += 1
            elif prediction.get('priority') == 'High':
                high_risk_count += 1
        
        # Calculate maintenance costs (simulated)
        monthly_cost = np.random.randint(50000, 200000)  # INR
        cost_per_equipment = monthly_cost / total_equipment
        
        return {
            'fleet_overview': {
                'total_equipment': total_equipment,
                'operational': operational,
                'in_maintenance': in_maintenance,
                'operational_percentage': round((operational / total_equipment) * 100, 1)
            },
            'risk_assessment': {
                'critical_risk': critical_count,
                'high_risk': high_risk_count,
                'medium_risk': np.random.randint(20, 40),
                'low_risk': total_equipment - critical_count - high_risk_count - 30
            },
            'cost_analysis': {
                'monthly_maintenance_cost': monthly_cost,
                'cost_per_equipment': round(cost_per_equipment, 2),
                'projected_annual_cost': monthly_cost * 12,
                'cost_savings_potential': round(monthly_cost * 0.15, 2)  # 15% potential savings
            },
            'efficiency_metrics': {
                'average_uptime': round(np.random.uniform(85, 95), 1),
                'mtbf_hours': np.random.randint(800, 1200),  # Mean Time Between Failures
                'mttr_hours': np.random.randint(4, 12),      # Mean Time To Repair
                'maintenance_effectiveness': round(np.random.uniform(80, 90), 1)
            }
        }

# Demo usage
if __name__ == "__main__":
    pm_system = PredictiveMaintenanceSystem()
    pm_system.initialize_equipment_database()
    
    # Train models
    accuracy = pm_system.train_failure_prediction_model()
    print(f"Model accuracy: {accuracy:.3f}")
    
    # Test prediction
    sample_equipment = list(pm_system.equipment_data.keys())[0]
    prediction = pm_system.predict_equipment_failure(sample_equipment)
    print(f"Sample prediction for {sample_equipment}: {prediction['priority']} priority")
    
    # Generate maintenance schedule
    schedule = pm_system.generate_maintenance_schedule()
    print(f"Generated maintenance schedule with {len(schedule)} items")
    
    print("🔧 Predictive Maintenance System Ready!")