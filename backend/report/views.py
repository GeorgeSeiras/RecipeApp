from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from django.db import transaction
from django.db.models import Q

from utils.customPagination import myPagination
from .models import Report, Type
from user.models import User
from recipe.models import Recipe
from list.models import List
from comment.models import Comment
from backend.decorators import user_required, admin_required
from .serializers import ReportCreateSerializer, ReportQuerySerializer, ReportSerializer, ReportVerdictSerializer


class ReportCreateView(APIView):

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
                user=serializer.validated_data['user'],
                reason=serializer.validated_data['reason'],
                desc=serializer.validated_data['desc'],
                status=serializer.validated_data['status'],
                content_object=content_object
            )
            report_json = ReportSerializer(report)
            return JsonResponse({'result': report_json.data})


class ReportView(APIView):

    @admin_required
    def get(self,request,report_id):
        try:
            report = Report.objects.get(pk=report_id)
        except Report.DoesNotExist:
            raise NotFound('Report not found')
        response = ReportSerializer(report)
        return JsonResponse({'result': response.data})

    @admin_required
    def put(self, request, report_id):
        with transaction.atomic():
            try:
                report = Report.objects.get(pk=report_id)
            except Report.DoesNotExist:
                raise NotFound('Report not found')
            serializer = ReportVerdictSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            report.status = serializer.validated_data['status']
            report.save()
            response = ReportSerializer(report)
            return JsonResponse({'result': response.data})

class ReportQuery(APIView,myPagination):

    @admin_required
    def get(self,request):
        serializer = ReportQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        query = Q()
        if 'status' in serializer.validated_data:
            query &=Q(status__iexact=serializer.validated_data['status'])
        reports = Report.objects.filter(query)
        objects = []
        for report in reports:
            objects.append(ReportSerializer(report).data)
        page = self.paginate_queryset(objects, request)
        response = self.get_paginated_response(page)
        return response
