import cv2
import numpy as np
import face_recognition
import pandas as pd
from datetime import datetime, timedelta
import json
import os

class ComputerVisionSystem:
    def __init__(self):
        self.known_faces = {}
        self.attendance_log = []
        self.security_alerts = []
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
    def load_personnel_faces(self, personnel_data):
        """Load known personnel face encodings"""
        # Simulate loading face encodings for personnel
        for person in personnel_data:
            # In production, load actual face encodings from images
            face_encoding = np.random.rand(128)  # Simulated face encoding
            self.known_faces[person['personnel_id']] = {
                'encoding': face_encoding,
                'name': person['name'],
                'rank': person['rank'],
                'unit': person['unit'],
                'clearance_level': person.get('clearance_level', 'Basic')
            }
        
        print(f"✅ Loaded {len(self.known_faces)} personnel face encodings")
    
    def detect_faces_in_frame(self, frame):
        """Detect faces in video frame"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        detected_faces = []
        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]
            detected_faces.append({
                'bbox': (x, y, w, h),
                'roi': face_roi,
                'confidence': 0.85  # Simulated confidence
            })
        
        return detected_faces
    
    def recognize_personnel(self, face_image):
        """Recognize personnel from face image"""
        # Simulate face recognition
        if len(self.known_faces) == 0:
            return None
        
        # In production, compute face encoding and compare with known faces
        personnel_id = np.random.choice(list(self.known_faces.keys()))
        confidence = np.random.uniform(0.85, 0.98)
        
        if confidence > 0.8:  # Recognition threshold
            person_info = self.known_faces[personnel_id]
            return {
                'personnel_id': personnel_id,
                'name': person_info['name'],
                'rank': person_info['rank'],
                'unit': person_info['unit'],
                'confidence': confidence,
                'clearance_level': person_info['clearance_level']
            }
        
        return None
    
    def log_attendance(self, recognition_result, location='Main Gate'):
        """Log personnel attendance"""
        if recognition_result:
            attendance_entry = {
                'personnel_id': recognition_result['personnel_id'],
                'name': recognition_result['name'],
                'rank': recognition_result['rank'],
                'timestamp': datetime.now().isoformat(),
                'location': location,
                'entry_type': 'entry',
                'confidence': recognition_result['confidence']
            }
            
            self.attendance_log.append(attendance_entry)
            return attendance_entry
        
        return None
    
    def detect_unauthorized_access(self, frame, restricted_area=False):
        """Detect unauthorized personnel in restricted areas"""
        faces = self.detect_faces_in_frame(frame)
        alerts = []
        
        for face in faces:
            recognition = self.recognize_personnel(face['roi'])
            
            if recognition is None:
                # Unknown person detected
                alert = {
                    'type': 'unknown_person',
                    'timestamp': datetime.now().isoformat(),
                    'location': 'Security Camera 1',
                    'severity': 'high' if restricted_area else 'medium',
                    'description': 'Unknown person detected'
                }
                alerts.append(alert)
                self.security_alerts.append(alert)
            
            elif restricted_area and recognition['clearance_level'] not in ['High', 'Top Secret']:
                # Insufficient clearance
                alert = {
                    'type': 'insufficient_clearance',
                    'personnel_id': recognition['personnel_id'],
                    'name': recognition['name'],
                    'timestamp': datetime.now().isoformat(),
                    'location': 'Restricted Area',
                    'severity': 'high',
                    'description': f"Personnel with {recognition['clearance_level']} clearance in restricted area"
                }
                alerts.append(alert)
                self.security_alerts.append(alert)
        
        return alerts
    
    def analyze_crowd_density(self, frame):
        """Analyze crowd density for safety management"""
        faces = self.detect_faces_in_frame(frame)
        face_count = len(faces)
        
        # Calculate density based on frame area
        frame_area = frame.shape[0] * frame.shape[1]
        density = face_count / (frame_area / 10000)  # People per 100x100 pixel area
        
        if density > 0.5:
            density_level = 'high'
            recommendation = 'Consider crowd control measures'
        elif density > 0.2:
            density_level = 'medium'
            recommendation = 'Monitor crowd movement'
        else:
            density_level = 'low'
            recommendation = 'Normal operations'
        
        return {
            'face_count': face_count,
            'density': density,
            'density_level': density_level,
            'recommendation': recommendation,
            'timestamp': datetime.now().isoformat()
        }
    
    def vehicle_detection(self, frame):
        """Detect and classify vehicles"""
        # Simulate vehicle detection (in production, use YOLO or similar)
        vehicle_types = ['Car', 'Truck', 'Motorcycle', 'Aircraft', 'Tank']
        detected_vehicles = []
        
        # Simulate random vehicle detections
        num_vehicles = np.random.randint(0, 5)
        for i in range(num_vehicles):
            vehicle = {
                'type': np.random.choice(vehicle_types),
                'bbox': (
                    np.random.randint(0, frame.shape[1]-100),
                    np.random.randint(0, frame.shape[0]-100),
                    100, 60
                ),
                'confidence': np.random.uniform(0.7, 0.95),
                'license_plate': f"IAF{np.random.randint(1000, 9999)}" if np.random.random() > 0.3 else None
            }
            detected_vehicles.append(vehicle)
        
        return detected_vehicles
    
    def perimeter_monitoring(self, frame, perimeter_zones):
        """Monitor base perimeter for intrusions"""
        alerts = []
        
        # Detect motion in perimeter zones
        for zone in perimeter_zones:
            # Simulate motion detection
            motion_detected = np.random.random() > 0.9  # 10% chance of motion
            
            if motion_detected:
                alert = {
                    'type': 'perimeter_breach',
                    'zone': zone['name'],
                    'coordinates': zone['coordinates'],
                    'timestamp': datetime.now().isoformat(),
                    'severity': zone.get('severity', 'medium'),
                    'description': f"Motion detected in {zone['name']}"
                }
                alerts.append(alert)
        
        return alerts
    
    def get_attendance_report(self, date_range=7):
        """Generate attendance report"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=date_range)
        
        # Filter attendance log by date range
        filtered_log = [
            entry for entry in self.attendance_log
            if start_date <= datetime.fromisoformat(entry['timestamp']) <= end_date
        ]
        
        # Calculate statistics
        unique_personnel = set(entry['personnel_id'] for entry in filtered_log)
        daily_counts = {}
        
        for entry in filtered_log:
            date = datetime.fromisoformat(entry['timestamp']).date()
            daily_counts[str(date)] = daily_counts.get(str(date), 0) + 1
        
        return {
            'total_entries': len(filtered_log),
            'unique_personnel': len(unique_personnel),
            'daily_counts': daily_counts,
            'average_daily': len(filtered_log) / date_range,
            'date_range': f"{start_date.date()} to {end_date.date()}"
        }
    
    def get_security_summary(self):
        """Get security alerts summary"""
        recent_alerts = [
            alert for alert in self.security_alerts
            if datetime.now() - datetime.fromisoformat(alert['timestamp']) < timedelta(hours=24)
        ]
        
        alert_types = {}
        severity_counts = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
        
        for alert in recent_alerts:
            alert_type = alert['type']
            alert_types[alert_type] = alert_types.get(alert_type, 0) + 1
            severity_counts[alert['severity']] += 1
        
        return {
            'total_alerts_24h': len(recent_alerts),
            'alert_types': alert_types,
            'severity_breakdown': severity_counts,
            'latest_alert': recent_alerts[-1] if recent_alerts else None,
            'system_status': 'Normal' if len(recent_alerts) < 5 else 'Alert'
        }

# Demo usage
if __name__ == "__main__":
    cv_system = ComputerVisionSystem()
    
    # Simulate personnel data
    personnel_data = [
        {'personnel_id': 'IAF001', 'name': 'Wing Commander Sharma', 'rank': 'Wing Commander', 'unit': 'Fighter Squadron', 'clearance_level': 'High'},
        {'personnel_id': 'IAF002', 'name': 'Squadron Leader Patel', 'rank': 'Squadron Leader', 'unit': 'Transport Squadron', 'clearance_level': 'Medium'},
        {'personnel_id': 'IAF003', 'name': 'Flight Lieutenant Singh', 'rank': 'Flight Lieutenant', 'unit': 'Helicopter Unit', 'clearance_level': 'Basic'}
    ]
    
    cv_system.load_personnel_faces(personnel_data)
    
    # Simulate frame processing
    dummy_frame = np.zeros((480, 640, 3), dtype=np.uint8)
    
    # Test face detection
    faces = cv_system.detect_faces_in_frame(dummy_frame)
    print(f"👁️ Computer Vision System Ready!")
    print(f"Detected {len(faces)} faces in test frame")
    
    # Test attendance logging
    test_recognition = {
        'personnel_id': 'IAF001',
        'name': 'Wing Commander Sharma',
        'rank': 'Wing Commander',
        'confidence': 0.92,
        'clearance_level': 'High'
    }
    
    attendance = cv_system.log_attendance(test_recognition)
    if attendance:
        print(f"✅ Logged attendance for {attendance['name']}")
    
    print("🔒 Security monitoring active")