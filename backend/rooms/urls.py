from django.urls import path
from .views import RoomListCreateView, RoomDetailView, RoomMessagesList

urlpatterns = [
    path('rooms/', RoomListCreateView.as_view(), name="room-list-create"),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name="room-detail"),
    path('rooms/<int:room_id>/messages/', RoomMessagesList.as_view(), name='room-messages')

]
