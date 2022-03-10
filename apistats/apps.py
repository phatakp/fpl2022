from django.apps import AppConfig


class ApistatsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apistats'

    def ready(self) -> None:
        import apistats.signals
