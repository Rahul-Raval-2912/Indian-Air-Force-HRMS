import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from personnel.models import Personnel

def create_simple_data():
    print("Creating simple personnel data...")
    
    # Clear existing data
    Personnel.objects.all().delete()
    
    ranks = ['Air Marshal', 'Air Vice Marshal', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant']
    units = ['1 Squadron', '2 Squadron', '3 Squadron', '4 Squadron', '5 Squadron']
    bases = ['Hindon Air Base', 'Palam Air Base', 'Jodhpur Air Base', 'Pune Air Base', 'Bangalore Air Base']
    specializations = ['Fighter Pilot', 'Transport Pilot', 'Engineer', 'Navigator', 'Ground Crew']
    
    for i in range(100):
        personnel_id = f"IAF{str(i+1).zfill(4)}"
        
        Personnel.objects.create(
            personnel_id=personnel_id,
            name=f"Officer {i+1}",
            rank=random.choice(ranks),
            unit=random.choice(units),
            base_location=random.choice(bases),
            date_of_birth=datetime.now().date() - timedelta(days=random.randint(8000, 15000)),
            date_of_joining=datetime.now().date() - timedelta(days=random.randint(1000, 8000)),
            years_of_service=random.randint(1, 25),
            specialization=random.choice(specializations),
            status='Active',
            contact_number=f"9{random.randint(100000000, 999999999)}",
            email=f"officer{i+1}@iaf.gov.in",
            emergency_contact=f"Emergency Contact {i+1}",
            blood_group=random.choice(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
            marital_status=random.choice(['Single', 'Married', 'Divorced']),
            performance_score=round(random.uniform(70, 95), 1),
            leadership_score=round(random.uniform(60, 90), 1),
            technical_score=round(random.uniform(65, 95), 1),
            attrition_risk=round(random.uniform(0.1, 0.8), 2),
            readiness_score=round(random.uniform(75, 98), 1),
            leadership_potential=random.choice(['Low', 'Medium', 'High'])
        )
    
    print(f"Created {Personnel.objects.count()} personnel records")

if __name__ == "__main__":
    create_simple_data()