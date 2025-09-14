#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date, timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iaf_hms.settings')
django.setup()

from django.core.management import execute_from_command_line

def quick_setup():
    print("Quick IAF Backend Setup...")
    
    # Create superuser data
    from django.contrib.auth.models import User
    
    try:
        # Create admin user if doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@iaf.gov.in', 'admin123')
            print("Admin user created: admin/admin123")
        
        print("Backend is ready!")
        print("Starting Django server...")
        
        # Start the server
        execute_from_command_line(['manage.py', 'runserver', '8000'])
        
    except Exception as e:
        print(f"Setup error: {str(e)}")
        print("Starting server anyway...")
        execute_from_command_line(['manage.py', 'runserver', '8000'])

if __name__ == '__main__':
    quick_setup()