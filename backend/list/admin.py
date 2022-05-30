from django.contrib import admin

from .models import List,RecipesInList

class ListAdmin(admin.ModelAdmin):
    pass
admin.site.register(List,ListAdmin)

class RecipesInListAdmin(admin.ModelAdmin):
    pass
admin.site.register(RecipesInList,RecipesInListAdmin)