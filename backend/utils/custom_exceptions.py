from rest_framework.exceptions import APIException
from django.utils.encoding import force_text
from rest_framework import status


class CustomException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A server error occurred.'

    def __init__(self, detail, status_code):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = {'message': force_text(detail)}
        else:
            self.detail = {'message': force_text(self.default_detail)}


class CustomExceptionUpload(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A server error occurred.'

    def __init__(self, detail, status_code):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = {'error': {'message': force_text(detail)}}
        else:
            self.detail = {
                'error': {'message': force_text(self.default_detail)}}
