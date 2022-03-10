from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/teams/', include('apiteams.urls')),
    path('api/matches/', include('apimatches.urls')),
    path('api/matches/stats/', include('apistats.urls')),
    path('api/predictions/', include('apipredictions.urls')),
    path('api/', include('apiusers.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]
