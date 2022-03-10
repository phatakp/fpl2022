from ._base import *

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

try:
    from .local import *
except ImportError:
    # Production Settings goes here
    import dj_database_url
    import django_heroku

    ALLOWED_HOSTS = ['fpl2022.herokuapp.com']
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware",)
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    DATABASES['default'] = db_from_env = dj_database_url.config(
        conn_max_age=600)
    CORS_ALLOWED_ORIGINS = [
        "https://fpl2022.herokuapp.com",
    ]
    django_heroku.settings(locals())
