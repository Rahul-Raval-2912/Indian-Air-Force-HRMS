from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonnelViewSet
from . import simple_api, real_api, strategic_api

router = DefaultRouter()
router.register(r'personnel', PersonnelViewSet, basename='personnel')

urlpatterns = [
    path('api/', include(router.urls)),
    # Real API endpoints using database
    path('api/personnel/dashboard_stats/', real_api.dashboard_stats, name='dashboard_stats'),
    path('api/personnel/what_if_simulation/', real_api.what_if_simulation, name='what_if_simulation'),
    # Strategic planning API
    path('api/personnel/', strategic_api.personnel_list, name='strategic_personnel'),
    # Mock API endpoints (fallback)
    path('api/personnel/predict_attrition/', simple_api.predict_attrition, name='predict_attrition'),
    path('api/personnel/advanced_analytics/', simple_api.advanced_analytics, name='advanced_analytics'),
    path('api/personnel/voice_command/', simple_api.voice_command, name='voice_command'),
    path('api/personnel/chatbot_query/', simple_api.chatbot_query, name='chatbot_query'),
]
