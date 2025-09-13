from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/commander/', views.commander_dashboard, name='commander_dashboard'),
    path('dashboard/hr/', views.hr_dashboard, name='hr_dashboard'),
    path('dashboard/medical/', views.medical_dashboard, name='medical_dashboard'),
    path('dashboard/training/', views.training_dashboard, name='training_dashboard'),
    path('dashboard/personnel/', views.personnel_dashboard, name='personnel_dashboard'),
]
