from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path("image/user", views.UserImageView.as_view(), name='image-user'),
    path("recipe/image/<int:image_id>", views.RecipeImageDetail.as_view()),
    path("recipe/<int:recipe_id>/image", views.RecipeImageView.as_view(),name='image-recipe'),
    path("recipe/<int:recipe_id>/images", views.RecipeImagesView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
