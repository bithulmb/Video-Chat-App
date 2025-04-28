from rest_framework import generics, permissions
from .models import Room,Message
from .serializers import RoomSerializer, MessageSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from django.conf import settings
import json
from src import token04

User = get_user_model()
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



class GenerateZegoTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get parameters from the request body
        user_id = str(request.user.id)
        room_id = request.data.get('room_id', '')  

     
        if not room_id:
            return Response(
                {"error": "room_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.get(id=user_id) 
        
        if request.user != user:
            return Response({"error": "You are not authorized to generate this token"}, status=status.HTTP_403_FORBIDDEN)
        
        # Retrieve app_id and server_secret from environment variables
        app_id = int(settings.ZEGO_APP_ID)  
        server_secret = settings.ZEGO_SERVER_SECRET
        effective_time_in_seconds = 3600  

        try:
           
            if room_id:
                
                payload = {
                    "room_id": room_id,
                    "privilege": {
                        1: 1,  # Login privilege enabled
                        2: 1   # Publish privilege enabled
                    },
                    "stream_id_list": None  # No specific stream IDs
                }
                payload_json = json.dumps(payload)
            else:
                # General token with empty payload
                payload_json = ""

            # Generate the token using Zego's token04 module
            token_info = token04.generate_token04(
                app_id=app_id,
                user_id=user_id,
                secret=server_secret,
                effective_time_in_seconds=effective_time_in_seconds,
                payload=payload_json
            )

            # Check for errors in token generation
            if token_info.error_code != token04.ERROR_CODE_SUCCESS:
                return Response(
                    {
                        "error": "Failed to generate token",
                        "error_code": token_info.error_code,
                        "error_message": token_info.error_message
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Return the generated token
            return Response(
                {"token": token_info.token},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    