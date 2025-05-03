from rest_framework import serializers
from .models import Room, Message
from django.contrib.auth.hashers import make_password, check_password

class RoomSerializer(serializers.ModelSerializer):
    host_username = serializers.CharField(source='host.username', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'host', 'host_username', 'description', 'is_private', 'created_at']
        read_only_fields = ['host', 'created_at']
    
    def validate(self, data):

        is_private = data.get('is_private', False)
        password = self.initial_data.get('password', None)

        if is_private and not password:
            raise serializers.ValidationError({"password": "Password is required for private rooms."})
        if not is_private and password:
            raise serializers.ValidationError({"password": "Password should not be provided for public rooms."})

        if is_private and password:
            # Hash the password before saving
            data['password'] = make_password(password)
        else:
            data['password'] = None

        return data



class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'username', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp', 'username']
