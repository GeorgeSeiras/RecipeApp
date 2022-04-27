
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('report', views.ReportCreateView.as_view()),
    path('reports', views.ReportQuery.as_view()),
    path('report/<int:report_id>', views.ReportView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
