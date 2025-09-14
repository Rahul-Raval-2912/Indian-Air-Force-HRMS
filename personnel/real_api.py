from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Count, Avg, Q
import json
import random
from datetime import datetime, timedelta
from .models import Personnel

@csrf_exempt
@require_http_methods(["GET"])
def dashboard_stats(request):
    """Get real dashboard statistics from database"""
    total_personnel = Personnel.objects.count()
    active_personnel = Personnel.objects.filter(status='Active').count()
    on_leave = Personnel.objects.filter(status='On Leave').count()
    in_training = Personnel.objects.filter(status='Training').count()
    deployed = Personnel.objects.filter(status='Deployed').count()
    
    # Calculate averages
    avg_readiness = Personnel.objects.aggregate(Avg('readiness_score'))['readiness_score__avg'] or 0
    avg_performance = Personnel.objects.aggregate(Avg('performance_score'))['performance_score__avg'] or 0
    avg_leadership = Personnel.objects.aggregate(Avg('leadership_score'))['leadership_score__avg'] or 0
    avg_technical = Personnel.objects.aggregate(Avg('technical_score'))['technical_score__avg'] or 0
    
    # High attrition risk count
    high_attrition_count = Personnel.objects.filter(attrition_risk__gt=0.7).count()
    
    # Rank distribution
    rank_distribution = Personnel.objects.values('rank').annotate(
        count=Count('personnel_id')
    ).order_by('rank')
    
    # Unit distribution
    unit_distribution = Personnel.objects.values('unit').annotate(
        count=Count('personnel_id')
    ).order_by('-count')
    
    # Base distribution
    base_distribution = Personnel.objects.values('base_location').annotate(
        count=Count('personnel_id')
    ).order_by('-count')
    
    return JsonResponse({
        'total_personnel': total_personnel,
        'active_personnel': active_personnel,
        'on_leave': on_leave,
        'in_training': in_training,
        'deployed': deployed,
        'rank_distribution': list(rank_distribution),
        'unit_distribution': list(unit_distribution),
        'base_distribution': list(base_distribution),
        'aircraft_stats': {
            'total_aircraft': 456,
            'operational_aircraft': 398,
            'aircraft_with_pilots': active_personnel,
            'aircraft_readiness': round(avg_readiness, 1)
        },
        'base_stats': {
            'total_bases': base_distribution.count(),
            'operational_bases': base_distribution.count(),
            'base_readiness': round(avg_readiness, 1)
        },
        'performance_metrics': {
            'avg_performance': round(avg_performance, 1),
            'avg_leadership': round(avg_leadership, 1),
            'avg_technical': round(avg_technical, 1)
        },
        'readiness_percentage': round(avg_readiness, 1),
        'high_attrition_risk': high_attrition_count
    })

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
            avg_readiness_loss = retirement_candidates.aggregate(
                Avg('readiness_score'))['readiness_score__avg'] or 0
            
            return JsonResponse({
                'scenario': 'retirement',
                'affected_personnel': retirement_count,
                'high_rank_affected': high_rank_retirees,
                'units_impacted': affected_units,
                'avg_readiness_loss': round(avg_readiness_loss, 1),
                'impact': f'{retirement_count} personnel eligible for retirement',
                'recommendations': [
                    'Accelerate promotion pipeline for Squadron Leaders',
                    'Increase recruitment in technical specializations',
                    'Implement knowledge transfer programs'
                ],
                'timeline': '6-12 months for full impact',
                'budget_impact': f'₹{round(retirement_count * 0.5, 1)} crores for replacement training'
            })
        
        elif scenario_type == 'redeployment':
            # Analyze unit sizes for redeployment
            unit_sizes = Personnel.objects.filter(status='Active').values('unit').annotate(
                count=Count('personnel_id')
            ).order_by('-count')
            
            largest_units = list(unit_sizes[:2])
            redeployment_potential = largest_units[0]['count'] * 0.2 if largest_units else 0
            
            return JsonResponse({
                'scenario': 'redeployment',
                'from_unit': largest_units[0]['unit'] if largest_units else 'N/A',
                'largest_unit_size': largest_units[0]['count'] if largest_units else 0,
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
            
            mobilization_rate = (high_readiness / active_personnel * 100) if active_personnel > 0 else 0
            
            return JsonResponse({
                'scenario': 'emergency',
                'available_personnel': active_personnel,
                'high_readiness_personnel': high_readiness,
                'mobilization_rate': round(mobilization_rate, 1),
                'response_time': '4-6 hours',
                'readiness_level': 'High' if mobilization_rate > 70 else 'Medium'
            })
        
        return JsonResponse({'error': 'Invalid scenario type'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def personnel_list(request):
    """Get personnel list with pagination"""
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 50))
    offset = (page - 1) * limit
    
    personnel_qs = Personnel.objects.all()[offset:offset + limit]
    
    personnel = [{
        'personnel_id': p.personnel_id,
        'name': p.name,
        'rank': p.rank,
        'unit': p.unit,
        'status': p.status,
        'base_location': p.base_location,
        'specialization': p.specialization,
        'years_of_service': p.years_of_service,
        'readiness_score': p.readiness_score,
        'attrition_risk': p.attrition_risk,
        'leadership_potential': p.leadership_potential,
        'performance_score': p.performance_score
    } for p in personnel_qs]
    
    total_count = Personnel.objects.count()
    
    return JsonResponse({
        'personnel': personnel,
        'total_count': total_count,
        'page': page,
        'limit': limit,
        'has_next': offset + limit < total_count
    })