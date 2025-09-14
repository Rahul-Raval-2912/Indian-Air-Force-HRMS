import os
import django
import random
from datetime import datetime, timedelta
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from personnel.models import Personnel

def generate_large_dataset():
    print("Generating 500,000+ personnel records...")
    
    # Clear existing data
    Personnel.objects.all().delete()
    
    # Data arrays
    ranks = ['Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 
             'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer', 'Pilot Officer']
    
    units = ['1 Squadron', '2 Squadron', '3 Squadron', '4 Squadron', '5 Squadron', '6 Squadron', 
             '7 Squadron', '8 Squadron', '9 Squadron', '10 Squadron', '11 Squadron', '12 Squadron']
    
    bases = ['Hindon Air Base', 'Palam Air Base', 'Jodhpur Air Base', 'Pune Air Base', 'Bangalore Air Base',
             'Gwalior Air Base', 'Kalaikunda Air Base', 'Pathankot Air Base', 'Ambala Air Base', 'Bareilly Air Base',
             'Bidar Air Base', 'Chandigarh Air Base', 'Halwara Air Base', 'Jaisalmer Air Base', 'Jamnagar Air Base']
    
    specializations = ['Fighter Pilot', 'Transport Pilot', 'Helicopter Pilot', 'Navigator', 'Flight Engineer',
                      'Air Traffic Controller', 'Radar Operator', 'Communications Specialist', 'Meteorologist',
                      'Ground Crew', 'Maintenance Engineer', 'Weapons Specialist', 'Intelligence Officer']
    
    first_names = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Kavita', 'Suresh', 'Meera', 'Ravi', 'Anita',
                   'Deepak', 'Pooja', 'Manoj', 'Sita', 'Arun', 'Geeta', 'Kiran', 'Lata', 'Mohan', 'Nisha',
                   'Prakash', 'Rekha', 'Sanjay', 'Usha', 'Vinod', 'Asha', 'Ramesh', 'Shanti', 'Ajay', 'Bharti']
    
    last_names = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Yadav', 'Verma', 'Agarwal', 'Jain', 'Mishra',
                  'Tiwari', 'Pandey', 'Srivastava', 'Chauhan', 'Joshi', 'Saxena', 'Bansal', 'Arora', 'Malhotra', 'Kapoor']
    
    blood_groups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']
    marital_statuses = ['Single', 'Married', 'Divorced', 'Widowed']
    leadership_potentials = ['Low', 'Medium', 'High', 'Very High']
    
    batch_size = 1000
    total_records = 500000
    
    personnel_list = []
    
    for i in range(total_records):
        if i % 10000 == 0:
            print(f"Generated {i} records...")
        
        personnel_id = f"IAF{str(i+1).zfill(6)}"
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name = f"{first_name} {last_name}"
        
        # Generate realistic dates
        birth_date = datetime.now().date() - timedelta(days=random.randint(8000, 18000))  # 22-50 years old
        join_date = birth_date + timedelta(days=random.randint(6570, 11680))  # Joined 18-32 years old
        years_service = (datetime.now().date() - join_date).days // 365
        
        personnel = Personnel(
            personnel_id=personnel_id,
            name=name,
            rank=random.choice(ranks),
            unit=random.choice(units),
            base_location=random.choice(bases),
            date_of_birth=birth_date,
            date_of_joining=join_date,
            years_of_service=max(0, years_service),
            specialization=random.choice(specializations),
            status=random.choices(['Active', 'On Leave', 'Training', 'Deployed'], weights=[85, 5, 5, 5])[0],
            contact_number=f"9{random.randint(100000000, 999999999)}",
            email=f"{first_name.lower()}.{last_name.lower()}{i+1}@iaf.gov.in",
            emergency_contact=f"Emergency Contact {i+1}",
            blood_group=random.choice(blood_groups),
            marital_status=random.choice(marital_statuses),
            performance_score=round(random.uniform(60, 98), 1),
            leadership_score=round(random.uniform(50, 95), 1),
            technical_score=round(random.uniform(55, 98), 1),
            attrition_risk=round(random.uniform(0.05, 0.85), 3),
            readiness_score=round(random.uniform(70, 99), 1),
            leadership_potential=random.choice(leadership_potentials)
        )
        
        personnel_list.append(personnel)
        
        # Bulk create in batches
        if len(personnel_list) >= batch_size:
            Personnel.objects.bulk_create(personnel_list, batch_size=batch_size)
            personnel_list = []
    
    # Create remaining records
    if personnel_list:
        Personnel.objects.bulk_create(personnel_list, batch_size=batch_size)
    
    total_created = Personnel.objects.count()
    print(f"\nDatabase creation completed!")
    print(f"Total personnel records created: {total_created:,}")
    
    # Display some statistics
    print(f"\nDatabase Statistics:")
    print(f"Active Personnel: {Personnel.objects.filter(status='Active').count():,}")
    print(f"On Leave: {Personnel.objects.filter(status='On Leave').count():,}")
    print(f"In Training: {Personnel.objects.filter(status='Training').count():,}")
    print(f"Deployed: {Personnel.objects.filter(status='Deployed').count():,}")
    
    print(f"\nRank Distribution:")
    for rank, _ in Personnel.RANK_CHOICES:
        count = Personnel.objects.filter(rank=rank).count()
        print(f"{rank}: {count:,}")

if __name__ == "__main__":
    start_time = time.time()
    generate_large_dataset()
    end_time = time.time()
    print(f"\nTotal time taken: {end_time - start_time:.2f} seconds")