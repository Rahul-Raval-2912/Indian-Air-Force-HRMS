#!/usr/bin/env python3
"""
IAF Human Management System Demo
Demonstrates all key features and AI capabilities
"""
import requests
import json
import pandas as pd
from ai_models.ml_models import IAFMLModels

def demo_dashboard_stats():
    """Demo dashboard statistics"""
    print("=" * 60)
    print("DASHBOARD STATISTICS")
    print("=" * 60)
    
    try:
        response = requests.get("http://localhost:8000/api/personnel/dashboard_stats/")
        if response.status_code == 200:
            stats = response.json()
            
            print(f"📊 Total Personnel: {stats['total_personnel']:,}")
            print(f"📈 Average Readiness: {stats['avg_readiness']:.1f}%")
            print(f"⚠️  High Attrition Risk: {stats['high_attrition_risk']}")
            print(f"🌟 High Leadership Potential: {stats['high_leadership_potential']}")
            
            print("\n🏢 Unit Distribution:")
            for unit, count in stats['units'].items():
                print(f"   {unit}: {count}")
            
            print("\n👥 Rank Distribution:")
            for rank, count in stats['ranks'].items():
                print(f"   {rank}: {count}")
        else:
            print("❌ Failed to fetch dashboard stats")
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_ai_predictions():
    """Demo AI model predictions"""
    print("\n" + "=" * 60)
    print("AI PREDICTIONS DEMO")
    print("=" * 60)
    
    # Sample personnel data
    test_cases = [
        {
            "name": "High-Risk Officer",
            "data": {
                "years_of_service": 25,
                "age": 47,
                "fitness_score": 60,
                "stress_index": 70,
                "missions_participated": 100,
                "mission_success_rate": 0.85,
                "peer_review_score": 5,
                "leadership_score": 4,
                "leave_records": 45,
                "disciplinary_actions": 2,
                "complaints": 1,
                "engagement_score": 45,
                "rank": "Engineer",
                "unit": "Airbase3"
            }
        },
        {
            "name": "High-Potential Officer",
            "data": {
                "years_of_service": 8,
                "age": 30,
                "fitness_score": 95,
                "stress_index": 20,
                "missions_participated": 45,
                "mission_success_rate": 0.98,
                "peer_review_score": 9,
                "leadership_score": 9,
                "leave_records": 20,
                "disciplinary_actions": 0,
                "complaints": 0,
                "engagement_score": 92,
                "rank": "Pilot",
                "unit": "Airbase1"
            }
        }
    ]
    
    for case in test_cases:
        print(f"\n🔍 Analyzing: {case['name']}")
        print("-" * 40)
        
        try:
            # Attrition prediction
            response = requests.post(
                "http://localhost:8000/api/personnel/predict_attrition/",
                json=case['data']
            )
            if response.status_code == 200:
                risk = response.json()['attrition_risk']
                risk_level = "HIGH" if risk > 0.7 else "MEDIUM" if risk > 0.3 else "LOW"
                print(f"   📉 Attrition Risk: {risk:.2f} ({risk_level})")
            
            # Readiness prediction
            response = requests.post(
                "http://localhost:8000/api/personnel/predict_readiness/",
                json=case['data']
            )
            if response.status_code == 200:
                readiness = response.json()['readiness_score']
                print(f"   🎯 Readiness Score: {readiness:.1f}%")
                
        except Exception as e:
            print(f"   ❌ Prediction Error: {e}")

def demo_what_if_simulation():
    """Demo what-if simulation"""
    print("\n" + "=" * 60)
    print("WHAT-IF SIMULATION DEMO")
    print("=" * 60)
    
    scenarios = [
        {
            "name": "Mass Retirement Scenario",
            "data": {
                "scenario": "retirement",
                "personnel_ids": ["IAF_000001", "IAF_000002", "IAF_000003", "IAF_000004", "IAF_000005"]
            }
        },
        {
            "name": "Unit Redeployment",
            "data": {
                "scenario": "redeployment",
                "personnel_ids": ["IAF_000010", "IAF_000011", "IAF_000012"]
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"\n🎮 Running: {scenario['name']}")
        print("-" * 40)
        
        try:
            response = requests.post(
                "http://localhost:8000/api/personnel/what_if_simulation/",
                json=scenario['data']
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   📋 Scenario: {result['scenario']}")
                print(f"   👥 Affected Personnel: {result['affected_count']}")
                print(f"   📊 Readiness Impact: {result['readiness_impact']}%")
                print(f"   🔧 Skill Gaps: {', '.join(result['skill_gaps'])}")
                print("   💡 Recommended Actions:")
                for action in result['recommended_actions']:
                    print(f"      • {action}")
                    
        except Exception as e:
            print(f"   ❌ Simulation Error: {e}")

def demo_skill_recommendations():
    """Demo skill matching and recommendations"""
    print("\n" + "=" * 60)
    print("SKILL RECOMMENDATIONS DEMO")
    print("=" * 60)
    
    try:
        response = requests.get(
            "http://localhost:8000/api/personnel/skill_recommendations/",
            params={"unit": "Airbase1", "skills": "fighter_jets,radar_ops"}
        )
        
        if response.status_code == 200:
            recommendations = response.json()
            print("🎯 Top Skill Matches for Fighter Jets & Radar Operations:")
            print("-" * 50)
            
            for rec in recommendations:
                print(f"   👤 {rec['name']} ({rec['id']})")
                print(f"      Match Score: {rec['match_score']*100:.1f}%")
                
    except Exception as e:
        print(f"❌ Recommendations Error: {e}")

def demo_data_insights():
    """Demo data insights from CSV"""
    print("\n" + "=" * 60)
    print("DATA INSIGHTS")
    print("=" * 60)
    
    try:
        df = pd.read_csv('personnel_data.csv')
        
        print(f"📊 Dataset Overview:")
        print(f"   Total Records: {len(df):,}")
        print(f"   Date Range: Synthetic data generated")
        
        print(f"\n🎯 Readiness Analysis:")
        high_readiness = len(df[df['readiness_score'] >= 80])
        medium_readiness = len(df[(df['readiness_score'] >= 60) & (df['readiness_score'] < 80)])
        low_readiness = len(df[df['readiness_score'] < 60])
        
        print(f"   High Readiness (≥80%): {high_readiness} ({high_readiness/len(df)*100:.1f}%)")
        print(f"   Medium Readiness (60-79%): {medium_readiness} ({medium_readiness/len(df)*100:.1f}%)")
        print(f"   Low Readiness (<60%): {low_readiness} ({low_readiness/len(df)*100:.1f}%)")
        
        print(f"\n⚠️ Risk Analysis:")
        high_attrition = len(df[df['attrition_risk'] == 1])
        print(f"   High Attrition Risk: {high_attrition} ({high_attrition/len(df)*100:.1f}%)")
        
        high_stress = len(df[df['stress_index'] >= 70])
        print(f"   High Stress (≥70): {high_stress} ({high_stress/len(df)*100:.1f}%)")
        
        print(f"\n🌟 Leadership Pipeline:")
        leadership_counts = df['leadership_potential'].value_counts()
        for level, count in leadership_counts.items():
            print(f"   {level.title()}: {count} ({count/len(df)*100:.1f}%)")
            
    except Exception as e:
        print(f"❌ Data Analysis Error: {e}")

def main():
    """Run complete demo"""
    print("🚀 IAF HUMAN MANAGEMENT SYSTEM - COMPREHENSIVE DEMO")
    print("🔗 Backend: http://localhost:8000")
    print("🌐 Frontend: http://localhost:3000")
    
    # Check if server is running
    try:
        response = requests.get("http://localhost:8000/api/personnel/dashboard_stats/", timeout=2)
        if response.status_code != 200:
            print("❌ Django server not responding. Please start with: python manage.py runserver 8000")
            return
    except:
        print("❌ Django server not running. Please start with: python manage.py runserver 8000")
        return
    
    demo_dashboard_stats()
    demo_ai_predictions()
    demo_what_if_simulation()
    demo_skill_recommendations()
    demo_data_insights()
    
    print("\n" + "=" * 60)
    print("✅ DEMO COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print("\n🎯 Next Steps:")
    print("   1. Access Commander Dashboard: http://localhost:3000")
    print("   2. Try different user roles in the login page")
    print("   3. Explore API endpoints at: http://localhost:8000/api/")
    print("   4. Review generated data in: personnel_data.csv")

if __name__ == "__main__":
    main()
