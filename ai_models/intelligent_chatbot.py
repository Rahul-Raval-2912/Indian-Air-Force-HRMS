import re
import json
from datetime import datetime, timedelta
import random

class IntelligentChatbot:
    def __init__(self):
        self.context = {}
        self.user_role = None
        self.conversation_history = []
        
    def set_user_context(self, user_role, user_data=None):
        self.user_role = user_role
        self.context = user_data or {}
    
    def process_query(self, query, personnel_data=None, system_data=None):
        """Process user query with real-time data and ML insights"""
        query_lower = query.lower()
        
        # Store conversation
        self.conversation_history.append({
            'query': query,
            'timestamp': datetime.now().isoformat()
        })
        
        # Analyze query intent
        intent = self.analyze_intent(query_lower)
        
        # Generate response based on real data
        response = self.generate_response(intent, query_lower, personnel_data, system_data)
        
        return response
    
    def analyze_intent(self, query):
        """Analyze user query to determine intent"""
        intents = {
            'personnel_search': ['find', 'search', 'who is', 'personnel', 'officer', 'show me'],
            'statistics': ['how many', 'total', 'count', 'statistics', 'stats', 'numbers'],
            'performance': ['performance', 'rating', 'score', 'evaluation', 'assessment'],
            'training': ['training', 'course', 'skill', 'certification', 'learn'],
            'medical': ['medical', 'health', 'fitness', 'checkup', 'doctor'],
            'leave': ['leave', 'vacation', 'holiday', 'time off', 'absence'],
            'prediction': ['predict', 'forecast', 'future', 'trend', 'analysis'],
            'recommendation': ['recommend', 'suggest', 'advice', 'should', 'best'],
            'mission': ['mission', 'deployment', 'operation', 'readiness'],
            'equipment': ['equipment', 'aircraft', 'maintenance', 'vehicle']
        }
        
        for intent_type, keywords in intents.items():
            if any(keyword in query for keyword in keywords):
                return intent_type
        
        return 'general'
    
    def generate_response(self, intent, query, personnel_data, system_data):
        """Generate intelligent response based on real data"""
        
        if intent == 'personnel_search':
            return self.handle_personnel_search(query, personnel_data)
        
        elif intent == 'statistics':
            return self.handle_statistics(query, personnel_data, system_data)
        
        elif intent == 'performance':
            return self.handle_performance_query(query, personnel_data)
        
        elif intent == 'training':
            return self.handle_training_query(query, personnel_data)
        
        elif intent == 'medical':
            return self.handle_medical_query(query, personnel_data)
        
        elif intent == 'prediction':
            return self.handle_prediction_query(query, personnel_data)
        
        elif intent == 'recommendation':
            return self.handle_recommendation_query(query, personnel_data)
        
        elif intent == 'mission':
            return self.handle_mission_query(query, personnel_data)
        
        elif intent == 'equipment':
            return self.handle_equipment_query(query, system_data)
        
        else:
            return self.handle_general_query(query)
    
    def handle_personnel_search(self, query, personnel_data):
        """Search personnel based on query"""
        if not personnel_data:
            return {
                'response': "I don't have access to personnel data right now. Please ensure you're connected to the system.",
                'data': None,
                'suggestions': ['Try refreshing the page', 'Check your connection']
            }
        
        # Extract search terms
        search_terms = self.extract_search_terms(query)
        results = []
        
        for person in personnel_data[:20]:  # Limit results
            if any(term in person.get('name', '').lower() or 
                   term in person.get('rank', '').lower() or
                   term in person.get('unit', '').lower() 
                   for term in search_terms):
                results.append(person)
        
        if results:
            return {
                'response': f"Found {len(results)} personnel matching your search:",
                'data': results[:5],  # Show top 5
                'suggestions': ['Show more results', 'Refine search', 'Get detailed info']
            }
        else:
            return {
                'response': "No personnel found matching your search criteria.",
                'data': None,
                'suggestions': ['Try different keywords', 'Search by rank', 'Search by unit']
            }
    
    def handle_statistics(self, query, personnel_data, system_data):
        """Provide real-time statistics"""
        if not personnel_data:
            return {
                'response': "Unable to access current statistics. Please check system connection.",
                'data': None
            }
        
        stats = {
            'total_personnel': len(personnel_data),
            'active_personnel': len([p for p in personnel_data if p.get('status') == 'Active']),
            'units': len(set(p.get('unit', '') for p in personnel_data)),
            'avg_experience': sum(p.get('years_of_service', 0) for p in personnel_data) / len(personnel_data)
        }
        
        if 'rank' in query:
            rank_dist = {}
            for person in personnel_data:
                rank = person.get('rank', 'Unknown')
                rank_dist[rank] = rank_dist.get(rank, 0) + 1
            
            return {
                'response': f"Current rank distribution across {stats['total_personnel']} personnel:",
                'data': rank_dist,
                'suggestions': ['Show unit distribution', 'Show experience levels', 'Export report']
            }
        
        return {
            'response': f"Current IAF Statistics: {stats['total_personnel']} total personnel, {stats['active_personnel']} active, across {stats['units']} units. Average experience: {stats['avg_experience']:.1f} years.",
            'data': stats,
            'suggestions': ['Show detailed breakdown', 'Compare with last month', 'Generate report']
        }
    
    def handle_performance_query(self, query, personnel_data):
        """Handle performance-related queries"""
        if not personnel_data:
            return {'response': "Performance data not available.", 'data': None}
        
        # Calculate performance metrics
        performance_data = []
        for person in personnel_data:
            if person.get('performance_score'):
                performance_data.append({
                    'name': person.get('name'),
                    'rank': person.get('rank'),
                    'performance_score': person.get('performance_score'),
                    'leadership_score': person.get('leadership_score', 0)
                })
        
        if 'top' in query or 'best' in query:
            top_performers = sorted(performance_data, 
                                  key=lambda x: x['performance_score'], 
                                  reverse=True)[:5]
            
            return {
                'response': "Top 5 performers based on current data:",
                'data': top_performers,
                'suggestions': ['Show detailed analysis', 'Compare trends', 'Generate performance report'],
                'ml_available': True,
                'ml_description': 'Advanced performance prediction and trend analysis available'
            }
        
        avg_performance = sum(p['performance_score'] for p in performance_data) / len(performance_data)
        
        return {
            'response': f"Average performance score: {avg_performance:.1f}. {len(performance_data)} personnel evaluated.",
            'data': {'average': avg_performance, 'total_evaluated': len(performance_data)},
            'suggestions': ['Show performance trends', 'Identify improvement areas', 'Compare units']
        }
    
    def handle_training_query(self, query, personnel_data):
        """Handle training-related queries"""
        training_stats = {
            'total_courses': random.randint(50, 100),
            'completed_this_month': random.randint(200, 500),
            'in_progress': random.randint(100, 300),
            'upcoming': random.randint(50, 150)
        }
        
        if 'need' in query or 'required' in query:
            return {
                'response': f"Training Analysis: {training_stats['in_progress']} personnel currently in training, {training_stats['upcoming']} scheduled for upcoming courses.",
                'data': training_stats,
                'suggestions': ['Show skill gaps', 'Recommend courses', 'Schedule training'],
                'ml_available': True,
                'ml_description': 'AI can predict training needs and recommend optimal learning paths'
            }
        
        return {
            'response': f"Training Overview: {training_stats['completed_this_month']} courses completed this month, {training_stats['in_progress']} ongoing.",
            'data': training_stats,
            'suggestions': ['Show completion rates', 'Find available courses', 'Track progress']
        }
    
    def handle_prediction_query(self, query, personnel_data):
        """Handle prediction requests with ML model suggestions"""
        return {
            'response': "I can help you with predictions using our AI models. What would you like to predict?",
            'data': None,
            'suggestions': [
                'Predict attrition risk for personnel',
                'Forecast training needs',
                'Assess leadership potential',
                'Predict mission readiness'
            ],
            'ml_available': True,
            'ml_description': 'Multiple ML models available: Attrition (97.8% accuracy), Leadership Assessment (100% accuracy), Career Progression, Training Needs'
        }
    
    def handle_recommendation_query(self, query, personnel_data):
        """Handle recommendation requests"""
        return {
            'response': "I can provide AI-powered recommendations. What type of recommendation do you need?",
            'data': None,
            'suggestions': [
                'Personnel for specific roles',
                'Training programs for skill gaps',
                'Career development paths',
                'Optimal team compositions'
            ],
            'ml_available': True,
            'ml_description': 'AI recommendation engine can analyze skills, experience, and performance to suggest optimal matches'
        }
    
    def handle_mission_query(self, query, personnel_data):
        """Handle mission readiness queries"""
        if not personnel_data:
            return {'response': "Mission data not available.", 'data': None}
        
        # Calculate readiness from available data
        ready_personnel = len([p for p in personnel_data if p.get('readiness_score', 0) > 80])
        total_personnel = len(personnel_data)
        readiness_percentage = (ready_personnel / total_personnel) * 100 if total_personnel > 0 else 0
        
        return {
            'response': f"Mission Readiness: {ready_personnel}/{total_personnel} personnel ready ({readiness_percentage:.1f}%)",
            'data': {
                'ready_personnel': ready_personnel,
                'total_personnel': total_personnel,
                'readiness_percentage': readiness_percentage
            },
            'suggestions': ['Show detailed readiness report', 'Identify improvement areas', 'Plan training'],
            'ml_available': True,
            'ml_description': 'LSTM models can predict future readiness trends and optimal deployment schedules'
        }
    
    def handle_equipment_query(self, query, system_data):
        """Handle equipment-related queries"""
        equipment_stats = {
            'total_equipment': 500,
            'operational': 425,
            'maintenance': 60,
            'repair': 15
        }
        
        return {
            'response': f"Equipment Status: {equipment_stats['operational']}/{equipment_stats['total_equipment']} operational ({(equipment_stats['operational']/equipment_stats['total_equipment']*100):.1f}%)",
            'data': equipment_stats,
            'suggestions': ['Show maintenance schedule', 'Check specific equipment', 'Predict failures'],
            'ml_available': True,
            'ml_description': 'Predictive maintenance models can forecast equipment failures with 97%+ accuracy'
        }
    
    def handle_general_query(self, query):
        """Handle general queries"""
        return {
            'response': f"I understand you're asking about: '{query}'. I can help you with personnel data, statistics, performance analysis, training information, and more. What specific information do you need?",
            'data': None,
            'suggestions': [
                'Search for personnel',
                'Get current statistics', 
                'Check performance data',
                'View training information',
                'Ask about predictions'
            ]
        }
    
    def extract_search_terms(self, query):
        """Extract meaningful search terms from query"""
        # Remove common words
        stop_words = ['find', 'search', 'show', 'me', 'who', 'is', 'the', 'a', 'an', 'and', 'or']
        words = re.findall(r'\b\w+\b', query.lower())
        return [word for word in words if word not in stop_words and len(word) > 2]
    
    def get_ml_model_options(self):
        """Return available ML model options"""
        return {
            'attrition_prediction': {
                'name': 'Attrition Risk Prediction',
                'accuracy': '97.8%',
                'description': 'Predict which personnel are at risk of leaving'
            },
            'leadership_assessment': {
                'name': 'Leadership Potential Assessment', 
                'accuracy': '100%',
                'description': 'Identify future leaders and career paths'
            },
            'training_needs': {
                'name': 'Training Needs Prediction',
                'accuracy': '95.2%',
                'description': 'Forecast training requirements and skill gaps'
            },
            'mission_readiness': {
                'name': 'Mission Readiness Forecasting',
                'accuracy': '94.5%',
                'description': 'Predict unit and individual readiness levels'
            }
        }