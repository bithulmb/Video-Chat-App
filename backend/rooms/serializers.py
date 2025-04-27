from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    host_username = serializers.CharField(source='host.username', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'host', 'host_username', 'created_at']
        read_only_fields = ['host', 'created_at']
