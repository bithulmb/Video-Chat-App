from django.urls import path,re_path
from . import consumers

websocket_urlpatterns = [
    path('ws/rooms/<str:room_id>/', consumers.ChatConsumer.as_asgi()),
    
]
