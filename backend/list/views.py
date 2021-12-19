from django.http.response import JsonResponse
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from django.db import transaction

from backend.decorators import user_required
from list.serializers import ListCreateSerializer
from list.models import List
from user.models import User


class ListCreate(APIView):

    @user_required
    def post(self, request):
        with transaction.atomic():
            try:
                user = User.objects.get(username=request.user)
            except User.DoesNotExist:
                raise NotFound({'message': 'User does not exist'})
            serializer = ListCreateSerializer(data=request.data)
            not serializer.is_valid(raise_exception=True)
            list = List.objects.create(user=user, **serializer.data)
            return JsonResponse({
                'status':'ok',
                'data':list.to_dict()
            })
