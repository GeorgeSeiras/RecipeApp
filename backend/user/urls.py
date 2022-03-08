from django.conf.urls import include
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('user', views.UserList.as_view()),
    path('user/me', views.UserMe.as_view()),
    path('user/password',views.ChangePassword.as_view()),
    path('user/register', views.UserRegister.as_view()),
    path('user/recipe', views.UserRecipes.as_view()),
    path('user/<int:pk>', views.UserDetail.as_view()),
    path('user/<str:username>', views.UserByUsername.as_view()),
    path('user/<int:user_id>/list', views.UserLists.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
