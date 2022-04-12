from django.conf.urls import include
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('user/me', views.UserMe.as_view(), name='user-me'),
    path('user/password', views.ChangePassword.as_view(), name='user-password'),
    path('user/register', views.UserRegister.as_view(), name='user-register'),
    path('user/recipe', views.UserRecipes.as_view()),
    path("image/user", views.UserImageView.as_view(), name='image-user'),
    path('user/<int:pk>', views.UserDetail.as_view(), name='user-by-id'),
    path('user/<str:username>', views.UserByUsername.as_view(), name='user-by-username'), 
    path('user/<int:user_id>/list', views.UserLists.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)
