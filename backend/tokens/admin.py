from django.contrib import admin

from .models import RegistrationToken

class RegistrationTokenAdmin(admin.ModelAdmin):
    pass
admin.site.register(RegistrationToken,RegistrationTokenAdmin)