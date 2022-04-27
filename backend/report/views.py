from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.db import transaction

from utils.customPagination import myPagination
from .models import Report, Type
from user.models import User
from recipe.models import Recipe
from list.models import List
from comment.models import Comment
from backend.decorators import user_required, admin_required
from .serializers import ReportCreateSerializer, ReportSerializer
from utils.custom_exceptions import CustomException


class ReportView(APIView, myPagination):

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound('User not found')
            serializer = ReportCreateSerializer(data={
                **request.data,
                'user': user.id
            })
            serializer.is_valid(raise_exception=True)
            content_object = None
            if(serializer.validated_data['type'] == Type.USER):
                try:
                    content_object = User.objects.get(
                        pk=serializer.validated_data['object_id'])
                except User.DoesNotExist:
                    raise NotFound('User not found')
            elif(serializer.validated_data['type'] == Type.RECIPE):
                try:
                    content_object = Recipe.objects.get(
                        pk=serializer.validated_data['object_id'])
                except Recipe.DoesNotExist:
                    raise NotFound('Recipe not found')
            elif(serializer.validated_data['type'] == Type.LIST):
                try:
                    content_object = List.objects.get(
                        pk=serializer.validated_data['object_id'])
                except List.DoesNotExist:
                    raise NotFound('List not found')
            elif(serializer.validated_data['type'] == Type.COMMENT):
                try:
                    content_object = Comment.objects.get(
                        pk=serializer.validated_data['object_id'])
                except Comment.DoesNotExist:
                    raise NotFound('Comment not found')
            report = Report.objects.create(
                user = serializer.validated_data['user'],
                reason = serializer.validated_data['reason'],
                desc = serializer.validated_data['desc'],
                status = serializer.validated_data['status'],
                content_object = content_object
            )
            report_json = ReportSerializer(report)
            return JsonResponse({'result': report_json.data})
