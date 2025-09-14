#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date, timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from personnel.models import *

def create_sample_data():
    print("Loading IAF Personnel Management System Data...")
    
    # Clear existing data
    Personnel.objects.all().delete()
    AirBase.objects.all().delete()
    Aircraft.objects.all().delete()
    Squadron.objects.all().delete()
    
    # Create Air Bases
    bases = [
        {'base_id': 'AFB001', 'name': 'Hindon Air Force Station', 'location': 'Ghaziabad', 'state': 'Uttar Pradesh', 'base_type': 'Fighter'},
        {'base_id': 'AFB002', 'name': 'Palam Air Force Station', 'location': 'New Delhi', 'state': 'Delhi', 'base_type': 'Transport'},
        {'base_id': 'AFB003', 'name': 'Pune Air Force Station', 'location': 'Pune', 'state': 'Maharashtra', 'base_type': 'Training'},
        {'base_id': 'AFB004', 'name': 'Jodhpur Air Force Station', 'location': 'Jodhpur', 'state': 'Rajasthan', 'base_type': 'Fighter'},
        {'base_id': 'AFB005', 'name': 'Bangalore Air Force Station', 'location': 'Bangalore', 'state': 'Karnataka', 'base_type': 'Strategic'}
    ]
    
    for base_data in bases:
        AirBase.objects.create(
            base_id=base_data['base_id'],
            name=base_data['name'],
            location=base_data['location'],
            state=base_data['state'],
            base_type=base_data['base_type'],
            established_date=date(1950 + random.randint(0, 50), random.randint(1, 12), random.randint(1, 28)),
            hangar_capacity=random.randint(20, 100),
            personnel_capacity=random.randint(500, 2000),
            current_personnel=0
        )
    
    # Create Personnel
    ranks = ['Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 
             'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer', 'Pilot Officer']
    
    units = ['101 Squadron', '102 Squadron', '201 Squadron', '301 Squadron', 'Air Traffic Control',
             'Maintenance Wing', 'Intelligence Wing', 'Medical Wing', 'Training Command']
    
    specializations = ['Fighter Pilot', 'Transport Pilot', 'Aircraft Maintenance', 'Air Traffic Control',
                      'Intelligence', 'Medical Officer', 'Engineering', 'Communications', 'Logistics']
    
    personnel_data = []
    for i in range(100):  # Create 100 personnel
        base = random.choice(AirBase.objects.all())
        years_service = random.randint(1, 30)
        
        personnel = Personnel.objects.create(
            personnel_id=f'IAF{2024}{str(i+1).zfill(4)}',
            name=f'Officer {chr(65 + i % 26)}{chr(65 + (i//26) % 26)} {random.choice(["Singh", "Kumar", "Sharma", "Patel", "Gupta"])}',
            rank=random.choice(ranks),
            unit=random.choice(units),
            base_location=base.name,
            date_of_birth=date(1970 + random.randint(0, 25), random.randint(1, 12), random.randint(1, 28)),
            date_of_joining=date(2000 + random.randint(0, 24), random.randint(1, 12), random.randint(1, 28)),
            years_of_service=years_service,
            specialization=random.choice(specializations),
            status=random.choice(['Active', 'Active', 'Active', 'On Leave', 'Training', 'Deployed']),
            contact_number=f'+91{random.randint(7000000000, 9999999999)}',
            email=f'officer{i+1}@iaf.gov.in',
            emergency_contact=f'Emergency Contact {i+1}',
            blood_group=random.choice(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
            marital_status=random.choice(['Single', 'Married', 'Divorced']),
            performance_score=round(random.uniform(70, 100), 1),
            leadership_score=round(random.uniform(60, 100), 1),
            technical_score=round(random.uniform(65, 100), 1),
            attrition_risk=round(random.uniform(0, 1), 3),
            readiness_score=round(random.uniform(75, 100), 1),
            leadership_potential=random.choice(['Low', 'Medium', 'High', 'Very High'])
        )
        
        # Update base personnel count
        base.current_personnel += 1
        base.save()
        
        # Create medical records
        MedicalRecord.objects.create(
            personnel=personnel,
            checkup_date=date.today() - timedelta(days=random.randint(1, 180)),
            medical_status=random.choice(['Fit', 'Fit', 'Fit', 'Temporary Unfit']),
            height=random.randint(160, 190),
            weight=random.randint(60, 90),
            blood_pressure=f'{random.randint(110, 140)}/{random.randint(70, 90)}',
            heart_rate=random.randint(60, 100),
            vision_status=random.choice(['20/20', '20/25', '20/30']),
            hearing_status='Normal',
            fitness_level=random.choice(['Excellent', 'Good', 'Average']),
            medical_notes='Routine checkup completed',
            next_checkup=date.today() + timedelta(days=random.randint(90, 180))
        )
        
        # Create training records
        courses = ['Basic Flight Training', 'Advanced Combat Training', 'Leadership Development', 
                  'Technical Certification', 'Safety Training']
        
        for _ in range(random.randint(1, 3)):
            start_date = date.today() - timedelta(days=random.randint(30, 365))
            TrainingRecord.objects.create(
                personnel=personnel,
                course_name=random.choice(courses),
                course_type=random.choice(['Mandatory', 'Professional Development', 'Certification']),
                start_date=start_date,
                end_date=start_date + timedelta(days=random.randint(7, 90)),
                status=random.choice(['Completed', 'Completed', 'In Progress']),
                score=random.randint(70, 100) if random.choice([True, False]) else None,
                instructor=f'Instructor {random.randint(1, 20)}',
                location=base.name
            )
    
    # Create Aircraft
    aircraft_models = ['Sukhoi Su-30MKI', 'HAL Tejas', 'Mirage 2000', 'MiG-29', 'C-130J Super Hercules',
                      'An-32', 'Mi-17', 'Apache AH-64E', 'Chinook CH-47F']
    
    for i in range(50):
        base = random.choice(AirBase.objects.all())
        pilot = random.choice(Personnel.objects.filter(specialization__contains='Pilot')) if random.choice([True, False]) else None
        
        Aircraft.objects.create(
            aircraft_id=f'AC{str(i+1).zfill(4)}',
            model=random.choice(aircraft_models),
            aircraft_type=random.choice(['Fighter', 'Transport', 'Helicopter', 'Trainer']),
            status=random.choice(['Operational', 'Operational', 'Maintenance', 'Repair']),
            base=base,
            squadron=random.choice(units),
            manufactured_date=date(2000 + random.randint(0, 24), random.randint(1, 12), random.randint(1, 28)),
            last_maintenance=date.today() - timedelta(days=random.randint(1, 90)),
            next_maintenance=date.today() + timedelta(days=random.randint(30, 180)),
            flight_hours=random.randint(100, 5000),
            pilot_assigned=pilot,
            crew_required=random.randint(1, 4)
        )
    
    # Create Equipment
    equipment_types = ['Radar System', 'Communication Equipment', 'Navigation System', 'Weapon System',
                      'Ground Support Equipment', 'Maintenance Tools', 'Safety Equipment']
    
    for i in range(200):
        Equipment.objects.create(
            equipment_id=f'EQ{str(i+1).zfill(4)}',
            name=f'{random.choice(equipment_types)} {i+1}',
            type=random.choice(equipment_types),
            status=random.choice(['Operational', 'Operational', 'Maintenance', 'Repair']),
            location=random.choice(AirBase.objects.all()).name,
            assigned_personnel=random.choice(Personnel.objects.all()) if random.choice([True, False]) else None,
            last_maintenance=date.today() - timedelta(days=random.randint(1, 90)),
            next_maintenance=date.today() + timedelta(days=random.randint(30, 180))
        )
    
    # Create Missions
    mission_types = ['Training Exercise', 'Border Patrol', 'Humanitarian Aid', 'Combat Training', 'Reconnaissance']
    
    for i in range(20):
        start_date = datetime.now() - timedelta(days=random.randint(0, 30))
        mission = MissionRecord.objects.create(
            mission_id=f'MSN{str(i+1).zfill(3)}',
            mission_name=f'{random.choice(mission_types)} {i+1}',
            mission_type=random.choice(mission_types),
            start_date=start_date,
            end_date=start_date + timedelta(days=random.randint(1, 14)),
            status=random.choice(['Planned', 'Active', 'Completed']),
            location=random.choice(['Northern Sector', 'Western Sector', 'Eastern Sector', 'Southern Sector']),
            description=f'Mission description for {random.choice(mission_types)}'
        )
        
        # Assign personnel to missions
        assigned_personnel = random.sample(list(Personnel.objects.filter(status='Active')), 
                                         random.randint(3, 8))
        for person in assigned_personnel:
            MissionAssignment.objects.create(
                personnel=person,
                mission=mission,
                role=random.choice(['Commander', 'Pilot', 'Navigator', 'Engineer', 'Support'])
            )
    
    print("Sample data loaded successfully!")
    print(f"Created:")
    print(f"   • {Personnel.objects.count()} Personnel")
    print(f"   • {AirBase.objects.count()} Air Bases")
    print(f"   • {Aircraft.objects.count()} Aircraft")
    print(f"   • {Equipment.objects.count()} Equipment Items")
    print(f"   • {MissionRecord.objects.count()} Missions")
    print(f"   • {MedicalRecord.objects.count()} Medical Records")
    print(f"   • {TrainingRecord.objects.count()} Training Records")

if __name__ == '__main__':
    create_sample_data()