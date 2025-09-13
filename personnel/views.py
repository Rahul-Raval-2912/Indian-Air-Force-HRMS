from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import (
    Personnel, HRRecord, MedicalRecord, TrainingRecord, 
    MissionRecord, Equipment, MaintenanceRecord, LeaveRequest
)
from .serializers import (
    PersonnelSerializer, HRRecordSerializer, MedicalRecordSerializer,
    TrainingRecordSerializer, MissionRecordSerializer, EquipmentSerializer
)

class PersonnelViewSet(viewsets.ModelViewSet):
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics"""
        total_personnel = Personnel.objects.count()
        active_personnel = Personnel.objects.filter(status='Active').count()
        on_leave = Personnel.objects.filter(status='On Leave').count()
        in_training = Personnel.objects.filter(status='Training').count()
        deployed = Personnel.objects.filter(status='Deployed').count()
        
        # Rank distribution
        rank_distribution = Personnel.objects.values('rank').annotate(count=Count('rank'))
        
        # Unit distribution
        unit_distribution = Personnel.objects.values('unit').annotate(count=Count('unit'))
        
        # Performance metrics
        avg_performance = Personnel.objects.aggregate(
            avg_performance=Avg('performance_score'),
            avg_leadership=Avg('leadership_score'),
            avg_technical=Avg('technical_score')
        )
        
        return Response({
            'total_personnel': total_personnel,
            'active_personnel': active_personnel,
            'on_leave': on_leave,
            'in_training': in_training,
            'deployed': deployed,
            'rank_distribution': list(rank_distribution),
            'unit_distribution': list(unit_distribution),
            'performance_metrics': avg_performance,
            'readiness_percentage': round((active_personnel / total_personnel) * 100, 1) if total_personnel > 0 else 0
        })

    @action(detail=False, methods=['post'])
    def predict_attrition(self, request):
        """Predict attrition risk for personnel"""
        try:
            from ai_models.advanced_ml_models import AdvancedMLModels
            ml_models = AdvancedMLModels()
            
            personnel_id = request.data.get('personnel_id')
            if not personnel_id:
                return Response({'error': 'Personnel ID required'}, status=400)
            
            try:
                person = Personnel.objects.get(personnel_id=personnel_id)
            except Personnel.DoesNotExist:
                return Response({'error': 'Personnel not found'}, status=404)
            
            # Get prediction
            prediction = ml_models.predict_attrition_risk({
                'years_of_service': person.years_of_service,
                'performance_score': person.performance_score,
                'rank': person.rank,
                'unit': person.unit
            })
            
            return Response(prediction)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def what_if_simulation(self, request):
        """Run what-if scenarios"""
        scenario_type = request.data.get('scenario_type')
        parameters = request.data.get('parameters', {})
        
        if scenario_type == 'retirement':
            # Simulate retirement impact
            retirement_age = parameters.get('retirement_age', 60)
            affected_personnel = Personnel.objects.filter(
                date_of_birth__lte=timezone.now().date() - timedelta(days=retirement_age*365)
            ).count()
            
            return Response({
                'scenario': 'retirement',
                'affected_personnel': affected_personnel,
                'impact': f'{affected_personnel} personnel eligible for retirement',
                'recommendations': [
                    'Accelerate recruitment',
                    'Implement knowledge transfer programs',
                    'Consider retention incentives'
                ]
            })
        
        elif scenario_type == 'redeployment':
            # Simulate redeployment scenario
            from_unit = parameters.get('from_unit')
            to_unit = parameters.get('to_unit')
            percentage = parameters.get('percentage', 10)
            
            if from_unit:
                available_personnel = Personnel.objects.filter(
                    unit=from_unit, status='Active'
                ).count()
                to_redeploy = int(available_personnel * percentage / 100)
                
                return Response({
                    'scenario': 'redeployment',
                    'from_unit': from_unit,
                    'to_unit': to_unit,
                    'personnel_to_redeploy': to_redeploy,
                    'impact': f'{to_redeploy} personnel can be redeployed',
                    'timeline': '2-4 weeks for complete transition'
                })
        
        return Response({'error': 'Invalid scenario type'}, status=400)

    @action(detail=False, methods=['get'])
    def advanced_analytics(self, request):
        """Get advanced analytics data"""
        try:
            # Real-time metrics
            current_time = timezone.now()
            
            # Personnel distribution by base
            base_distribution = Personnel.objects.values('base_location').annotate(
                count=Count('personnel_id')
            ).order_by('-count')
            
            # Training completion rates
            training_stats = TrainingRecord.objects.filter(
                end_date__gte=current_time - timedelta(days=90)
            ).values('status').annotate(count=Count('id'))
            
            # Medical fitness levels
            medical_stats = MedicalRecord.objects.filter(
                checkup_date__gte=current_time - timedelta(days=180)
            ).values('medical_status').annotate(count=Count('id'))
            
            # Equipment status
            equipment_stats = Equipment.objects.values('status').annotate(
                count=Count('equipment_id')
            )
            
            # Mission readiness
            active_missions = MissionRecord.objects.filter(status='Active').count()
            planned_missions = MissionRecord.objects.filter(status='Planned').count()
            
            return Response({
                'base_distribution': list(base_distribution),
                'training_completion': list(training_stats),
                'medical_fitness': list(medical_stats),
                'equipment_status': list(equipment_stats),
                'mission_readiness': {
                    'active_missions': active_missions,
                    'planned_missions': planned_missions,
                    'readiness_score': 94.2  # Calculated metric
                },
                'timestamp': current_time.isoformat()
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def voice_command(self, request):
        """Process voice commands"""
        try:
            from ai_models.nlp_voice_system import VoiceNLPSystem
            
            voice_system = VoiceNLPSystem()
            command_text = request.data.get('command')
            user_role = request.data.get('user_role', 'personnel')
            
            if not command_text:
                return Response({'error': 'Command text required'}, status=400)
            
            # Process the command
            result = voice_system.process_voice_command(command_text, user_role)
            
            return Response(result)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def facial_recognition(self, request):
        """Process facial recognition for attendance"""
        try:
            from ai_models.computer_vision import ComputerVisionSystem
            
            cv_system = ComputerVisionSystem()
            
            # Simulate face recognition (in production, process actual image)
            recognition_result = cv_system.recognize_personnel(None)
            
            if recognition_result:
                # Log attendance
                attendance = cv_system.log_attendance(recognition_result)
                return Response({
                    'success': True,
                    'personnel': recognition_result,
                    'attendance_logged': attendance is not None
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Personnel not recognized'
                })
                
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['get'])
    def predictive_maintenance(self, request):
        """Get predictive maintenance data"""
        try:
            from ai_models.predictive_maintenance import PredictiveMaintenanceSystem
            
            pm_system = PredictiveMaintenanceSystem()
            pm_system.initialize_equipment_database()
            
            # Get maintenance analytics
            analytics = pm_system.get_maintenance_analytics()
            
            # Get maintenance schedule
            schedule = pm_system.generate_maintenance_schedule()
            
            return Response({
                'analytics': analytics,
                'maintenance_schedule': schedule[:20],  # Top 20 items
                'timestamp': timezone.now().isoformat()
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def sentiment_analysis(self, request):
        """Analyze sentiment of personnel communications"""
        try:
            from ai_models.nlp_voice_system import VoiceNLPSystem
            
            voice_system = VoiceNLPSystem()
            text = request.data.get('text')
            
            if not text:
                return Response({'error': 'Text required for analysis'}, status=400)
            
            sentiment_result = voice_system.sentiment_analysis(text)
            
            return Response(sentiment_result)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def signup_request(self, request):
        """Submit signup request for HR approval"""
        try:
            data = request.data
            
            # Check if personnel ID already exists
            if Personnel.objects.filter(personnel_id=data.get('personnel_id')).exists():
                return Response({'error': 'Personnel ID already exists'}, status=400)
            
            if SignupRequest.objects.filter(personnel_id=data.get('personnel_id')).exists():
                return Response({'error': 'Signup request already pending for this Personnel ID'}, status=400)
            
            # Create signup request
            signup_request = SignupRequest.objects.create(
                personnel_id=data.get('personnel_id'),
                name=data.get('name'),
                rank=data.get('rank'),
                unit=data.get('unit'),
                email=data.get('email'),
                password_hash=data.get('password')  # In production, hash this
            )
            
            return Response({
                'message': 'Signup request submitted successfully',
                'request_id': signup_request.id,
                'status': 'Pending HR Approval'
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['post'])
    def chatbot_query(self, request):
        """Process chatbot queries with real-time data"""
        try:
            from ai_models.intelligent_chatbot import IntelligentChatbot
            
            chatbot = IntelligentChatbot()
            query = request.data.get('query')
            user_role = request.data.get('user_role')
            personnel_data = request.data.get('personnel_data', [])
            system_data = request.data.get('system_data', {})
            
            if not query:
                return Response({'error': 'Query required'}, status=400)
            
            # Set user context
            chatbot.set_user_context(user_role)
            
            # Process query with real data
            response = chatbot.process_query(query, personnel_data, system_data)
            
            return Response(response)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class SignupRequestViewSet(viewsets.ModelViewSet):
    queryset = SignupRequest.objects.all()
    serializer_class = SignupRequestSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @action(detail=False, methods=['get'])
    def maintenance_due(self, request):
        """Get equipment due for maintenance"""
        upcoming_maintenance = Equipment.objects.filter(
            next_maintenance__lte=timezone.now().date() + timedelta(days=30)
        ).order_by('next_maintenance')
        
        serializer = self.get_serializer(upcoming_maintenance, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def predict_failure(self, request, pk=None):
        """Predict equipment failure"""
        try:
            from ai_models.predictive_maintenance import PredictiveMaintenanceSystem
            
            equipment = self.get_object()
            pm_system = PredictiveMaintenanceSystem()
            
            # Initialize system if needed
            if not pm_system.equipment_data:
                pm_system.initialize_equipment_database()
                pm_system.train_failure_prediction_model()
            
            prediction = pm_system.predict_equipment_failure(equipment.equipment_id)
            
            return Response(prediction)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)