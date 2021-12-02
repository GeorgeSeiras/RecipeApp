
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('recipe', views.RecipeCreate.as_view()),
    path('recipe/<int:pk>',views.RecipeDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
