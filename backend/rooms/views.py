from rest_framework import generics, permissions
from .models import Room,Message
from .serializers import RoomSerializer, MessageSerializer

class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all().order_by('-created_at')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomMessagesList(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return Message.objects.filter(room__id=room_id).order_by('timestamp')


