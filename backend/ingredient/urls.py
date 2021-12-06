
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('ingredient', views.IngredientCreate.as_view()),
    path('ingredient/<int:pk>', views.IngredientDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
