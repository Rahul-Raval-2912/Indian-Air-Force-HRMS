from django.db import models
from django.contrib.auth.models import User

class Personnel(models.Model):
    RANK_CHOICES = [
        ('Pilot', 'Pilot'),
        ('Engineer', 'Engineer'),
        ('Admin', 'Admin'),
        ('Medical', 'Medical'),
        ('Ground_Staff', 'Ground Staff'),
    ]
    
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    rank = models.CharField(max_length=20, choices=RANK_CHOICES)
    unit = models.CharField(max_length=50)
    years_of_service = models.IntegerField()
    age = models.IntegerField()
    fitness_score = models.IntegerField()
    stress_index = models.IntegerField()
    missions_participated = models.IntegerField()
    mission_success_rate = models.FloatField()
    peer_review_score = models.IntegerField()
    leadership_score = models.IntegerField()
    engagement_score = models.IntegerField()
    attrition_risk = models.BooleanField()
    leadership_potential = models.CharField(max_length=10)
    readiness_score = models.IntegerField()
    
    def __str__(self):
        return f"{self.name} ({self.id})"

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('commander', 'Commander'),
        ('hr', 'HR Manager'),
        ('medical', 'Medical Officer'),
        ('training', 'Training Officer'),
        ('personnel', 'Personnel'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    unit = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
