import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Room, Message
from channels.db import database_sync_to_async
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):

    active_users = dict()

    async def connect(self):
        
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Check if the user is authenticated
        user = self.scope["user"]
        if user is None and not user.is_authenticated:
            await self.close() 
            return
        
        #initialize room in active_users if not exists
        if self.room_id not in ChatConsumer.active_users:
            ChatConsumer.active_users[self.room_id] = set()
        
        # Add user to the active set
        ChatConsumer.active_users[self.room_id].add(user.username)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send_user_count()

    async def disconnect(self, close_code):
        user = self.scope["user"]

        if self.room_id in ChatConsumer.active_users:
            ChatConsumer.active_users[self.room_id].discard(user.username)

            if not ChatConsumer.active_users[self.room_id]:                
                del ChatConsumer.active_users[self.room_id]
        

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        await self.send_user_count()    

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        user = self.scope['user']

        message_instance = await self.save_message(user, message)
        serialized_message = MessageSerializer(message_instance).data

        # Broadcast message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized_message,
                
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            
        }))
    
    async def user_count(self, event):
        count = event['count']

        # Send active user count to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'user_count',
            'count': count,
        }))
    
    async def send_user_count(self):
        count = len(ChatConsumer.active_users.get(self.room_id, set()))

        # Broadcast to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_count',
                'count': count,
            }
        )
    

    @database_sync_to_async
    def save_message(self, user, message):
        room = Room.objects.get(id=self.room_id)
        return Message.objects.create(room=room, user=user, content=message)
