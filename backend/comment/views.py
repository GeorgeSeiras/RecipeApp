from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.db import transaction
from django.http.response import JsonResponse

from .models import Comment
from .serializers import CreateCommentSerializer, PatchCommentSerializer
from backend.decorators import user_required
from recipe.models import Recipe
from user.models import User

class CommentDetailView(APIView):

    def get(self, request, comment_id):
        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            raise NotFound({'message': 'Comment not found'})
        return JsonResponse({'result': comment.to_dict()})

    @user_required
    def patch(self, request, comment_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User not found'})
            try:
                comment = Comment.objects.get(pk=comment_id)
            except Comment.DoesNotExist:
                raise NotFound({'message': 'Comment not found'})
            if(user != comment.user):
                raise PermissionDenied(
                    {"message':'You cannot alter another user's comments"})
            serializer = PatchCommentSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            for key,value in serializer.validated_data.items():
                setattr(comment,key,value)
            comment.save()
            return JsonResponse({'result':comment.to_dict()})