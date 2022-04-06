
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('list', views.ListCreate.as_view(), name='list-create'),
    path('list/<int:list_id>', views.ListDetail.as_view(), name='list-detail'),
    path('lists/recipe/<int:recipe_id>',
         views.UserListsWithRecipe.as_view(), name='lists-with-recipe'),
    path('list/<int:list_id>/recipes',
         views.ListRecipes.as_view(), name='list-get-recipes'),
    path('list/<int:list_id>/recipe/<int:recipe_id>',
         views.ListRecipe.as_view(), name='list-recipe')
]

urlpatterns = format_suffix_patterns(urlpatterns)
