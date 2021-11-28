from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

# router = routers.DefaultRouter()
# router.register(r'users',UserViewSet.get)

urlpatterns = [
    # path('',include(router.urls)),
    # path('auth/', include('rest_auth.urls')),
    # path('auth/register',)
    # path('api/token/', jwt_views.TokenObtainPairView.as_view(),
    #     name='token_obtain_pair'),
    # path('api/token/refresh', jwt_views.TokenRefreshView.as_view(),
    #     name='token_refresh')
    path('user', views.UserList.as_view()),
    path('user/register', views.UserRegister.as_view()),
    path('user/login',views.UserLogin.as_view()),
    path('user/<int:pk>', views.UserDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)