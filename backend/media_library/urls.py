from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('folder',views.FolderView.as_view(),name='folder-create'),
    path('foldermedia',views.FolderAndMediaView.as_view(),name='get-media-and-folders'),
    path('folder/<int:folder_id>',views.FolderDetail.as_view(),name='folder-view'),
    path('folder/media',views.FolderMedia.as_view()), 
    path('media',views.MediaCreate.as_view(),name='create-media'),
    path('media/<int:media_id>',views.MediaDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
