from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import json
from factory.fuzzy import FuzzyText
from rest_framework_simplejwt.tokens import RefreshToken

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


class ReportQueryTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password, is_staff=True)
        self.client = APIClient()
        self.url = reverse('report-query')
        user = User.objects.get(username=self.user_object.username)
        refresh = RefreshToken.for_user(user)
        self.token = refresh.access_token
        self.list = ListFactory.create()
        self.comment = CommentFactory.create()
        self.recipe = RecipeFactory.create()
        self.user_2 = UserFactory.create()
        refresh = RefreshToken.for_user(self.user_2)
        self.token_not_admin = refresh.access_token

    @classmethod
    def tearDown(self):
        Report.objects.all().delete()
        User.objects.all().delete()
        Comment.objects.all().delete()
        List.objects.all().delete()
        Recipe.objects.all().delete()

    def test_query_report(self):
        recipe = RecipeFactory.create()
        for i in range(0, 20):
            ReportFactory.create(content_object=recipe)
        report_1 = ReportFactory.create(
            content_object=recipe, status=Status.CLOSED)
        report_2 = ReportFactory.create(
            content_object=recipe, status=Status.CLOSED)

        response = self.client.get(self.url,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']), 16)
        self.assertIsNotNone(data['links']['next'])

        response = self.client.get(self.url, {'status': 'CLOSED'}, ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        ids = []
        for item in data['results']:
            ids.append(item['id'])
        self.assertIn(report_1.id, ids)
        self.assertIn(report_2.id, ids)

    def test_query_reports_no_creds(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_query_reports_no_admin(self):
        response = self.client.get(self.url, ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token_not_admin}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)