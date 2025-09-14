#!/usr/bin/env python
import os
import sys
import subprocess
import time
import webbrowser
from threading import Thread

def start_backend():
    """Start Django backend server"""
    print("Starting Django Backend Server...")
    try:
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        subprocess.run([sys.executable, 'manage.py', 'runserver', '8000'], 
                      check=True)
    except KeyboardInterrupt:
        print("Backend server stopped.")
    except Exception as e:
        print(f"Backend error: {e}")

def start_frontend():
    """Start React frontend server"""
    print("Starting React Frontend Server...")
    try:
        os.chdir('frontend')
        subprocess.run(['npm', 'start'], check=True)
    except KeyboardInterrupt:
        print("Frontend server stopped.")
    except Exception as e:
        print(f"Frontend error: {e}")

def main():
    print("=" * 50)
    print("IAF Human Management System - Starting Services")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_thread = Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    print("Waiting for backend to initialize...")
    time.sleep(5)
    
    # Start frontend
    print("Starting frontend...")
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\nShutting down services...")
    
    print("\nServices stopped.")

if __name__ == '__main__':
    main()