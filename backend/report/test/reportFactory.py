from factory import django, SubFactory, LazyAttribute
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyChoice
from faker import Faker as FakerClass

from report.models import Report, Reason, Status, Type

from user.test.factory import UserFactory

fake = FakerClass()


class ReportFactory(DjangoModelFactory):
    class Meta:
        model = Report

    user = SubFactory(UserFactory)
    desc = LazyAttribute(lambda n: fake.word()[:25])
    reason = FuzzyChoice(Reason)
    status = FuzzyChoice(Status)
    