
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('report',views.ReportView.as_view()), #post report
    # path('reports'), #get reports w/ query params
    # path('report/<int:report_id>') #get:view report, put:pass verdict
]

urlpatterns = format_suffix_patterns(urlpatterns)
