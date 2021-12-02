from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication,BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.http import Http404
from django.forms.models import model_to_dict

from .models import User
from .serializers import UserSerializer,UserSerializerNoPassword,UserLoginSerializer
from backend.decorators import user_required,admin_required

class UserList(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializerNoPassword
    
    @admin_required
    def get(self,request,format=None):
        users = User.objects.defer("password")
        serializer = UserSerializerNoPassword(users, many=True)
        return Response(serializer.data)

class UserDetail(APIView):
    @admin_required
    def get(self,request, pk, format=None):
        try:
            user = User.objects.get(pk =pk)
            return Response(UserSerializerNoPassword(user).data,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise Http404

class UserRegister(APIView):
    def post(self, request, format=None):
        with transaction.atomic():
            serializer = UserSerializer(data = request.data)
            if (not serializer.is_valid()):
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()
            res = serializer.data
            del res['password']
            return Response(res, status=status.HTTP_201_CREATED)
