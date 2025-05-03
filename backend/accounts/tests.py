from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class UserRegistrationTests(APITestCase):
    def setUp(self):
        self.url = reverse('register')  

    def test_successful_registration(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "StrongPass123",
            "first_name": "John",
            "last_name": "Doe"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_duplicate_email(self):
        User.objects.create_user(
            username="existinguser",
            email="duplicate@example.com",
            password="pass1234"
        )
        data = {
            "username": "newuser",
            "email": "duplicate@example.com",
            "password": "StrongPass123",
            "first_name": "Jane",
            "last_name": "Smith"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Email already exists", str(response.data))

    def test_short_username(self):
        data = {
            "username": "abc",
            "email": "abc@example.com",
            "password": "StrongPass123",
            "first_name": "Jane",
            "last_name": "Smith"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("at least 4 characters", str(response.data))

    def test_invalid_username_characters(self):
        data = {
            "username": "abc$$",
            "email": "abc2@example.com",
            "password": "StrongPass123",
            "first_name": "Jane",
            "last_name": "Smith"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Enter a valid username", str(response.data))

class JWTLoginTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="StrongPass123",
            first_name="John",
            last_name="Doe"
        )
        self.url = reverse('token_obtain_pair')  # update this if your URL name is different

    def test_successful_login(self):
        data = {
            "username": "testuser",
            "password": "StrongPass123"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], "testuser@example.com")

    def test_invalid_login(self):
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 401)
        self.assertIn("No active account", str(response.data))
