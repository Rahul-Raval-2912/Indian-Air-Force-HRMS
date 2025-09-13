#!/usr/bin/env python3
import subprocess
import sys
import time
import os

def start_backend():
    print("Starting Django backend...")
    backend_process = subprocess.Popen([
        sys.executable, 'manage.py', 'runserver', '8000'
    ], cwd='/home/master/Documents/hackathon2025')
    return backend_process

def install_frontend_deps():
    print("Installing frontend dependencies...")
    subprocess.run(['npm', 'install'], cwd='/home/master/Documents/hackathon2025/frontend')

def start_frontend():
    print("Starting React frontend...")
    frontend_process = subprocess.Popen([
        'npm', 'start'
    ], cwd='/home/master/Documents/hackathon2025/frontend')
    return frontend_process

if __name__ == "__main__":
    try:
        # Start backend
        backend = start_backend()
        time.sleep(3)
        
        # Install and start frontend
        install_frontend_deps()
        frontend = start_frontend()
        
        print("\n" + "="*50)
        print("IAF Human Management System Started!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:3000")
        print("="*50)
        print("\nPress Ctrl+C to stop all services")
        
        # Wait for processes
        try:
            backend.wait()
            frontend.wait()
        except KeyboardInterrupt:
            print("\nShutting down services...")
            backend.terminate()
            frontend.terminate()
            
    except Exception as e:
        print(f"Error starting system: {e}")
        sys.exit(1)
