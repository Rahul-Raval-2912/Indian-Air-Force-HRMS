#!/usr/bin/env python3
import subprocess
import sys
import time
import os
import threading

def start_backend():
    """Start Django backend server"""
    print("🚀 Starting Django backend server...")
    try:
        process = subprocess.Popen([
            sys.executable, 'manage.py', 'runserver', '8000'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        
        # Print backend output
        for line in iter(process.stdout.readline, ''):
            if line.strip():
                print(f"[BACKEND] {line.strip()}")
        
        return process
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return None

def start_frontend():
    """Start React frontend server"""
    print("🌐 Starting React frontend server...")
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    
    try:
        # Set environment variable to avoid browser auto-opening
        env = os.environ.copy()
        env['BROWSER'] = 'none'
        
        process = subprocess.Popen([
            'npm', 'start'
        ], cwd=frontend_dir, shell=True, stdout=subprocess.PIPE, 
        stderr=subprocess.STDOUT, text=True, bufsize=1, env=env)
        
        # Print frontend output
        for line in iter(process.stdout.readline, ''):
            if line.strip():
                print(f"[FRONTEND] {line.strip()}")
        
        return process
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        return None

def main():
    print("=" * 70)
    print("🛡️  IAF Human Management System - Development Server")
    print("=" * 70)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a bit for backend to start
    time.sleep(3)
    
    # Start frontend in a separate thread  
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    frontend_thread.start()
    
    print("\n" + "=" * 70)
    print("✅ IAF Human Management System is starting up!")
    print("=" * 70)
    print("🔗 Backend API: http://localhost:8000")
    print("🌐 Frontend App: http://localhost:3000")
    print("📊 Admin Panel: http://localhost:8000/admin")
    print("=" * 70)
    print("\n📝 Demo Login Roles:")
    print("   • Commander - Strategic overview and simulations")
    print("   • HR Manager - Personnel management and analytics")
    print("   • Medical Officer - Health monitoring and fitness")
    print("   • Training Officer - Skill development and training")
    print("   • Personnel - Personal dashboard and career info")
    print("\n⚠️  Press Ctrl+C to stop all services")
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down all services...")
        print("✅ All services stopped successfully!")

if __name__ == "__main__":
    main()