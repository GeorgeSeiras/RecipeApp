from rest_framework import serializers
from generic_relations.relations import GenericRelatedField

from user.models import User
from user.serializers import UserSerializer
from recipe.models import Recipe
from recipe.serializers import RecipeModelSerializer
from list.models import List
from list.serializers import ListSerializer
from comment.models import Comment
from comment.serializers import CommentSerializer
from .models import Report, Reason, Status, Type


class ReportVerdictSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Status.choices)


class ReportQuerySerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Status.choices, required=False)


class ReportSerializer(serializers.ModelSerializer):
    content_object = GenericRelatedField({
        User: UserSerializer(),
        List: ListSerializer(),
        Recipe: RecipeModelSerializer(),
        Comment: CommentSerializer()
    })

    class Meta:
        model = Report
        fields = '__all__'


class ReportCreateSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    reason = serializers.ChoiceField(choices=Reason.choices, default=Reason.OFFENSIVE_CONTENT)
    desc = serializers.CharField(max_length=150)
    status = serializers.ChoiceField(
        choices=Status.choices,default=Status.PENDING)
    object_id = serializers.IntegerField()
    type = serializers.ChoiceField(choices=Type.choices)
