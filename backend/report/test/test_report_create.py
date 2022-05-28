from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from user.test.utils import generate_token

from report.models import Report, Type, Reason, Status
from report.test.reportFactory import ReportFactory
from user.models import User
from user.test.factory import UserFactory
from list.models import List
from list.test.list_factory import ListFactory
from comment.models import Comment
from comment.test.factory import CommentFactory
from recipe.models import Recipe
from recipe.test.factory import RecipeFactory


class ReportCreateTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password)
        self.client = APIClient()
        self.url = reverse('report-create')
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)
        self.list = ListFactory.create()
        self.comment = CommentFactory.create()
        self.recipe = RecipeFactory.create()
        self.user = UserFactory.create()

    @classmethod
    def tearDown(self):
        Report.objects.all().delete()
        User.objects.all().delete()
        Comment.objects.all().delete()
        List.objects.all().delete()
        Recipe.objects.all().delete()

    def test_create_report_list(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': self.list.id,
            'type': Type.LIST
        }
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        report_list = Report.objects.get(pk=data['id'])
        self.assertEqual(report_list.reason, report.reason)
        self.assertEqual(report_list.desc, report.desc)
        self.assertEqual(report_list.object_id, self.list.id)
        self.assertEqual(report_list.content_object, self.list)

    def test_create_report_user(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': self.user.id,
            'type': Type.USER
        }
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        report_user = Report.objects.get(pk=data['id'])
        self.assertEqual(report_user.reason, report.reason)
        self.assertEqual(report_user.desc, report.desc)
        self.assertEqual(report_user.object_id, self.user.id)
        self.assertEqual(report_user.content_object, self.user)

    def test_create_report_comment(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': self.comment.id,
            'type': Type.COMMENT
        }
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        report_comment = Report.objects.get(pk=data['id'])
        self.assertEqual(report_comment.reason, report.reason)
        self.assertEqual(report_comment.desc, report.desc)
        self.assertEqual(report_comment.object_id, self.comment.id)
        self.assertEqual(report_comment.content_object, self.comment)

    def test_create_report_recipe(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': self.recipe.id,
            'type': Type.RECIPE
        }
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)['result']
        report_recipe = Report.objects.get(pk=data['id'])
        self.assertEqual(report_recipe.reason, report.reason)
        self.assertEqual(report_recipe.desc, report.desc)
        self.assertEqual(report_recipe.object_id, self.recipe.id)
        self.assertEqual(report_recipe.content_object, self.recipe)

    def test_create_no_creds(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': self.recipe.id,
            'type': Type.RECIPE
        }
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_report_missing_fields(self):

        report = ReportFactory.build()

        payload = {}
        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = json.loads(response.content)
        self.assertEqual(data['desc'], ['This field is required.'])
        self.assertEqual(data['object_id'], ['This field is required.'])
        self.assertEqual(data['type'], ['This field is required.'])
        self.assertEqual(data['desc'], ['This field is required.'])
        self.assertEqual(data['desc'], ['This field is required.'])

    def test_create_report_non_existant_objects(self):

        report = ReportFactory.build()

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': '12312312',
            'type': Type.RECIPE
        } 

        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        data = json.loads(response.content)['detail']
        self.assertEqual(data,'Recipe not found')

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': '12312312',
            'type': Type.LIST
        } 

        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        data = json.loads(response.content)['detail']
        self.assertEqual(data,'List not found')

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': '12312312',
            'type': Type.COMMENT
        } 

        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        data = json.loads(response.content)['detail']
        self.assertEqual(data,'Comment not found')

        payload = {
            'reason': report.reason,
            'desc': report.desc,
            'object_id': '12312312',
            'type': Type.USER
        } 

        response = self.client.post(
            self.url, json.dumps(payload), content_type='application/json',  ** {'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        data = json.loads(response.content)['detail']
        self.assertEqual(data,'User not found')
        
