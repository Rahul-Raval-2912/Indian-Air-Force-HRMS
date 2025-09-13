from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta

class Personnel(models.Model):
    RANK_CHOICES = [
        ('Air Chief Marshal', 'Air Chief Marshal'),
        ('Air Marshal', 'Air Marshal'),
        ('Air Vice Marshal', 'Air Vice Marshal'),
        ('Air Commodore', 'Air Commodore'),
        ('Group Captain', 'Group Captain'),
        ('Wing Commander', 'Wing Commander'),
        ('Squadron Leader', 'Squadron Leader'),
        ('Flight Lieutenant', 'Flight Lieutenant'),
        ('Flying Officer', 'Flying Officer'),
        ('Pilot Officer', 'Pilot Officer'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('On Leave', 'On Leave'),
        ('Training', 'Training'),
        ('Deployed', 'Deployed'),
        ('Retired', 'Retired'),
    ]

    personnel_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    rank = models.CharField(max_length=50, choices=RANK_CHOICES)
    unit = models.CharField(max_length=100)
    base_location = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    date_of_joining = models.DateField()
    years_of_service = models.IntegerField()
    specialization = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    contact_number = models.CharField(max_length=15)
    email = models.EmailField()
    emergency_contact = models.CharField(max_length=100)
    blood_group = models.CharField(max_length=5)
    marital_status = models.CharField(max_length=20)
    
    # Performance metrics
    performance_score = models.FloatField(default=0.0)
    leadership_score = models.FloatField(default=0.0)
    technical_score = models.FloatField(default=0.0)
    
    # AI predictions
    attrition_risk = models.FloatField(default=0.0)
    readiness_score = models.FloatField(default=0.0)
    leadership_potential = models.CharField(max_length=20, default='Medium')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.rank} {self.name} ({self.personnel_id})"

    class Meta:
        ordering = ['rank', 'name']

class SignupRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending HR Approval'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    
    personnel_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    rank = models.CharField(max_length=50)
    unit = models.CharField(max_length=100)
    email = models.EmailField()
    password_hash = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.CharField(max_length=100, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.personnel_id}) - {self.status}"

class HRRecord(models.Model):
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='hr_records')
    record_type = models.CharField(max_length=50)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.personnel.name} - {self.record_type}"

class MedicalRecord(models.Model):
    MEDICAL_STATUS_CHOICES = [
        ('Fit', 'Fit'),
        ('Temporary Unfit', 'Temporary Unfit'),
        ('Permanent Unfit', 'Permanent Unfit'),
        ('Under Review', 'Under Review'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='medical_records')
    checkup_date = models.DateField()
    medical_status = models.CharField(max_length=20, choices=MEDICAL_STATUS_CHOICES)
    height = models.FloatField()  # in cm
    weight = models.FloatField()  # in kg
    blood_pressure = models.CharField(max_length=20)
    heart_rate = models.IntegerField()
    vision_status = models.CharField(max_length=50)
    hearing_status = models.CharField(max_length=50)
    fitness_level = models.CharField(max_length=20)
    medical_notes = models.TextField(blank=True)
    next_checkup = models.DateField()
    
    def __str__(self):
        return f"{self.personnel.name} - Medical Record ({self.checkup_date})"

class TrainingRecord(models.Model):
    TRAINING_STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='training_records')
    course_name = models.CharField(max_length=200)
    course_type = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=TRAINING_STATUS_CHOICES)
    score = models.FloatField(null=True, blank=True)
    instructor = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    certification_earned = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"{self.personnel.name} - {self.course_name}"

class MissionRecord(models.Model):
    MISSION_STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('Active', 'Active'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    mission_id = models.CharField(max_length=20, unique=True)
    mission_name = models.CharField(max_length=200)
    mission_type = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=MISSION_STATUS_CHOICES)
    location = models.CharField(max_length=100)
    description = models.TextField()
    personnel = models.ManyToManyField(Personnel, through='MissionAssignment')
    
    def __str__(self):
        return f"{self.mission_name} ({self.mission_id})"

class MissionAssignment(models.Model):
    ROLE_CHOICES = [
        ('Commander', 'Commander'),
        ('Pilot', 'Pilot'),
        ('Navigator', 'Navigator'),
        ('Engineer', 'Engineer'),
        ('Support', 'Support'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE)
    mission = models.ForeignKey(MissionRecord, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    assigned_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.personnel.name} - {self.mission.mission_name} ({self.role})"

class Equipment(models.Model):
    EQUIPMENT_STATUS_CHOICES = [
        ('Operational', 'Operational'),
        ('Maintenance', 'Maintenance'),
        ('Repair', 'Repair'),
        ('Decommissioned', 'Decommissioned'),
    ]
    
    equipment_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=EQUIPMENT_STATUS_CHOICES)
    location = models.CharField(max_length=100)
    assigned_personnel = models.ForeignKey(Personnel, on_delete=models.SET_NULL, null=True, blank=True)
    last_maintenance = models.DateField()
    next_maintenance = models.DateField()
    
    def __str__(self):
        return f"{self.name} ({self.equipment_id})"

class MaintenanceRecord(models.Model):
    MAINTENANCE_TYPE_CHOICES = [
        ('Routine', 'Routine'),
        ('Preventive', 'Preventive'),
        ('Corrective', 'Corrective'),
        ('Emergency', 'Emergency'),
    ]
    
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    scheduled_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    technician = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.equipment.name} - {self.maintenance_type} ({self.scheduled_date})"

class LeaveRequest(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('Annual', 'Annual Leave'),
        ('Medical', 'Medical Leave'),
        ('Emergency', 'Emergency Leave'),
        ('Maternity', 'Maternity Leave'),
        ('Study', 'Study Leave'),
    ]
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.CharField(max_length=100, blank=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.personnel.name} - {self.leave_type} ({self.start_date} to {self.end_date})"

class Skill(models.Model):
    SKILL_LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=100)
    skill_category = models.CharField(max_length=50)
    proficiency_level = models.CharField(max_length=20, choices=SKILL_LEVEL_CHOICES)
    years_of_experience = models.IntegerField()
    certified = models.BooleanField(default=False)
    certification_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.personnel.name} - {self.skill_name} ({self.proficiency_level})"

class PerformanceReview(models.Model):
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='performance_reviews')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    overall_rating = models.FloatField()
    leadership_rating = models.FloatField()
    technical_rating = models.FloatField()
    communication_rating = models.FloatField()
    teamwork_rating = models.FloatField()
    goals_achieved = models.TextField()
    areas_for_improvement = models.TextField()
    reviewer_name = models.CharField(max_length=100)
    review_date = models.DateField()
    
    def __str__(self):
        return f"{self.personnel.name} - Performance Review ({self.review_date})"

class Deployment(models.Model):
    DEPLOYMENT_STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('Active', 'Active'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='deployments')
    deployment_name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=DEPLOYMENT_STATUS_CHOICES)
    purpose = models.TextField()
    
    def __str__(self):
        return f"{self.personnel.name} - {self.deployment_name}"

class AirBase(models.Model):
    BASE_TYPE_CHOICES = [
        ('Fighter', 'Fighter Base'),
        ('Transport', 'Transport Base'),
        ('Training', 'Training Base'),
        ('Helicopter', 'Helicopter Base'),
        ('Strategic', 'Strategic Base'),
    ]
    
    STATUS_CHOICES = [
        ('Operational', 'Operational'),
        ('Maintenance', 'Under Maintenance'),
        ('Standby', 'Standby'),
        ('Decommissioned', 'Decommissioned'),
    ]
    
    base_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    base_type = models.CharField(max_length=20, choices=BASE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Operational')
    established_date = models.DateField()
    runway_count = models.IntegerField(default=1)
    hangar_capacity = models.IntegerField()
    personnel_capacity = models.IntegerField()
    current_personnel = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.name} ({self.base_id})"

class Aircraft(models.Model):
    AIRCRAFT_TYPE_CHOICES = [
        ('Fighter', 'Fighter Aircraft'),
        ('Transport', 'Transport Aircraft'),
        ('Helicopter', 'Helicopter'),
        ('Trainer', 'Training Aircraft'),
        ('Reconnaissance', 'Reconnaissance Aircraft'),
        ('Tanker', 'Air-to-Air Refueling'),
    ]
    
    STATUS_CHOICES = [
        ('Operational', 'Operational'),
        ('Maintenance', 'Under Maintenance'),
        ('Repair', 'Under Repair'),
        ('Grounded', 'Grounded'),
        ('Decommissioned', 'Decommissioned'),
    ]
    
    aircraft_id = models.CharField(max_length=20, unique=True, primary_key=True)
    model = models.CharField(max_length=100)
    aircraft_type = models.CharField(max_length=20, choices=AIRCRAFT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Operational')
    base = models.ForeignKey(AirBase, on_delete=models.CASCADE, related_name='aircraft')
    squadron = models.CharField(max_length=100)
    manufactured_date = models.DateField()
    last_maintenance = models.DateField()
    next_maintenance = models.DateField()
    flight_hours = models.IntegerField(default=0)
    pilot_assigned = models.ForeignKey(Personnel, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_aircraft')
    crew_required = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.model} ({self.aircraft_id})"

class Squadron(models.Model):
    SQUADRON_TYPE_CHOICES = [
        ('Fighter', 'Fighter Squadron'),
        ('Transport', 'Transport Squadron'),
        ('Helicopter', 'Helicopter Squadron'),
        ('Training', 'Training Squadron'),
        ('Special Ops', 'Special Operations'),
    ]
    
    squadron_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    squadron_type = models.CharField(max_length=20, choices=SQUADRON_TYPE_CHOICES)
    base = models.ForeignKey(AirBase, on_delete=models.CASCADE, related_name='squadrons')
    commander = models.ForeignKey(Personnel, on_delete=models.SET_NULL, null=True, related_name='commanded_squadron')
    aircraft_count = models.IntegerField(default=0)
    personnel_count = models.IntegerField(default=0)
    established_date = models.DateField()
    
    def __str__(self):
        return f"{self.name} ({self.squadron_id})"