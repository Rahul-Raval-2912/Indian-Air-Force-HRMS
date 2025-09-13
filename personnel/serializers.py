from rest_framework import serializers
from .models import (
    Personnel, HRRecord, MedicalRecord, TrainingRecord, 
    MissionRecord, Equipment, MaintenanceRecord, LeaveRequest,
    Skill, PerformanceReview, Deployment, SignupRequest
)

class PersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = '__all__'

class HRRecordSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    
    class Meta:
        model = HRRecord
        fields = '__all__'

class MedicalRecordSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    bmi = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalRecord
        fields = '__all__'
    
    def get_bmi(self, obj):
        if obj.height and obj.weight:
            height_m = obj.height / 100  # Convert cm to meters
            return round(obj.weight / (height_m ** 2), 2)
        return None

class TrainingRecordSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingRecord
        fields = '__all__'
    
    def get_duration_days(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).days
        return None

class MissionRecordSerializer(serializers.ModelSerializer):
    assigned_personnel_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MissionRecord
        fields = '__all__'
    
    def get_assigned_personnel_count(self, obj):
        return obj.personnel.count()

class EquipmentSerializer(serializers.ModelSerializer):
    assigned_personnel_name = serializers.CharField(source='assigned_personnel.name', read_only=True)
    maintenance_due_days = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipment
        fields = '__all__'
    
    def get_maintenance_due_days(self, obj):
        if obj.next_maintenance:
            from datetime import date
            return (obj.next_maintenance - date.today()).days
        return None

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    
    class Meta:
        model = MaintenanceRecord
        fields = '__all__'

class LeaveRequestSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    
    class Meta:
        model = Skill
        fields = '__all__'

class PerformanceReviewSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    
    class Meta:
        model = PerformanceReview
        fields = '__all__'

class DeploymentSerializer(serializers.ModelSerializer):
    personnel_name = serializers.CharField(source='personnel.name', read_only=True)
    duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = Deployment
        fields = '__all__'
    
    def get_duration_days(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).days
        return None

class SignupRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SignupRequest
        fields = '__all__'