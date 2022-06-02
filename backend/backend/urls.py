"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("user.urls")),
    path('api/', include('recipe.urls')),
    path('api/', include('rating.urls')),
    path('api/', include('list.urls')),
    path('api/', include('comment.urls')),
    path('api/', include('image.urls')),
    path('api/', include('media_library.urls')),
    path('api/',include('report.urls')),
    path('api/',include('notifications.urls')),
    path('api/',include('tokens.urls')),
    #auth
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')),
    #password-reset
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
