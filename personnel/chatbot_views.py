from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json
import sys
import os
from datetime import datetime

# Add the ai_models directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ai_models'))

try:
    from iaf_chatbot import ChatbotAPI
except ImportError:
    ChatbotAPI = None

# Global chatbot instance (in production, use session-based storage)
chatbot_sessions = {}

@api_view(['POST'])
def initialize_chatbot(request):
    """Initialize chatbot session with user role"""
    try:
        data = request.data
        role = data.get('role', '').lower()
        user_id = data.get('user_id', 'anonymous')
        session_id = data.get('session_id', f"{user_id}_{role}")
        
        if not role:
            return Response({
                'error': 'Role is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        valid_roles = ['commander', 'hr_manager', 'medical_officer', 'training_officer', 'personnel']
        if role not in valid_roles:
            return Response({
                'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new chatbot session
        if ChatbotAPI:
            chatbot_api = ChatbotAPI()
            result = chatbot_api.set_user_role(role, user_id)
            
            if result['success']:
                chatbot_sessions[session_id] = chatbot_api
                return Response({
                    'success': True,
                    'message': result['message'],
                    'session_id': session_id,
                    'role': role,
                    'capabilities': get_role_capabilities(role)
                })
            else:
                return Response({
                    'error': result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'error': 'Chatbot service not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
    except Exception as e:
        return Response({
            'error': f'Failed to initialize chatbot: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def send_message(request):
    """Send message to chatbot"""
    try:
        data = request.data
        message = data.get('message', '')
        session_id = data.get('session_id', '')
        
        if not message:
            return Response({
                'error': 'Message is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not session_id or session_id not in chatbot_sessions:
            return Response({
                'error': 'Invalid session. Please initialize chatbot first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        chatbot_api = chatbot_sessions[session_id]
        result = chatbot_api.send_message(message)
        
        return Response({
            'success': True,
            'response': result['response'],
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to process message: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_conversation_history(request):
    """Get conversation history for session"""
    try:
        session_id = request.GET.get('session_id', '')
        
        if not session_id or session_id not in chatbot_sessions:
            return Response({
                'error': 'Invalid session'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        chatbot_api = chatbot_sessions[session_id]
        result = chatbot_api.get_conversation_history()
        
        # Convert datetime objects to strings for JSON serialization
        history = []
        for entry in result['history']:
            history.append({
                'timestamp': entry['timestamp'].isoformat(),
                'role': entry['role'],
                'message': entry['message'],
                'type': entry['type']
            })
        
        return Response({
            'success': True,
            'history': history
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to get conversation history: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def clear_conversation(request):
    """Clear conversation history"""
    try:
        data = request.data
        session_id = data.get('session_id', '')
        
        if not session_id or session_id not in chatbot_sessions:
            return Response({
                'error': 'Invalid session'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        chatbot_api = chatbot_sessions[session_id]
        result = chatbot_api.clear_conversation()
        
        return Response({
            'success': True,
            'message': result['message']
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to clear conversation: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_chatbot_help(request):
    """Get role-specific help information"""
    try:
        role = request.GET.get('role', '').lower()
        
        help_info = {
            'commander': {
                'title': 'IAF Commander Assistant',
                'description': 'Strategic command support for IAF operations and personnel management',
                'sample_queries': [
                    'Show squadron operational readiness',
                    'Analyze pilot retention in my command',
                    'Mission capability for border operations',
                    'Aircraft serviceability status',
                    'Personnel deployment planning',
                    'Unit morale and welfare assessment'
                ],
                'capabilities': [
                    'Operational readiness assessment',
                    'Squadron-level analytics',
                    'Mission planning support',
                    'Personnel deployment guidance',
                    'Leadership succession planning',
                    'Resource optimization',
                    'Welfare program monitoring'
                ]
            },
            'hr_manager': {
                'title': 'IAF HR Management Assistant',
                'description': 'Personnel administration and career management support',
                'sample_queries': [
                    'Branch-wise attrition analysis',
                    'Posting and transfer planning',
                    'Leave management optimization',
                    'Pay and allowances queries',
                    'Family welfare program status',
                    'Grievance redressal monitoring'
                ],
                'capabilities': [
                    'Personnel analytics by branch',
                    'Posting cycle management',
                    'Leave and benefits administration',
                    'Career progression tracking',
                    'Family welfare coordination',
                    'Policy implementation',
                    'Retention strategy development'
                ]
            },
            'medical_officer': {
                'title': 'Medical Support Assistant',
                'description': 'Health and wellness monitoring support',
                'sample_queries': [
                    'Health and wellness overview',
                    'Fitness assessment results',
                    'Stress level monitoring',
                    'Medical clearance status',
                    'Wellness program recommendations'
                ],
                'capabilities': [
                    'Health analytics',
                    'Fitness tracking',
                    'Wellness recommendations',
                    'Medical clearance support',
                    'Stress management guidance'
                ]
            },
            'training_officer': {
                'title': 'Training Management Assistant',
                'description': 'Training and skill development support',
                'sample_queries': [
                    'Training needs analysis',
                    'Skill development recommendations',
                    'Course completion tracking',
                    'Performance improvement plans',
                    'Training program effectiveness'
                ],
                'capabilities': [
                    'Training analytics',
                    'Skill gap identification',
                    'Course recommendations',
                    'Progress tracking',
                    'Program optimization'
                ]
            },
            'personnel': {
                'title': 'IAF Personal Career Assistant',
                'description': 'Individual career guidance for IAF personnel',
                'sample_queries': [
                    'My promotion timeline and requirements',
                    'Available IAF courses and foreign training',
                    'Leave balance and posting preferences',
                    'Pay and allowances breakdown',
                    'Family welfare and accommodation',
                    'Medical benefits and fitness requirements'
                ],
                'capabilities': [
                    'Career progression planning',
                    'IAF course recommendations',
                    'Leave and posting guidance',
                    'Pay and benefits information',
                    'Family welfare support',
                    'Medical and fitness guidance',
                    'Policy clarifications'
                ]
            }
        }
        
        if role and role in help_info:
            return Response({
                'success': True,
                'help': help_info[role]
            })
        else:
            return Response({
                'success': True,
                'available_roles': list(help_info.keys()),
                'help': help_info
            })
            
    except Exception as e:
        return Response({
            'error': f'Failed to get help information: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def get_smart_suggestions(request):
    """Get smart suggestions based on user role and context"""
    try:
        data = request.data
        role = data.get('role', '').lower()
        context = data.get('context', '')
        
        suggestions = {
            'commander': [
                'Show squadron operational readiness status',
                'Analyze pilot attrition in fighter squadrons',
                'Mission capability assessment for border operations',
                'Leadership succession planning for key positions',
                'Aircraft serviceability and maintenance status',
                'Personnel deployment for emergency operations',
                'Unit morale and welfare assessment'
            ],
            'hr_manager': [
                'Branch-wise attrition analysis and trends',
                'Posting and transfer planning for next cycle',
                'Leave management and balance optimization',
                'Pay and allowances query resolution',
                'Family welfare program effectiveness',
                'Career progression bottlenecks identification',
                'Grievance redressal system status'
            ],
            'medical_officer': [
                'Flying fitness medical board schedules',
                'Stress counseling requirements by unit',
                'Annual medical examination compliance',
                'Mental health support program status',
                'Fitness standards compliance monitoring',
                'Medical evacuation preparedness',
                'Health awareness campaign effectiveness'
            ],
            'training_officer': [
                'Flying training progress and bottlenecks',
                'Technical training course effectiveness',
                'Simulator training utilization rates',
                'Foreign training course nominations',
                'Safety training compliance monitoring',
                'Instructor pilot availability and requirements',
                'Training aircraft serviceability impact'
            ],
            'personnel': [
                'My next promotion timeline and requirements',
                'Available IAF courses and foreign training',
                'Leave balance and encashment options',
                'Posting preferences for next cycle',
                'Pay slip details and allowances breakdown',
                'Family accommodation and schooling options',
                'Medical benefits and insurance coverage'
            ]
        }
        
        role_suggestions = suggestions.get(role, [])
        
        return Response({
            'success': True,
            'suggestions': role_suggestions,
            'role': role
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to get suggestions: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_role_capabilities(role):
    """Get capabilities for a specific role"""
    capabilities = {
        'commander': {
            'access_level': 'strategic',
            'data_access': ['all_personnel', 'unit_stats', 'readiness', 'operations'],
            'functions': ['unit_analysis', 'strategic_planning', 'resource_allocation', 'mission_planning']
        },
        'hr_manager': {
            'access_level': 'administrative',
            'data_access': ['personnel_records', 'performance', 'training', 'career_development'],
            'functions': ['personnel_management', 'career_planning', 'skill_analysis', 'attrition_analysis']
        },
        'medical_officer': {
            'access_level': 'medical',
            'data_access': ['medical_records', 'fitness_data', 'wellness_metrics'],
            'functions': ['health_analysis', 'fitness_tracking', 'wellness_recommendations', 'medical_clearance']
        },
        'training_officer': {
            'access_level': 'training',
            'data_access': ['training_records', 'skill_gaps', 'performance_metrics'],
            'functions': ['training_analysis', 'skill_development', 'course_recommendations', 'progress_tracking']
        },
        'personnel': {
            'access_level': 'personal',
            'data_access': ['own_records', 'career_path', 'training_opportunities'],
            'functions': ['career_guidance', 'training_requests', 'performance_review', 'wellness_tips']
        }
    }
    
    return capabilities.get(role, {})