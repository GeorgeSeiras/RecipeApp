from datetime import timedelta
import uuid
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.views import APIView
from django.db import transaction
from rest_framework.exceptions import NotFound
from rest_framework import status

from utils.emailProvider import send_verification_email
from utils.custom_exceptions import CustomException
from .models import RegistrationToken
from user.models import User
from .serializers import NewTokenSerializer


class Token(APIView):

    def get(self, request, token):
        with transaction.atomic():
            try:
                token = RegistrationToken.objects.get(uuid=uuid.UUID(token))
            except RegistrationToken.DoesNotExist:
                raise NotFound('Token not found')
            if(token.expired):
                raise CustomException(
                    'This token has already been used or has expired', status.HTTP_400_BAD_REQUEST)
            if(timezone.now() - token.created_at > timedelta(hours=24)):
                raise CustomException(
                    'This token has expired', status.HTTP_400_BAD_REQUEST)
            token.user.is_active = True
            token.expired = True
            token.user.save()
            token.save()
            return JsonResponse({'result':'ok'},status=status.HTTP_200_OK)


class TokenNew(APIView):

    def post(self, request):
        serializer = NewTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            try:
                user = User.objects.get(
                    email=serializer.validated_data['email'])
            except User.DoesNotExist:
                raise NotFound('User not found')
            if user.is_active:
                raise CustomException(
                    'This email is tied with an already activated user', status.HTTP_400_BAD_REQUEST)
            RegistrationToken.objects.filter(
                user=user).update(expired=True)
            send_verification_email(user.id,user.email)
            return JsonResponse({'result':'ok'},status=status.HTTP_200_OK)