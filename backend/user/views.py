from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication,BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt

from .models import User
from .serializers import UserSerializer,UserSerializerNoPassword,UserLoginSerializer

class AuthView(APIView):
    authentication_classes = [SessionAuthentication,BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,format=None):
        content ={
            'user': str(request.user),
            'auth': str(request.auth)
        }
        return Response(content)

class UserList(APIView):
    @csrf_exempt
    def get(self,request,format=None):
        users = User.objects.defer("password")
        serializer = UserSerializerNoPassword(users, many=True)
        return Response(serializer.data)

class UserDetail(APIView):
    @csrf_exempt
    def get(self,request, pk, format=None):
        try:
            user = User.objects.get(pk =pk)
            return Response(UserSerializerNoPassword(user).data,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise Http404

class UserRegister(APIView):
    @csrf_exempt
    def post(self, request, format=None):
        serializer = UserSerializer(data = request.data)
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserLogin(APIView):
    serializer_class = UserLoginSerializer

    @csrf_exempt
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.data['email'])
            if(user.check_password(serializer.data['password'])):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response('Incorrect username or password',status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
                return Response('Incorrect username or password',status=status.HTTP_401_UNAUTHORIZED)

