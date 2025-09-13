import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.sentiment import SentimentIntensityAnalyzer
from sklearn.cluster import KMeans
import joblib
import re
from datetime import datetime
import random

class IAFNLPModels:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.models = {}
        
    def generate_training_feedback(self, num_records=1000):
        """Generate synthetic training feedback data"""
        feedback_templates = [
            "Officer {name} demonstrated {performance} performance during {course}. {detail}",
            "Training assessment for {name}: {performance} in {skill_area}. {recommendation}",
            "{name} showed {performance} aptitude in {course}. {future_potential}",
            "Performance review: {name} {performance} expectations in {training_type}. {notes}"
        ]
        
        performance_levels = ['excellent', 'good', 'satisfactory', 'needs improvement', 'outstanding']
        courses = ['Fighter Training', 'Leadership Course', 'Technical Training', 'Cyber Security', 'Medical Training']
        skill_areas = ['technical skills', 'leadership abilities', 'communication', 'problem-solving', 'teamwork']
        
        details = [
            "Shows strong analytical thinking and decision-making capabilities.",
            "Requires additional support in complex scenarios.",
            "Demonstrates natural leadership qualities and team coordination.",
            "Excellent technical proficiency and attention to detail.",
            "Needs improvement in stress management and time management.",
            "Outstanding performance under pressure situations.",
            "Shows potential for advanced responsibilities.",
            "Requires focused training in specific technical areas."
        ]
        
        feedback_data = []
        for i in range(num_records):
            template = random.choice(feedback_templates)
            feedback = template.format(
                name=f"Officer_{i+1}",
                performance=random.choice(performance_levels),
                course=random.choice(courses),
                skill_area=random.choice(skill_areas),
                detail=random.choice(details),
                recommendation=random.choice(details),
                future_potential=random.choice(details),
                training_type=random.choice(courses),
                notes=random.choice(details)
            )
            
            feedback_data.append({
                'officer_id': f'IAF_{i+1:06d}',
                'feedback_text': feedback,
                'date': datetime.now().isoformat(),
                'feedback_type': random.choice(['training', 'performance', 'medical', 'leadership'])
            })
        
        return pd.DataFrame(feedback_data)
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of feedback text"""
        try:
            scores = self.sentiment_analyzer.polarity_scores(text)
            return {
                'positive': scores['pos'],
                'negative': scores['neg'],
                'neutral': scores['neu'],
                'compound': scores['compound']
            }
        except:
            return {'positive': 0.5, 'negative': 0.3, 'neutral': 0.2, 'compound': 0.0}
    
    def extract_key_themes(self, feedback_texts):
        """Extract key themes from feedback using TF-IDF"""
        try:
            tfidf_matrix = self.vectorizer.fit_transform(feedback_texts)
            feature_names = self.vectorizer.get_feature_names_out()
            
            # Get top terms
            mean_scores = np.mean(tfidf_matrix.toarray(), axis=0)
            top_indices = mean_scores.argsort()[-20:][::-1]
            
            themes = [feature_names[i] for i in top_indices]
            return themes
        except:
            return ['leadership', 'performance', 'training', 'technical', 'communication']
    
    def classify_feedback_category(self, text):
        """Classify feedback into categories"""
        text_lower = text.lower()
        
        categories = {
            'leadership': ['leadership', 'command', 'team', 'manage', 'coordinate'],
            'technical': ['technical', 'aircraft', 'maintenance', 'system', 'equipment'],
            'performance': ['performance', 'excellent', 'outstanding', 'good', 'improvement'],
            'training': ['training', 'course', 'skill', 'learn', 'development'],
            'medical': ['medical', 'fitness', 'health', 'physical', 'stress'],
            'behavioral': ['behavior', 'attitude', 'discipline', 'conduct', 'professional']
        }
        
        scores = {}
        for category, keywords in categories.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[category] = score
        
        return max(scores, key=scores.get) if max(scores.values()) > 0 else 'general'
    
    def generate_performance_insights(self, officer_feedback):
        """Generate insights from officer feedback"""
        if not officer_feedback:
            return {
                'overall_sentiment': 'neutral',
                'key_strengths': ['Professional conduct'],
                'improvement_areas': ['Continued development'],
                'recommendations': ['Regular training updates']
            }
        
        # Analyze sentiment
        sentiments = [self.analyze_sentiment(fb) for fb in officer_feedback]
        avg_sentiment = np.mean([s['compound'] for s in sentiments])
        
        # Determine overall sentiment
        if avg_sentiment > 0.1:
            overall_sentiment = 'positive'
        elif avg_sentiment < -0.1:
            overall_sentiment = 'negative'
        else:
            overall_sentiment = 'neutral'
        
        # Extract themes
        themes = self.extract_key_themes(officer_feedback)
        
        # Generate insights
        strengths = [theme for theme in themes[:5] if theme in ['leadership', 'excellent', 'outstanding', 'technical', 'professional']]
        improvements = [theme for theme in themes if theme in ['improvement', 'needs', 'requires', 'develop', 'enhance']]
        
        recommendations = [
            "Continue current performance trajectory",
            "Focus on leadership development opportunities",
            "Enhance technical skill proficiency",
            "Participate in advanced training programs"
        ]
        
        return {
            'overall_sentiment': overall_sentiment,
            'key_strengths': strengths[:3] if strengths else ['Professional conduct'],
            'improvement_areas': improvements[:3] if improvements else ['Continued development'],
            'recommendations': random.sample(recommendations, 2)
        }
    
    def analyze_unit_feedback_trends(self, unit_feedback_data):
        """Analyze feedback trends for a unit"""
        if unit_feedback_data.empty:
            return {
                'unit_sentiment_trend': 'stable',
                'common_themes': ['training', 'performance'],
                'risk_indicators': [],
                'recommendations': ['Regular performance monitoring']
            }
        
        # Sentiment analysis over time
        sentiments = []
        for _, row in unit_feedback_data.iterrows():
            sentiment = self.analyze_sentiment(row['feedback_text'])
            sentiments.append(sentiment['compound'])
        
        avg_sentiment = np.mean(sentiments)
        sentiment_trend = 'improving' if avg_sentiment > 0.1 else 'declining' if avg_sentiment < -0.1 else 'stable'
        
        # Extract common themes
        all_feedback = unit_feedback_data['feedback_text'].tolist()
        themes = self.extract_key_themes(all_feedback)
        
        # Identify risk indicators
        risk_keywords = ['stress', 'burnout', 'overwork', 'dissatisfied', 'leaving', 'quit']
        risk_indicators = []
        for feedback in all_feedback:
            for keyword in risk_keywords:
                if keyword in feedback.lower():
                    risk_indicators.append(f"Mentions of {keyword} detected")
        
        return {
            'unit_sentiment_trend': sentiment_trend,
            'common_themes': themes[:5],
            'risk_indicators': list(set(risk_indicators))[:3],
            'recommendations': [
                "Monitor personnel satisfaction levels",
                "Implement targeted training programs",
                "Address identified risk factors"
            ]
        }
    
    def save_models(self):
        """Save NLP models"""
        joblib.dump(self.vectorizer, 'nlp_vectorizer.pkl')
        joblib.dump(self.models, 'nlp_models.pkl')
    
    def load_models(self):
        """Load NLP models"""
        try:
            self.vectorizer = joblib.load('nlp_vectorizer.pkl')
            self.models = joblib.load('nlp_models.pkl')
        except:
            pass

def main():
    """Main NLP training function"""
    print("Training NLP models for feedback analysis...")
    
    nlp_models = IAFNLPModels()
    
    # Generate synthetic feedback data
    feedback_data = nlp_models.generate_training_feedback(1000)
    print(f"Generated {len(feedback_data)} feedback records")
    
    # Train vectorizer on feedback texts
    nlp_models.vectorizer.fit(feedback_data['feedback_text'])
    
    # Save models
    nlp_models.save_models()
    
    # Save feedback data
    feedback_data.to_csv('feedback_data.csv', index=False)
    
    print("✅ NLP models trained and saved successfully!")

if __name__ == "__main__":
    main()