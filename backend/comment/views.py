from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.db import transaction
from django.http.response import JsonResponse

from .models import Comment
from .serializers import CreateCommentSerializer
from backend.decorators import user_required
from recipe.models import Recipe
from user.models import User


class createCommentView(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message':'User not found'})
            serializer = CreateCommentSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            comment = Comment.objects.create(
                user=user, **serializer.validated_data)
            return JsonResponse({'result': comment.to_dict()})


class CommentDetailView(APIView):

    def get(self, request, comment_id):
        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            raise  NotFound({'message':'Comment not found'})
        return JsonResponse({'result':comment.to_dict()})  

    @user_required
    def delete(self, request, comment_id):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message':'User not found'})
            try:
                comment = Comment.objects.get(pk=comment_id)
            except Comment.DoesNotExist:
                raise  NotFound({'message':'Comment not found'})
            if(user != comment.user):
                raise PermissionDenied({"message':'You cannot delete another user's comments"})
            comment.delete()
            return JsonResponse({})
