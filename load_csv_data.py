import os
import django
import pandas as pd
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from personnel.models import *

def load_all_csv_data():
    print("Loading all CSV data into database...")
    
    # Load personnel data
    if os.path.exists('personnel_data.csv'):
        print("Loading personnel data...")
        df = pd.read_csv('personnel_data.csv')
        for _, row in df.iterrows():
            Personnel.objects.get_or_create(
                personnel_id=row['id'],
                defaults={
                    'name': row['name'],
                    'rank': row['rank'],
                    'unit': row['unit'],
                    'base_location': row['base_location'],
                    'date_of_birth': pd.to_datetime(row['date_of_birth']).date(),
                    'date_of_joining': pd.to_datetime(row['date_of_joining']).date(),
                    'years_of_service': row['years_of_service'],
                    'specialization': row['specialization'],
                    'status': row['status'],
                    'contact_number': row['contact_number'],
                    'email': row['email'],
                    'emergency_contact': row['emergency_contact'],
                    'blood_group': row['blood_group'],
                    'marital_status': row['marital_status'],
                    'performance_score': row['performance_score'],
                    'leadership_score': row['leadership_score'],
                    'technical_score': row['technical_score'],
                    'attrition_risk': row['attrition_risk'],
                    'readiness_score': row['readiness_score'],
                    'leadership_potential': row['leadership_potential']
                }
            )
        print(f"Loaded {len(df)} personnel records")
    
    # Load training records
    if os.path.exists('training_records.csv'):
        print("Loading training records...")
        df = pd.read_csv('training_records.csv')
        for _, row in df.iterrows():
            try:
                personnel = Personnel.objects.get(personnel_id=row['personnel_id'])
                TrainingRecord.objects.get_or_create(
                    personnel=personnel,
                    course_name=row['course_name'],
                    start_date=pd.to_datetime(row['start_date']).date(),
                    defaults={
                        'course_type': row['course_type'],
                        'end_date': pd.to_datetime(row['end_date']).date(),
                        'status': row['status'],
                        'score': row.get('score'),
                        'instructor': row['instructor'],
                        'location': row['location'],
                        'certification_earned': row.get('certification_earned', '')
                    }
                )
            except Personnel.DoesNotExist:
                continue
        print(f"Loaded {len(df)} training records")
    
    # Load medical records
    if os.path.exists('medical_records.csv'):
        print("Loading medical records...")
        df = pd.read_csv('medical_records.csv')
        for _, row in df.iterrows():
            try:
                personnel = Personnel.objects.get(personnel_id=row['personnel_id'])
                MedicalRecord.objects.get_or_create(
                    personnel=personnel,
                    checkup_date=pd.to_datetime(row['checkup_date']).date(),
                    defaults={
                        'medical_status': row['medical_status'],
                        'height': row['height'],
                        'weight': row['weight'],
                        'blood_pressure': row['blood_pressure'],
                        'heart_rate': row['heart_rate'],
                        'vision_status': row['vision_status'],
                        'hearing_status': row['hearing_status'],
                        'fitness_level': row['fitness_level'],
                        'medical_notes': row.get('medical_notes', ''),
                        'next_checkup': pd.to_datetime(row['next_checkup']).date()
                    }
                )
            except Personnel.DoesNotExist:
                continue
        print(f"Loaded {len(df)} medical records")
    
    # Load performance reviews
    if os.path.exists('performance_reviews.csv'):
        print("Loading performance reviews...")
        df = pd.read_csv('performance_reviews.csv')
        for _, row in df.iterrows():
            try:
                personnel = Personnel.objects.get(personnel_id=row['personnel_id'])
                PerformanceReview.objects.get_or_create(
                    personnel=personnel,
                    review_date=pd.to_datetime(row['review_date']).date(),
                    defaults={
                        'review_period_start': pd.to_datetime(row['review_period_start']).date(),
                        'review_period_end': pd.to_datetime(row['review_period_end']).date(),
                        'overall_rating': row['overall_rating'],
                        'leadership_rating': row['leadership_rating'],
                        'technical_rating': row['technical_rating'],
                        'communication_rating': row['communication_rating'],
                        'teamwork_rating': row['teamwork_rating'],
                        'goals_achieved': row['goals_achieved'],
                        'areas_for_improvement': row['areas_for_improvement'],
                        'reviewer_name': row['reviewer_name']
                    }
                )
            except Personnel.DoesNotExist:
                continue
        print(f"Loaded {len(df)} performance reviews")
    
    print("CSV data loading completed!")
    print(f"Total personnel in database: {Personnel.objects.count()}")

if __name__ == "__main__":
    load_all_csv_data()