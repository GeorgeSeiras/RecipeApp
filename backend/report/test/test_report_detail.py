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


class ReportDetailTest(APITestCase):

    @classmethod
    def setUp(self):
        self.password = FuzzyText('password').fuzz()
        self.user_object = UserFactory.create(
            password_unecrypted=self.password, is_staff=True)
        self.client = APIClient()
        self.recipe = RecipeFactory.create()
        self.report = ReportFactory.create(content_object=self.recipe)
        self.url = reverse(
            'report-detail', kwargs={'report_id': self.report.id})
        self.url_non_existant = reverse(
            'report-detail', kwargs={'report_id': '123123123123'})
        user = User.objects.get(username=self.user_object.username)
        self.token = generate_token(user)
        self.list = ListFactory.create()
        self.comment = CommentFactory.create()
        self.recipe = RecipeFactory.create()
        self.user_2 = UserFactory.create()
        self.token_not_admin = generate_token(self.user_2)

    @classmethod
    def tearDown(self):
        Report.objects.all().delete()
        User.objects.all().delete()
        Comment.objects.all().delete()
        List.objects.all().delete()
        Recipe.objects.all().delete()

    def test_get_report(self):
        response = self.client.get(self.url,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)['result']
        self.assertEqual(data['id'], self.report.id)

    def test_get_non_existant_report(self):
        response = self.client.get(self.url_non_existant,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_not_admin(self):
        response = self.client.get(self.url_non_existant,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token_not_admin}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_no_creds(self):
        response = self.client.get(self.url_non_existant)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_report_pass_verdict(self):
        response = self.client.put(self.url, json.dumps({'status': Status.REMOVED}),content_type='application/json',  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report = Report.objects.get(pk=self.report.id)
        self.assertEqual(report.status, Status.REMOVED)

        response = self.client.put(self.url, json.dumps({'status': Status.CLOSED}),content_type='application/json',  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        report = Report.objects.get(pk=self.report.id)
        self.assertEqual(report.status, Status.CLOSED)

    def test_get_non_existant_report(self):
        response = self.client.put(self.url_non_existant,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_not_admin(self):
        response = self.client.put(self.url_non_existant,  ** {
            'HTTP_AUTHORIZATION': f'Bearer {self.token_not_admin}'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_no_creds(self):
        response = self.client.put(self.url_non_existant)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
