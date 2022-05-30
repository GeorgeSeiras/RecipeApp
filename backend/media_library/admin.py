from django.contrib import admin

from .models import Folder,FolderImage

class FolderAdmin(admin.ModelAdmin):
    pass
admin.site.register(Folder,FolderAdmin)

class FolderImageAdmin(admin.ModelAdmin):
    pass
admin.site.register(FolderImage,FolderImageAdmin)