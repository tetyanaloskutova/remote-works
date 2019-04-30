release: python manage.py migrate --no-input
web: uwsgi remote_works/wsgi/uwsgi.ini
celeryworker: celery worker -A remote_works.celeryconf:app --loglevel=info -E
