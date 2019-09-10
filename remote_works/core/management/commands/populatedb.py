from io import StringIO

from django.apps import apps
from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection

from ...utils import create_superuser
from ...utils.random_data import (
    add_address_to_admin, create_collections_by_schema, create_menus,
    create_tasks, create_page, create_skill_sales,
    create_skills_by_schema, create_delivery_zones, create_users,
    create_vouchers, set_homepage_collection)


class Command(BaseCommand):
    help = 'Populate database with test objects'
    placeholders_dir = r'remote_works/static/placeholders/'

    def add_arguments(self, parser):
        parser.add_argument(
            '--createsuperuser',
            action='store_true',
            dest='createsuperuser',
            default=False,
            help='Create admin account')
        parser.add_argument(
            '--withoutimages',
            action='store_true',
            dest='withoutimages',
            default=False,
            help='Don\'t create skill images')
        parser.add_argument(
            '--withoutsearch',
            action='store_true',
            dest='withoutsearch',
            default=False,
            help='Don\'t update search index')
        parser.add_argument(
            '--skipsequencereset',
            action='store_true',
            dest='skipsequencereset',
            default=False,
            help='Don\'t reset SQL sequences that are out of sync.')
        parser.add_argument(
            '--defaulttemplate',
            type=str,
            default='db.json',
            help='json file with the data to populate the db')

    def make_database_faster(self):
        """Sacrifice some of the safeguards of sqlite3 for speed.

        Users are not likely to run this command in a production environment.
        They are even less likely to run it in production while using sqlite3.
        """
        if 'sqlite3' in connection.settings_dict['ENGINE']:
            cursor = connection.cursor()
            cursor.execute('PRAGMA temp_store = MEMORY;')
            cursor.execute('PRAGMA synchronous = OFF;')

    def populate_search_index(self):
        if settings.ES_URL:
            call_command('search_index', '--rebuild', force=True)

    def sequence_reset(self):
        """Runs SQL sequence reset on all remote_works.* apps.

        When a value is manually assigned to an auto-incrementing field
        it doesn't update the field's sequence, which might cause a conflict
        later on.
        """
        commands = StringIO()
        for app in apps.get_app_configs():
            if 'remote_works' in app.name:
                call_command(
                    'sqlsequencereset', app.label,
                    stdout=commands, no_color=True)
        with connection.cursor() as cursor:
            cursor.execute(commands.getvalue())

    def handle(self, *args, **options):
        if options['createsuperuser']:
            credentials = {'email': 'admin@example.com', 'password': 'admin'}
            msg = create_superuser(credentials)
            self.stdout.write(msg)
            add_address_to_admin(credentials['email'])

        default_template = 'db.json'
        if options['defaulttemplate']:
            default_template = options['defaulttemplate']

        self.make_database_faster()
        create_images = not options['withoutimages']
        for msg in create_delivery_zones():
            self.stdout.write(msg)
        for msg in create_users(20):
            self.stdout.write(msg)
        create_skills_by_schema(self.placeholders_dir, create_images, default_template)
        self.stdout.write('Created skills')
        for msg in create_skill_sales(5):
            self.stdout.write(msg)
        for msg in create_vouchers():
            self.stdout.write(msg)
        for msg in create_collections_by_schema(self.placeholders_dir):
            self.stdout.write(msg)
        for msg in set_homepage_collection():
            self.stdout.write(msg)
        for msg in create_page():
            self.stdout.write(msg)
        for msg in create_menus():
            self.stdout.write(msg)

        if not options['withoutsearch']:
            self.populate_search_index()
        if not options['skipsequencereset']:
            self.sequence_reset()
        for msg in create_tasks(20):
            self.stdout.write(msg)
