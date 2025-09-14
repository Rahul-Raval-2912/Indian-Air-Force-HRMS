#!/usr/bin/env python
import os
import sys
import django
import subprocess

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

def setup_backend():
    print("Setting up IAF Backend Services...")
    
    try:
        # Delete existing migrations
        migrations_dir = 'personnel/migrations'
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    os.remove(os.path.join(migrations_dir, file))
                    print(f"Removed {file}")
        
        # Create fresh migrations without prompts
        print("Creating fresh migrations...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'makemigrations', 'personnel', 
            '--empty', '--name', 'fresh_start'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Fresh migrations created successfully")
        else:
            print(f"Migration creation failed: {result.stderr}")
            return False
        
        # Apply migrations
        print("Applying migrations...")
        result = subprocess.run([
            sys.executable, 'manage.py', 'migrate'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("Migrations applied successfully")
        else:
            print(f"Migration failed: {result.stderr}")
            return False
        
        # Load sample data
        print("Loading sample data...")
        from load_sample_data import create_sample_data
        create_sample_data()
        
        print("Backend setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"Setup failed: {str(e)}")
        return False

if __name__ == '__main__':
    setup_backend()