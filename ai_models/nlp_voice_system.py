import speech_recognition as sr
import pyttsx3
from googletrans import Translator
import re
import json
from datetime import datetime
import numpy as np

class VoiceNLPSystem:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.tts_engine = pyttsx3.init()
        self.translator = Translator()
        self.supported_languages = {
            'en': 'English',
            'hi': 'Hindi', 
            'ta': 'Tamil',
            'te': 'Telugu',
            'bn': 'Bengali',
            'mr': 'Marathi',
            'gu': 'Gujarati'
        }
        self.setup_voice()
    
    def setup_voice(self):
        """Configure text-to-speech settings"""
        voices = self.tts_engine.getProperty('voices')
        self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.8)
    
    def listen_for_command(self, language='en'):
        """Listen for voice commands"""
        try:
            with sr.Microphone() as source:
                print("🎤 Listening for command...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            # Recognize speech
            if language == 'hi':
                text = self.recognizer.recognize_google(audio, language='hi-IN')
            else:
                text = self.recognizer.recognize_google(audio, language=f'{language}-IN')
            
            return {
                'success': True,
                'text': text,
                'language': language,
                'timestamp': datetime.now().isoformat()
            }
        except sr.UnknownValueError:
            return {'success': False, 'error': 'Could not understand audio'}
        except sr.RequestError as e:
            return {'success': False, 'error': f'Speech recognition error: {e}'}
        except Exception as e:
            return {'success': False, 'error': f'Microphone error: {e}'}
    
    def translate_text(self, text, target_language='en'):
        """Translate text between supported languages"""
        try:
            if target_language not in self.supported_languages:
                return {'success': False, 'error': 'Unsupported language'}
            
            result = self.translator.translate(text, dest=target_language)
            return {
                'success': True,
                'original_text': text,
                'translated_text': result.text,
                'source_language': result.src,
                'target_language': target_language,
                'confidence': result.extra_data.get('confidence', 0.95)
            }
        except Exception as e:
            return {'success': False, 'error': f'Translation error: {e}'}
    
    def speak_response(self, text, language='en'):
        """Convert text to speech"""
        try:
            # Translate to target language if needed
            if language != 'en':
                translation = self.translate_text(text, language)
                if translation['success']:
                    text = translation['translated_text']
            
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
            return {'success': True, 'spoken_text': text}
        except Exception as e:
            return {'success': False, 'error': f'TTS error: {e}'}
    
    def process_voice_command(self, command_text, user_role='personnel'):
        """Process natural language commands"""
        command_lower = command_text.lower()
        
        # Command patterns
        patterns = {
            'personnel_info': r'(show|get|find).*(personnel|soldier|officer).*(details|info|record)',
            'leave_request': r'(apply|request|submit).*(leave|vacation|holiday)',
            'training_status': r'(check|show|get).*(training|course|certification)',
            'medical_record': r'(show|get|check).*(medical|health|fitness)',
            'mission_status': r'(check|show|get).*(mission|operation|deployment)',
            'equipment_status': r'(check|show|get).*(equipment|aircraft|vehicle)',
            'weather_info': r'(weather|forecast|conditions)',
            'base_info': r'(base|station|facility).*(info|details|status)'
        }
        
        # Match command patterns
        for intent, pattern in patterns.items():
            if re.search(pattern, command_lower):
                return self.execute_command(intent, command_text, user_role)
        
        # Default response
        return {
            'intent': 'unknown',
            'response': 'I did not understand that command. Please try again.',
            'suggestions': ['Check personnel info', 'Apply for leave', 'Check training status']
        }
    
    def execute_command(self, intent, command_text, user_role):
        """Execute identified command"""
        responses = {
            'personnel_info': {
                'response': 'Displaying personnel information on your dashboard.',
                'action': 'navigate_to_personnel',
                'data': {'total_personnel': 10000, 'active_duty': 9500}
            },
            'leave_request': {
                'response': 'Opening leave application form. Please specify leave type and dates.',
                'action': 'open_leave_form',
                'data': {'available_leave': 30, 'pending_requests': 2}
            },
            'training_status': {
                'response': 'Your current training completion rate is 85%. Next course: Advanced Combat Training.',
                'action': 'show_training_dashboard',
                'data': {'completion_rate': 85, 'next_course': 'Advanced Combat Training'}
            },
            'medical_record': {
                'response': 'Your last medical checkup was on 15th March. Next scheduled: 15th June.',
                'action': 'show_medical_dashboard',
                'data': {'last_checkup': '2024-03-15', 'next_checkup': '2024-06-15'}
            },
            'mission_status': {
                'response': 'Current mission readiness: 92%. No active deployments.',
                'action': 'show_mission_dashboard',
                'data': {'readiness': 92, 'active_missions': 0}
            },
            'equipment_status': {
                'response': 'All assigned equipment operational. Next maintenance: Aircraft A-101 on 20th April.',
                'action': 'show_equipment_dashboard',
                'data': {'operational': 95, 'maintenance_due': 5}
            },
            'weather_info': {
                'response': 'Current weather: Clear skies, 28°C, Wind: 15 knots from Southwest.',
                'action': 'show_weather',
                'data': {'temperature': 28, 'conditions': 'Clear', 'wind': '15 knots SW'}
            },
            'base_info': {
                'response': 'Base status: Normal operations. Personnel on duty: 2,500. All systems operational.',
                'action': 'show_base_status',
                'data': {'status': 'Normal', 'personnel_on_duty': 2500}
            }
        }
        
        return responses.get(intent, {
            'response': 'Command not recognized. Please try again.',
            'action': 'none',
            'data': {}
        })
    
    def sentiment_analysis(self, text):
        """Analyze sentiment of personnel communications"""
        # Simple sentiment analysis (in production, use advanced NLP models)
        positive_words = ['good', 'great', 'excellent', 'happy', 'satisfied', 'motivated', 'proud']
        negative_words = ['bad', 'terrible', 'unhappy', 'frustrated', 'stressed', 'worried', 'concerned']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = 'positive'
            score = min(0.8 + (positive_count * 0.1), 1.0)
        elif negative_count > positive_count:
            sentiment = 'negative'
            score = max(0.2 - (negative_count * 0.1), 0.0)
        else:
            sentiment = 'neutral'
            score = 0.5
        
        return {
            'sentiment': sentiment,
            'score': score,
            'confidence': 0.75,
            'keywords': {
                'positive': [word for word in positive_words if word in text_lower],
                'negative': [word for word in negative_words if word in text_lower]
            }
        }
    
    def get_voice_interface_status(self):
        """Get status of voice interface components"""
        return {
            'speech_recognition': True,
            'text_to_speech': True,
            'translation': True,
            'supported_languages': list(self.supported_languages.keys()),
            'microphone_available': True,
            'speakers_available': True
        }

# Demo usage
if __name__ == "__main__":
    voice_system = VoiceNLPSystem()
    
    # Test voice command processing
    test_commands = [
        "Show me personnel information",
        "I want to apply for leave",
        "Check my training status",
        "What's the weather like?"
    ]
    
    print("🎤 Voice & NLP System Ready!")
    print("Supported languages:", list(voice_system.supported_languages.values()))
    
    for command in test_commands:
        result = voice_system.process_voice_command(command)
        print(f"Command: {command}")
        print(f"Response: {result['response']}")
        print("---")