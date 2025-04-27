import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token')

        if token:
            try:
                decoded_data = jwt.decode(token[0], settings.SECRET_KEY, algorithms=["HS256"])
                user = await get_user(decoded_data.get('user_id'))
                scope['user'] = user
            except jwt.ExpiredSignatureError:
                scope['user'] = None
            except jwt.InvalidTokenError:
                scope['user'] = None
        else:
            scope['user'] = None

        return await self.inner(scope, receive, send)
