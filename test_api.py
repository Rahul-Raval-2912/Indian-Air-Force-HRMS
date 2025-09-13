#!/usr/bin/env python3
import requests
import json
import time
import subprocess
import sys

def start_server():
    """Start Django server in background"""
    process = subprocess.Popen([
        sys.executable, 'manage.py', 'runserver', '8000'
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)  # Wait for server to start
    return process

def test_api():
    """Test API endpoints"""
    base_url = "http://localhost:8000/api"
    
    try:
        # Test dashboard stats
        response = requests.get(f"{base_url}/personnel/dashboard_stats/")
        if response.status_code == 200:
            data = response.json()
            print("✓ Dashboard Stats API working")
            print(f"  Total Personnel: {data.get('total_personnel', 'N/A')}")
            print(f"  Average Readiness: {data.get('avg_readiness', 'N/A'):.1f}%")
        else:
            print(f"✗ Dashboard Stats API failed: {response.status_code}")
        
        # Test personnel list
        response = requests.get(f"{base_url}/personnel/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Personnel List API working ({len(data)} records)")
        else:
            print(f"✗ Personnel List API failed: {response.status_code}")
        
        # Test attrition prediction
        test_data = {
            "years_of_service": 10,
            "age": 32,
            "fitness_score": 85,
            "stress_index": 30,
            "missions_participated": 50,
            "mission_success_rate": 0.95,
            "peer_review_score": 8,
            "leadership_score": 7,
            "leave_records": 25,
            "disciplinary_actions": 0,
            "complaints": 0,
            "engagement_score": 85,
            "rank": "Pilot",
            "unit": "Airbase1"
        }
        
        response = requests.post(f"{base_url}/personnel/predict_attrition/", json=test_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Attrition Prediction API working (Risk: {data.get('attrition_risk', 'N/A'):.2f})")
        else:
            print(f"✗ Attrition Prediction API failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to Django server")
    except Exception as e:
        print(f"✗ API test error: {e}")

if __name__ == "__main__":
    print("Starting IAF HMS API Test...")
    server = start_server()
    
    try:
        test_api()
    finally:
        server.terminate()
        print("\nAPI test completed.")
