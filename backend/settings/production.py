from ._base import *

try:
    from .local import *
except ImportError:
    print('Pointing to Prod')

    # Production Settings goes here
    import dj_database_url
    import django_heroku
    THIRD_PARTY_APPS += ['storages', ]
    INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

    ALLOWED_HOSTS = ['fpl2022.herokuapp.com']
    DATABASES['default'] = db_from_env = dj_database_url.config(
        conn_max_age=600)
    CORS_ALLOWED_ORIGINS = [
        "https://fpl2022.herokuapp.com",
    ]
    AWS_ACCESS_KEY_ID = getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = getenv("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = getenv("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_FILE_OVERWRITE = True
    AWS_DEFAULT_ACL = None
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'
    django_heroku.settings(locals())
