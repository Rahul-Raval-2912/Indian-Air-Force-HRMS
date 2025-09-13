import os
import django
import sys
import csv
from datetime import datetime, timedelta
from faker import Faker
import random

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from personnel.models import Personnel, AirBase, Aircraft, Squadron

fake = Faker('en_IN')

# IAF Air Bases
AIR_BASES = [
    {'name': 'Hindon Air Base', 'location': 'Ghaziabad', 'state': 'Uttar Pradesh', 'type': 'Transport'},
    {'name': 'Pathankot Air Base', 'location': 'Pathankot', 'state': 'Punjab', 'type': 'Fighter'},
    {'name': 'Jodhpur Air Base', 'location': 'Jodhpur', 'state': 'Rajasthan', 'type': 'Fighter'},
    {'name': 'Pune Air Base', 'location': 'Pune', 'state': 'Maharashtra', 'type': 'Training'},
    {'name': 'Kalaikunda Air Base', 'location': 'Kalaikunda', 'state': 'West Bengal', 'type': 'Fighter'},
    {'name': 'Ambala Air Base', 'location': 'Ambala', 'state': 'Haryana', 'type': 'Fighter'},
    {'name': 'Halwara Air Base', 'location': 'Halwara', 'state': 'Punjab', 'type': 'Fighter'},
    {'name': 'Jamnagar Air Base', 'location': 'Jamnagar', 'state': 'Gujarat', 'type': 'Fighter'},
    {'name': 'Bidar Air Base', 'location': 'Bidar', 'state': 'Karnataka', 'type': 'Training'},
    {'name': 'Sulur Air Base', 'location': 'Sulur', 'state': 'Tamil Nadu', 'type': 'Transport'},
]

# IAF Squadrons
SQUADRONS = [
    {'name': 'No. 1 Squadron "The Tigers"', 'type': 'Fighter'},
    {'name': 'No. 7 Squadron "Battle Axes"', 'type': 'Fighter'},
    {'name': 'No. 17 Squadron "Golden Arrows"', 'type': 'Fighter'},
    {'name': 'No. 26 Squadron "Warriors"', 'type': 'Fighter'},
    {'name': 'No. 32 Squadron "Thunderbirds"', 'type': 'Fighter'},
    {'name': 'No. 44 Squadron "Mighty Jets"', 'type': 'Fighter'},
    {'name': 'No. 101 Squadron "Falcons"', 'type': 'Transport'},
    {'name': 'No. 109 Squadron "Knights"', 'type': 'Helicopter'},
    {'name': 'No. 114 Squadron "Siachen Pioneers"', 'type': 'Helicopter'},
    {'name': 'No. 130 Squadron "Condors"', 'type': 'Transport'},
]

# Aircraft Models
AIRCRAFT_MODELS = {
    'Fighter': ['Sukhoi Su-30MKI', 'Mirage 2000', 'MiG-29', 'Tejas LCA', 'Rafale'],
    'Transport': ['C-130J Super Hercules', 'An-32', 'Boeing C-17', 'Dornier Do 228'],
    'Helicopter': ['Mi-17', 'Mi-26', 'Dhruv ALH', 'Apache AH-64E', 'Chinook CH-47F'],
    'Trainer': ['Hawk Mk 132', 'Pilatus PC-7', 'Kiran Mk II', 'HJT-16 Kiran']
}

def create_air_bases():
    """Create air base records"""
    print("Creating Air Base records...")
    
    for i, base_data in enumerate(AIR_BASES):
        base_id = f"AFB-{str(i+1).zfill(3)}"
        
        air_base, created = AirBase.objects.get_or_create(
            base_id=base_id,
            defaults={
                'name': base_data['name'],
                'location': base_data['location'],
                'state': base_data['state'],
                'base_type': base_data['type'],
                'status': 'Operational',
                'established_date': fake.date_between(start_date='-50y', end_date='-10y'),
                'runway_count': random.randint(1, 3),
                'hangar_capacity': random.randint(20, 100),
                'personnel_capacity': random.randint(500, 2000),
                'current_personnel': random.randint(300, 1500)
            }
        )
        
        if created:
            print(f"Created: {air_base.name}")

def create_squadrons():
    """Create squadron records"""
    print("Creating Squadron records...")
    
    bases = list(AirBase.objects.all())
    
    for i, squadron_data in enumerate(SQUADRONS):
        squadron_id = f"SQN-{str(i+1).zfill(3)}"
        base = random.choice(bases)
        
        squadron, created = Squadron.objects.get_or_create(
            squadron_id=squadron_id,
            defaults={
                'name': squadron_data['name'],
                'squadron_type': squadron_data['type'],
                'base': base,
                'aircraft_count': random.randint(12, 24),
                'personnel_count': random.randint(50, 150),
                'established_date': fake.date_between(start_date='-40y', end_date='-5y')
            }
        )
        
        if created:
            print(f"Created: {squadron.name} at {base.name}")

def create_aircraft():
    """Create aircraft records"""
    print("Creating Aircraft records...")
    
    squadrons = list(Squadron.objects.all())
    aircraft_count = 0
    
    for squadron in squadrons:
        # Determine aircraft type based on squadron type
        if squadron.squadron_type in AIRCRAFT_MODELS:
            models = AIRCRAFT_MODELS[squadron.squadron_type]
        else:
            models = AIRCRAFT_MODELS['Fighter']  # Default
        
        # Create aircraft for each squadron
        num_aircraft = random.randint(8, 16)
        
        for i in range(num_aircraft):
            aircraft_count += 1
            aircraft_id = f"IAF-{str(aircraft_count).zfill(4)}"
            model = random.choice(models)
            
            aircraft, created = Aircraft.objects.get_or_create(
                aircraft_id=aircraft_id,
                defaults={
                    'model': model,
                    'aircraft_type': squadron.squadron_type,
                    'status': random.choice(['Operational', 'Maintenance', 'Operational', 'Operational']),
                    'base': squadron.base,
                    'squadron': squadron.name,
                    'manufactured_date': fake.date_between(start_date='-20y', end_date='-2y'),
                    'last_maintenance': fake.date_between(start_date='-30d', end_date='today'),
                    'next_maintenance': fake.date_between(start_date='today', end_date='+60d'),
                    'flight_hours': random.randint(500, 8000),
                    'crew_required': 1 if squadron.squadron_type == 'Fighter' else random.randint(2, 6)
                }
            )
            
            if created:
                print(f"Created: {aircraft.model} ({aircraft_id}) at {squadron.base.name}")

def assign_personnel_to_bases_and_aircraft():
    """Update existing personnel with base locations and aircraft assignments"""
    print("Updating personnel with base locations and aircraft assignments...")
    
    personnel = Personnel.objects.all()
    bases = list(AirBase.objects.all())
    aircraft = list(Aircraft.objects.filter(status='Operational'))
    
    # Update personnel with base locations
    for person in personnel:
        if not person.base_location or person.base_location in ['Base A', 'Base B', 'Base C']:
            base = random.choice(bases)
            person.base_location = base.name
            person.save()
    
    # Assign pilots to aircraft
    pilots = personnel.filter(specialization='Pilot')
    available_aircraft = [a for a in aircraft if not a.pilot_assigned]
    
    for pilot in pilots[:len(available_aircraft)]:
        if available_aircraft:
            aircraft_to_assign = random.choice(available_aircraft)
            aircraft_to_assign.pilot_assigned = pilot
            aircraft_to_assign.save()
            available_aircraft.remove(aircraft_to_assign)
            print(f"Assigned {pilot.name} to {aircraft_to_assign.model} ({aircraft_to_assign.aircraft_id})")

def generate_csv_reports():
    """Generate CSV reports for aircraft and bases"""
    print("Generating CSV reports...")
    
    # Air Bases Report
    with open('air_bases_report.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Base ID', 'Name', 'Location', 'State', 'Type', 'Status', 'Personnel', 'Aircraft Count'])
        
        for base in AirBase.objects.all():
            aircraft_count = Aircraft.objects.filter(base=base).count()
            writer.writerow([
                base.base_id, base.name, base.location, base.state,
                base.base_type, base.status, base.current_personnel, aircraft_count
            ])
    
    # Aircraft Report
    with open('aircraft_report.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Aircraft ID', 'Model', 'Type', 'Status', 'Base', 'Squadron', 'Pilot', 'Flight Hours'])
        
        for aircraft in Aircraft.objects.all():
            pilot_name = aircraft.pilot_assigned.name if aircraft.pilot_assigned else 'Unassigned'
            writer.writerow([
                aircraft.aircraft_id, aircraft.model, aircraft.aircraft_type,
                aircraft.status, aircraft.base.name, aircraft.squadron,
                pilot_name, aircraft.flight_hours
            ])
    
    # Squadron Report
    with open('squadrons_report.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Squadron ID', 'Name', 'Type', 'Base', 'Aircraft Count', 'Personnel Count'])
        
        for squadron in Squadron.objects.all():
            writer.writerow([
                squadron.squadron_id, squadron.name, squadron.squadron_type,
                squadron.base.name, squadron.aircraft_count, squadron.personnel_count
            ])

def main():
    """Main function to create all aircraft and base data"""
    print("=== IAF Aircraft and Base Data Generation ===")
    
    try:
        # Create base infrastructure
        create_air_bases()
        create_squadrons()
        create_aircraft()
        
        # Update personnel assignments
        assign_personnel_to_bases_and_aircraft()
        
        # Generate reports
        generate_csv_reports()
        
        # Print summary
        print("\n=== Summary ===")
        print(f"Air Bases: {AirBase.objects.count()}")
        print(f"Squadrons: {Squadron.objects.count()}")
        print(f"Aircraft: {Aircraft.objects.count()}")
        print(f"Personnel: {Personnel.objects.count()}")
        print(f"Assigned Aircraft: {Aircraft.objects.filter(pilot_assigned__isnull=False).count()}")
        
        print("\n✅ Aircraft and Base data generation completed successfully!")
        print("📊 CSV reports generated: air_bases_report.csv, aircraft_report.csv, squadrons_report.csv")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()