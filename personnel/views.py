from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
import json
import pandas as pd
from .models import Personnel
from ai_models.ml_models import IAFMLModels

class PersonnelViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ml_models = IAFMLModels()
        self.ml_models.load_models()
    
    def list(self, request):
        # Load data from CSV for demo
        try:
            df = pd.read_csv('personnel_data.csv')
            data = df.to_dict('records')
            return Response(data[:100])  # Return first 100 records
        except:
            return Response([])
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        try:
            df = pd.read_csv('personnel_data.csv')
            
            stats = {
                'total_personnel': len(df),
                'high_attrition_risk': len(df[df['attrition_risk'] == 1]),
                'avg_readiness': df['readiness_score'].mean(),
                'units': df['unit'].value_counts().to_dict(),
                'ranks': df['rank'].value_counts().to_dict(),
                'high_leadership_potential': len(df[df['leadership_potential'] == 'high'])
            }
            
            return Response(stats)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def predict_attrition(self, request):
        try:
            personnel_data = request.data
            risk = self.ml_models.predict_attrition_risk(personnel_data)
            return Response({'attrition_risk': float(risk)})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['post'])
    def predict_readiness(self, request):
        try:
            personnel_data = request.data
            readiness = self.ml_models.predict_readiness(personnel_data)
            return Response({'readiness_score': float(readiness)})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def skill_recommendations(self, request):
        unit = request.query_params.get('unit', 'Airbase1')
        skills = request.query_params.get('skills', 'fighter_jets').split(',')
        
        recommendations = self.ml_models.get_skill_recommendations(unit, skills)
        return Response(recommendations)
    
    @action(detail=False, methods=['post'])
    def what_if_simulation(self, request):
        scenario = request.data.get('scenario', 'retirement')
        affected_personnel = request.data.get('personnel_ids', [])
        
        # Mock simulation results
        results = {
            'scenario': scenario,
            'affected_count': len(affected_personnel),
            'readiness_impact': -15.5,
            'skill_gaps': ['fighter_jets', 'radar_ops'],
            'recommended_actions': [
                'Recruit 5 new pilots',
                'Cross-train 3 engineers in radar operations',
                'Accelerate training for 2 junior officers'
            ]
        }
        
        return Response(results)
