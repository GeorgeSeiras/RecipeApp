
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('comment/<int:comment_id>',
         views.CommentDetailView.as_view(), name='comment-detail'),
    path('comments/<int:comment_id>',
         views.GetCommentThreadById.as_view(), name='comments-thread-by-id')
]

urlpatterns = format_suffix_patterns(urlpatterns)
