from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random

@csrf_exempt
def personnel_list(request):
    """API endpoint for personnel data"""
    try:
        # Generate mock personnel data
        air_bases = ['Hindon Air Base', 'Pathankot Air Base', 'Jodhpur Air Base', 'Pune Air Base', 'Kalaikunda Air Base']
        squadrons = ['No. 1 Squadron', 'No. 7 Squadron', 'No. 17 Squadron', 'No. 26 Squadron', 'No. 32 Squadron']
        ranks = ['Wing Commander', 'Squadron Leader', 'Flight Lieutenant']
        specializations = ['Pilot', 'Engineer', 'Navigator', 'Support']
        
        personnel_data = []
        for i in range(100):
            personnel_data.append({
                'id': i + 1,
                'name': f'Officer {i + 1}',
                'rank': ranks[i % 3],
                'unit': squadrons[i % 5],
                'base_location': air_bases[i % 5],
                'age': 25 + random.randint(0, 30),
                'years_of_service': random.randint(5, 30),
                'readiness_score': random.randint(70, 100),
                'specialization': specializations[i % 4],
                'aircraft_assigned': f'IAF-{1000 + i}' if i % 3 == 0 else None
            })
        
        return JsonResponse(personnel_data, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)