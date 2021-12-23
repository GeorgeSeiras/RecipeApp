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
                raise NotFound('User not found')
            serializer = CreateCommentSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            comment = Comment.objects.create(
                user=user, **serializer.validated_data)
            return JsonResponse({'result': comment.to_dict()})
    
class DeleteCommentView(APIView):

    @user_required
    def delete(self, request):
        return JsonResponse({'result':''})
