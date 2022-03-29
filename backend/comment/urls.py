
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path

from . import views

urlpatterns = [
    path('comment/<int:comment_id>', views.CommentDetailView.as_view()),
    path('comments/<int:comment_id>', views.GetCommentThreadById.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
