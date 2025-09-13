from django.core.management.base import BaseCommand
from personnel.models import Personnel, AirBase, Aircraft, Squadron

class Command(BaseCommand):
    help = 'Create database migrations for aircraft and base models'

    def handle(self, *args, **options):
        self.stdout.write('Creating migrations for Aircraft and Base models...')
        
        # This will be run after makemigrations
        self.stdout.write(
            self.style.SUCCESS('Run: python manage.py makemigrations')
        )
        self.stdout.write(
            self.style.SUCCESS('Then: python manage.py migrate')
        )
        self.stdout.write(
            self.style.SUCCESS('Finally: python generate_aircraft_base_data.py')
        )