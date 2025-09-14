from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Avg, Q
import json
import random
from datetime import datetime, timedelta
from .models import Personnel

# Mock data for testing
MOCK_PERSONNEL_DATA = {
    'total_personnel': 2847,
    'active_personnel': 2654,
    'on_leave': 89,
    'in_training': 67,
    'deployed': 37,
    'rank_distribution': [
        {'rank': 'Air Chief Marshal', 'count': 1},
        {'rank': 'Air Marshal', 'count': 3},
        {'rank': 'Air Vice Marshal', 'count': 8},
        {'rank': 'Air Commodore', 'count': 25},
        {'rank': 'Group Captain', 'count': 89},
        {'rank': 'Wing Commander', 'count': 234},
        {'rank': 'Squadron Leader', 'count': 456},
        {'rank': 'Flight Lieutenant', 'count': 789},
        {'rank': 'Flying Officer', 'count': 654},
        {'rank': 'Pilot Officer', 'count': 588}
    ],
    'unit_distribution': [
        {'unit': '101 Squadron', 'count': 245},
        {'unit': '102 Squadron', 'count': 198},
        {'unit': '201 Squadron', 'count': 234},
        {'unit': '301 Squadron', 'count': 189},
        {'unit': 'Air Traffic Control', 'count': 156},
        {'unit': 'Maintenance Wing', 'count': 567},
        {'unit': 'Intelligence Wing', 'count': 89},
        {'unit': 'Medical Wing', 'count': 123},
        {'unit': 'Training Command', 'count': 1046}
    ],
    'base_distribution': [
        {'base_location': 'Hindon Air Force Station', 'count': 567},
        {'base_location': 'Palam Air Force Station', 'count': 489},
        {'base_location': 'Pune Air Force Station', 'count': 423},
        {'base_location': 'Jodhpur Air Force Station', 'count': 678},
        {'base_location': 'Bangalore Air Force Station', 'count': 690}
    ],
    'aircraft_stats': {
        'total_aircraft': 456,
        'operational_aircraft': 398,
        'aircraft_with_pilots': 367,
        'aircraft_readiness': 87.3
    },
    'base_stats': {
        'total_bases': 15,
        'operational_bases': 14,
        'base_readiness': 93.3
    },
    'performance_metrics': {
        'avg_performance': 84.2,
        'avg_leadership': 78.9,
        'avg_technical': 82.1
    },
    'readiness_percentage': 93.2
}

@csrf_exempt
@require_http_methods(["GET"])
def dashboard_stats(request):
    """Get dashboard statistics from real database"""
    try:
        # Fast database queries
        total_personnel = Personnel.objects.count()
        if total_personnel > 0:
            active_personnel = Personnel.objects.filter(status='Active').count()
            avg_readiness = Personnel.objects.aggregate(Avg('readiness_score'))['readiness_score__avg'] or 82.5
            high_attrition_count = Personnel.objects.filter(attrition_risk__gt=0.7).count()
            
            # Get top 5 units only for speed
            units = dict(Personnel.objects.values('unit').annotate(
                count=Count('personnel_id')
            ).order_by('-count')[:5].values_list('unit', 'count'))
            
            # Get rank distribution
            ranks = dict(Personnel.objects.values('rank').annotate(
                count=Count('personnel_id')
            ).values_list('rank', 'count'))
            
            return JsonResponse({
                'total_personnel': total_personnel,
                'active_personnel': active_personnel,
                'on_leave': total_personnel - active_personnel,
                'avg_readiness': round(avg_readiness, 1),
                'high_attrition_risk': high_attrition_count,
                'high_leadership_potential': int(total_personnel * 0.125),
                'operational_readiness': round(avg_readiness, 1),
                'units': units,
                'ranks': ranks,
                'aircraft_stats': {
                    'total_aircraft': 456,
                    'operational_aircraft': 398,
                    'aircraft_readiness': round(avg_readiness, 1)
                },
                'status': 'live_data'
            })
        else:
            raise Exception('No data')
    except Exception as e:
        # Fast fallback data
        return JsonResponse({
            'total_personnel': 500000,
            'active_personnel': 425000,
            'on_leave': 25000,
            'avg_readiness': 82.5,
            'high_attrition_risk': 42500,
            'high_leadership_potential': 62500,
            'operational_readiness': 87.3,
            'units': {
                '1 Squadron': 2500,
                '2 Squadron': 2400,
                '3 Squadron': 2300,
                '4 Squadron': 2200,
                '5 Squadron': 2100
            },
            'ranks': {
                'Air Marshal': 50,
                'Group Captain': 5000,
                'Wing Commander': 15000,
                'Squadron Leader': 25000,
                'Flight Lieutenant': 50000
            },
            'aircraft_stats': {
                'total_aircraft': 456,
                'operational_aircraft': 398,
                'aircraft_readiness': 87.3
            },
            'status': 'mock_data'
        })

@csrf_exempt
@require_http_methods(["POST"])
def predict_attrition(request):
    """Predict attrition risk"""
    try:
        data = json.loads(request.body)
        personnel_id = data.get('personnel_id')
        
        # Mock prediction
        risk_score = random.uniform(0.1, 0.9)
        risk_level = 'Low' if risk_score < 0.3 else 'Medium' if risk_score < 0.7 else 'High'
        
        return JsonResponse({
            'personnel_id': personnel_id,
            'attrition_risk': round(risk_score, 3),
            'risk_level': risk_level,
            'factors': [
                'Years of service: 15 years',
                'Performance score: 85.2',
                'Recent training completion: Yes',
                'Leave balance: 12 days'
            ],
            'recommendations': [
                'Consider career development opportunities',
                'Schedule performance review',
                'Evaluate work-life balance'
            ]
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def what_if_simulation(request):
    """Run what-if scenarios with real data"""
    try:
        data = json.loads(request.body)
        scenario_type = data.get('scenario_type')
        
        if scenario_type == 'retirement':
            # Find personnel near retirement (high years of service)
            retirement_candidates = Personnel.objects.filter(years_of_service__gte=20)
            retirement_count = retirement_candidates.count()
            
            high_rank_retirees = retirement_candidates.filter(
                rank__in=['Air Marshal', 'Air Vice Marshal', 'Air Commodore']
            ).count()
            
            affected_units = retirement_candidates.values('unit').distinct().count()
            
            return JsonResponse({
                'scenario': 'retirement',
                'affected_personnel': retirement_count,
                'high_rank_affected': high_rank_retirees,
                'units_impacted': affected_units,
                'impact': f'{retirement_count} personnel eligible for retirement in next 2 years',
                'recommendations': [
                    'Accelerate recruitment by 15%',
                    'Implement knowledge transfer programs',
                    'Consider retention incentives for critical roles'
                ],
                'timeline': '24 months',
                'budget_impact': f'₹{round(retirement_count * 0.5, 1)} crores for replacement training'
            })
        
        elif scenario_type == 'redeployment':
            # Analyze unit sizes for redeployment
            unit_sizes = Personnel.objects.filter(status='Active').values('unit').annotate(
                count=Count('personnel_id')
            ).order_by('-count')
            
            largest_units = list(unit_sizes[:2])
            redeployment_potential = largest_units[0]['count'] * 0.2 if largest_units else 25
            
            return JsonResponse({
                'scenario': 'redeployment',
                'from_unit': largest_units[0]['unit'] if largest_units else '1 Squadron',
                'to_unit': largest_units[1]['unit'] if len(largest_units) > 1 else '2 Squadron',
                'personnel_to_redeploy': round(redeployment_potential),
                'impact': f'{round(redeployment_potential)} personnel can be redeployed effectively',
                'timeline': '6-8 weeks for complete transition',
                'training_required': '2 weeks specialized training'
            })
        
        elif scenario_type == 'emergency':
            # Emergency mobilization analysis
            active_personnel = Personnel.objects.filter(status='Active').count()
            high_readiness = Personnel.objects.filter(
                status='Active',
                readiness_score__gte=85
            ).count()
            
            return JsonResponse({
                'scenario': 'emergency',
                'available_personnel': active_personnel,
                'high_readiness_personnel': high_readiness,
                'mobilization_rate': round((high_readiness / active_personnel * 100), 1) if active_personnel > 0 else 0,
                'response_time': '4-6 hours',
                'readiness_level': 'High' if high_readiness > active_personnel * 0.7 else 'Medium'
            })
        
        return JsonResponse({'error': 'Invalid scenario type'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def advanced_analytics(request):
    """Get advanced analytics data"""
    return JsonResponse({
        'base_distribution': MOCK_PERSONNEL_DATA['base_distribution'],
        'training_completion': [
            {'status': 'Completed', 'count': 234},
            {'status': 'In Progress', 'count': 67},
            {'status': 'Scheduled', 'count': 89}
        ],
        'medical_fitness': [
            {'medical_status': 'Fit', 'count': 2456},
            {'medical_status': 'Temporary Unfit', 'count': 23},
            {'medical_status': 'Under Review', 'count': 12}
        ],
        'equipment_status': [
            {'status': 'Operational', 'count': 1234},
            {'status': 'Maintenance', 'count': 89},
            {'status': 'Repair', 'count': 23}
        ],
        'mission_readiness': {
            'active_missions': 12,
            'planned_missions': 8,
            'readiness_score': 94.2
        },
        'timestamp': datetime.now().isoformat()
    })

@csrf_exempt
@require_http_methods(["POST"])
def voice_command(request):
    """Process voice commands"""
    try:
        data = json.loads(request.body)
        command = data.get('command', '').lower()
        
        if 'personnel' in command or 'staff' in command:
            return JsonResponse({
                'response': f'Current personnel strength: {MOCK_PERSONNEL_DATA["total_personnel"]} officers. {MOCK_PERSONNEL_DATA["active_personnel"]} are currently active.',
                'action': 'personnel_info',
                'data': {
                    'total': MOCK_PERSONNEL_DATA["total_personnel"],
                    'active': MOCK_PERSONNEL_DATA["active_personnel"]
                }
            })
        
        elif 'aircraft' in command or 'plane' in command:
            return JsonResponse({
                'response': f'Aircraft status: {MOCK_PERSONNEL_DATA["aircraft_stats"]["operational_aircraft"]} out of {MOCK_PERSONNEL_DATA["aircraft_stats"]["total_aircraft"]} aircraft are operational.',
                'action': 'aircraft_status',
                'data': MOCK_PERSONNEL_DATA["aircraft_stats"]
            })
        
        elif 'readiness' in command:
            return JsonResponse({
                'response': f'Current readiness level: {MOCK_PERSONNEL_DATA["readiness_percentage"]}%. All systems operational.',
                'action': 'readiness_check',
                'data': {'readiness': MOCK_PERSONNEL_DATA["readiness_percentage"]}
            })
        
        else:
            return JsonResponse({
                'response': 'Command processed. How can I assist you with IAF operations?',
                'action': 'general_response',
                'suggestions': [
                    'Check personnel status',
                    'Aircraft readiness report',
                    'Mission briefing',
                    'Training schedule'
                ]
            })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_query(request):
    """Process chatbot queries"""
    try:
        data = json.loads(request.body)
        query = data.get('query', '').lower()
        
        responses = {
            'personnel': f'We currently have {MOCK_PERSONNEL_DATA["total_personnel"]} personnel across all units.',
            'aircraft': f'{MOCK_PERSONNEL_DATA["aircraft_stats"]["operational_aircraft"]} aircraft are operational.',
            'training': 'Training programs are running smoothly with 234 completions this month.',
            'mission': 'All missions are on schedule with 94.2% readiness score.',
            'leave': 'Leave applications can be submitted through the personnel dashboard.',
            'medical': 'Medical checkups are scheduled monthly for all active personnel.'
        }
        
        for key, response in responses.items():
            if key in query:
                return JsonResponse({
                    'response': response,
                    'confidence': 0.95,
                    'suggestions': ['Tell me more', 'Show statistics', 'What else?']
                })
        
        return JsonResponse({
            'response': 'I can help you with personnel, aircraft, training, missions, leave, and medical queries. What would you like to know?',
            'confidence': 0.8,
            'suggestions': ['Personnel status', 'Aircraft readiness', 'Training programs', 'Mission updates']
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)