from django.apps import AppConfig


class ApimatchesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apimatches'

    def ready(self) -> None:
        import apimatches.signals
