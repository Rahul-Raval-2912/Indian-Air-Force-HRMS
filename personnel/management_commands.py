from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from personnel.models import Personnel, UserProfile, TrainingRecord, MissionRecord
import pandas as pd
from datetime import datetime
import json

class Command(BaseCommand):
    help = 'Load personnel data into database'
    
    def handle(self, *args, **options):
        self.stdout.write('Loading personnel data into database...')
        
        try:
            # Load CSV data
            df = pd.read_csv('personnel_data.csv')
            
            # Clear existing data
            Personnel.objects.all().delete()
            
            # Load personnel records
            for _, row in df.iterrows():
                try:
                    personnel = Personnel(
                        id=row['id'],
                        name=row['name'],
                        gender=row.get('gender', 'Male'),
                        rank=row['rank'],
                        branch=row.get('branch', 'Flying'),
                        unit=row['unit'],
                        years_of_service=int(row['years_of_service']),
                        age=int(row['age']),
                        skills_str=row.get('skills_str', ''),
                        certifications_str=row.get('certifications_str', ''),
                        specialization=row.get('specialization', ''),
                        education_level=row.get('education_level', 'Graduate'),
                        fitness_score=int(row['fitness_score']),
                        stress_index=int(row['stress_index']),
                        injury_history_str=row.get('injury_history_str', ''),
                        last_medical_check=datetime.fromisoformat(row['last_medical_check'].replace('Z', '+00:00')),
                        missions_participated=int(row['missions_participated']),
                        mission_success_rate=float(row['mission_success_rate']),
                        peer_review_score=int(row['peer_review_score']),
                        leadership_score=int(row['leadership_score']),
                        engagement_score=int(row['engagement_score']),
                        performance_rating=row.get('performance_rating', 'Good'),
                        attrition_risk=bool(row['attrition_risk']),
                        leadership_potential=row['leadership_potential'],
                        readiness_score=int(row['readiness_score']),
                        current_posting=row['current_posting'],
                        leave_records=int(row['leave_records']),
                        disciplinary_actions=int(row['disciplinary_actions']),
                        complaints=int(row['complaints']),
                        salary_grade=int(row['salary_grade']),
                        family_status=row.get('family_status', 'Single'),
                        deployment_status=row.get('deployment_status', 'Home Base'),
                        security_clearance=row.get('security_clearance', 'Confidential'),
                        next_promotion_due=datetime.fromisoformat(row['next_promotion_due'].replace('Z', '+00:00')) if pd.notna(row.get('next_promotion_due')) else None,
                        retirement_date=datetime.fromisoformat(row['retirement_date'].replace('Z', '+00:00')) if pd.notna(row.get('retirement_date')) else None
                    )
                    personnel.save()
                    
                    # Create training records
                    if pd.notna(row.get('training_history')):
                        try:
                            training_data = json.loads(row['training_history'])
                            for training in training_data:
                                TrainingRecord.objects.create(
                                    personnel=personnel,
                                    course_name=training['course'],
                                    date_completed=datetime.fromisoformat(training['date'].replace('Z', '+00:00')),
                                    score=training['score'],
                                    duration_days=training.get('duration_days', 30)
                                )
                        except:
                            pass
                    
                except Exception as e:
                    self.stdout.write(f'Error loading record {row.get("id", "unknown")}: {e}')
                    continue
            
            # Create demo users
            self.create_demo_users()
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully loaded {Personnel.objects.count()} personnel records')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading data: {e}')
            )
    
    def create_demo_users(self):
        """Create demo users for different roles"""
        roles = [
            ('commander', 'Commander User'),
            ('hr', 'HR Manager'),
            ('medical', 'Medical Officer'),
            ('training', 'Training Officer'),
            ('personnel', 'Personnel User')
        ]
        
        for role, name in roles:
            user, created = User.objects.get_or_create(
                username=f'{role}_demo',
                defaults={
                    'first_name': name,
                    'email': f'{role}@iaf.gov.in',
                    'is_staff': True if role == 'commander' else False
                }
            )
            if created:
                user.set_password('demo123')
                user.save()
            
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'role': role,
                    'unit': 'Headquarters',
                    'access_level': 3 if role == 'commander' else 2
                }
            )