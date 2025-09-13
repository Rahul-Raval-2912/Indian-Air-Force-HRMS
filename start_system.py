#!/usr/bin/env python3
"""
Start script for IAF Human Management System
Runs both Django backend and React frontend
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def run_django():
    """Run Django development server"""
    print("🚀 Starting Django Backend Server...")
    try:
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '8000'
        ], cwd=Path(__file__).parent)
    except KeyboardInterrupt:
        print("\n🛑 Django server stopped")

def run_react():
    """Run React development server"""
    print("🚀 Starting React Frontend Server...")
    time.sleep(3)  # Wait for Django to start
    try:
        subprocess.run([
            'npm', 'start'
        ], cwd=Path(__file__).parent / 'frontend')
    except KeyboardInterrupt:
        print("\n🛑 React server stopped")

def main():
    """Main function to start both servers"""
    print("=" * 60)
    print("IAF HUMAN MANAGEMENT SYSTEM")
    print("=" * 60)
    print("Starting full-stack application...")
    print()
    
    # Check if personnel data exists
    if not os.path.exists('personnel_data.csv'):
        print("⚠️  Personnel data not found. Generating data...")
        subprocess.run([sys.executable, 'generate_data.py'])
        print("✅ Data generated successfully!")
        print()
    
    # Check if ML models exist
    model_files = [
        'advanced_attrition_model.pkl',
        'advanced_readiness_model.pkl', 
        'advanced_leadership_model.pkl'
    ]
    
    if not all(os.path.exists(f) for f in model_files):
        print("⚠️  ML models not found. Training models...")
        subprocess.run([sys.executable, 'train_advanced_models.py'])
        print("✅ Models trained successfully!")
        print()
    
    try:
        # Start Django in a separate thread
        django_thread = threading.Thread(target=run_django, daemon=True)
        django_thread.start()
        
        # Start React in main thread
        run_react()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down IAF Human Management System...")
        print("Thank you for using the system!")

if __name__ == "__main__":
    main()