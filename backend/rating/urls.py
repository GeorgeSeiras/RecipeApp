
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('recipe/<int:recipe_id>/rating', views.RateRecipe.as_view()),
    path('recipe/<int:recipe_id>/rating/average', views.RecipeRatingAverage.as_view()),
    path('recipes/rating/average', views.RecipesRatingAverage.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
