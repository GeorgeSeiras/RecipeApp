from django.contrib import admin

from .models import Recipe,Ingredient

class RecipeAdmin(admin.ModelAdmin):
    pass
admin.site.register(Recipe,RecipeAdmin)

class IngredientAdmin(admin.ModelAdmin):
    pass
admin.site.register(Ingredient,IngredientAdmin)