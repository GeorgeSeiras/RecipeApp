
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('list', views.ListCreate.as_view()),
    path('list/<int:list_id>', views.ListDetail.as_view()),
    path('list/<int:list_id>/recipe', views.ListRecipe.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
