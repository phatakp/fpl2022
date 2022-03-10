release: sh -c "python manage.py migrate && python fix_html.py && python manage.py collectstatic"
web: gunicorn backend.wsgi --timeout 15 --keep-alive 5 --log-level debug --log-file -