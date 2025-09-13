from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd

def commander_dashboard(request):
    return render(request, 'dashboards/commander.html')

def hr_dashboard(request):
    return render(request, 'dashboards/hr.html')

def medical_dashboard(request):
    return render(request, 'dashboards/medical.html')

def training_dashboard(request):
    return render(request, 'dashboards/training.html')

def personnel_dashboard(request):
    return render(request, 'dashboards/personnel.html')
