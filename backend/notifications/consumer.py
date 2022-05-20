import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth.models import AnonymousUser

from user.models import User


class NotificationConsumer(AsyncWebsocketConsumer):

    async def websocket_connect(self, event):
        user = self.scope['url_route']['kwargs']['username']
        room = f"user_{user}"
        self.room_name = room
        await self.channel_layer.group_add(
            room,
            self.channel_name
        )
        await self.accept()

    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def send_notification(self, event):
        await self.send(json.dumps({
            "type": "send_notification",
            "data": event
        }))
