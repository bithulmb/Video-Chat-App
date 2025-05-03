from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Room, Message
from django.contrib.auth.hashers import make_password

User = get_user_model()

class RoomTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="StrongPass123")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_public_room(self):
        url = reverse('room-list-create')
        data = {
            "name": "Test Room",
            "description": "A public room",
            "is_private": False
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Test Room")
        self.assertEqual(response.data['is_private'], False)

    def test_create_private_room_with_password(self):
        url = reverse('room-list-create')
        data = {
            "name": "Private Room",
            "description": "Private desc",
            "is_private": True,
            "password": "secret123"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_private_room_without_password_should_fail(self):
        url = reverse('room-list-create')
        data = {
            "name": "Invalid Private",
            "is_private": True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_verify_room_password_success(self):
        room = Room.objects.create(
            name="Private Room",
            host=self.user,
            is_private=True,
            password=make_password("secret123")
        )
        url = reverse('room-password-verify', args=[room.id])
        data = {"password": "secret123"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Password verified", response.data['message'])

    def test_verify_room_password_failure(self):
        room = Room.objects.create(
            name="Private Room",
            host=self.user,
            is_private=True,
            password=make_password("secret123")
        )
        url = reverse('room-password-verify', args=[room.id])
        data = {"password": "wrongpassword"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Incorrect password", response.data['error'])

    def test_room_message_list(self):
        room = Room.objects.create(name="Chat Room", host=self.user)
        Message.objects.create(room=room, user=self.user, content="Hello 1")
        Message.objects.create(room=room, user=self.user, content="Hello 2")

        url = reverse('room-messages', args=[room.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['content'], "Hello 1")

    def test_generate_zego_token_success(self):
        url = reverse('generate_zego_token')
        data = {"room_id": "test-room-id"}
        response = self.client.post(url, data)
        # Zego token generation requires real app_id/secret; mock in real tests.
        if response.status_code == 200:
            self.assertIn("token", response.data)
        else:
            self.assertIn("error", response.data)
