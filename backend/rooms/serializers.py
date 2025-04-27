from rest_framework import serializers
from .models import Room, Message

class RoomSerializer(serializers.ModelSerializer):
    host_username = serializers.CharField(source='host.username', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'host', 'host_username', 'created_at']
        read_only_fields = ['host', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'username', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'username']
