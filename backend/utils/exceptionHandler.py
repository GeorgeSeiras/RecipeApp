from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import exception_handler

def custom_exception_handler(exc,context):
    response = exception_handler(exc,context)
    print('i am here')
    print(response)
    if response is not None:
        if response.status_code == 500 or response.status_code == 40:
            return JsonResponse(response,status=response.status_code)
        else:
            response.data['status_code'] = response.status_code
    return response