
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('recipe', views.RecipeCreate.as_view(), name='recipe-create'),
    path('recipes', views.RecipesQuery.as_view(), name='recipe-query'),
    path('recipe/<int:pk>', views.RecipeDetail.as_view(), name='recipe-detail'),
    path('recipe/<int:recipe_id>/hitcount', views.RecipeHitView.as_view()),
    path('recipe/<int:recipe_id>/comment',
         views.createCommentView.as_view(), name='comment'),
    path('recipe/<int:recipe_id>/ingredient',
         views.IngredientCreate.as_view()),
    path('recipe/<int:recipe_id>/step', views.StepCreateView.as_view()),
    path('recipe/<int:recipe_id>/comments',
         views.RecipeCommentsView.as_view()),
    path('recipe/<int:recipe_id>/ingredient/<int:ingr_id>',
         views.IngredientDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
