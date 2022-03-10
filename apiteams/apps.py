from django.apps import AppConfig


class ApiteamsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apiteams'

    def ready(self) -> None:
        import apiteams.signals
