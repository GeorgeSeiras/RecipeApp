from django.contrib import admin

from .models import RecipeImage

class RecipeImageAdmin(admin.ModelAdmin):
    pass
admin.site.register(RecipeImage,RecipeImageAdmin)
