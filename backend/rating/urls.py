
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('recipe/<int:recipe_id>/rating', views.RateRecipe.as_view(),name='rating'),
    path('recipe/<int:recipe_id>/rating/average', views.RecipeRatingAverage.as_view(),name='rating-average'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
