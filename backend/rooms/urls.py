from django.urls import path
from .views import RoomListCreateView, RoomDetailView, RoomMessagesList,GenerateZegoTokenView,RoomPasswordVerifyView

urlpatterns = [
    path('rooms/', RoomListCreateView.as_view(), name="room-list-create"),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name="room-detail"),
    path('rooms/<int:room_id>/messages/', RoomMessagesList.as_view(), name='room-messages'),
    path('rooms/<int:room_id>/verify-password/', RoomPasswordVerifyView.as_view(), name='room-password-verify'),
    path('video/generate-zego-token/', GenerateZegoTokenView.as_view(), name='generate_zego_token'),


]
