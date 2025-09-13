from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonnelViewSet
from . import chatbot_views

router = DefaultRouter()
router.register(r'personnel', PersonnelViewSet, basename='personnel')

urlpatterns = [
    path('api/', include(router.urls)),
    # Chatbot endpoints
    path('api/chatbot/initialize/', chatbot_views.initialize_chatbot, name='initialize_chatbot'),
    path('api/chatbot/message/', chatbot_views.send_message, name='send_message'),
    path('api/chatbot/history/', chatbot_views.get_conversation_history, name='get_conversation_history'),
    path('api/chatbot/clear/', chatbot_views.clear_conversation, name='clear_conversation'),
    path('api/chatbot/help/', chatbot_views.get_chatbot_help, name='get_chatbot_help'),
    path('api/chatbot/suggestions/', chatbot_views.get_smart_suggestions, name='get_smart_suggestions'),
]
