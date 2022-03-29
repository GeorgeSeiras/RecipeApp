from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.db import transaction
from django.http.response import JsonResponse

from utils.customPagination import myPagination
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
            for key, value in serializer.validated_data.items():
                setattr(comment, key, value)
            comment.save()
            return JsonResponse({'result': comment.to_dict()})

    @user_required
    def delete(self, request, comment_id):
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
            setattr(comment, 'deleted', True)
            comment.save()
            return JsonResponse({'result': comment.to_dict()})


class GetCommentThreadById(APIView, myPagination):

    def get(self, request, comment_id):
        with transaction.atomic():
            try:
                parent = Comment.objects.get(pk=comment_id)
            except Comment.DoesNotExist:
                raise NotFound({'message': 'Comment not found'})
            setattr(parent,'parent',None)
            commentList = [parent]
            depth = 0
            parentIds = [parent.id]
            while(True and depth < 9):
                comments = Comment.objects.filter(parent__in=parentIds)
                parentIds = []
                if(len(comments) > 0):
                    for comment in comments:
                        if(comment.parent != None):
                            parentIds.append(comment.id)
                        commentList.append(comment)
                    depth += 1
                else:
                    break
            objects = Comment.comments_to_list_sorted(commentList)
            page = self.paginate_queryset(objects, request)
            response = self.get_paginated_response(page)
            return response
