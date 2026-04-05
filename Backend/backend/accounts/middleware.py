from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

ADMIN_ONLY_ROUTES = [
    '/api/v1/admin/',
    '/api/v1/books/admin/',
]

WRITER_ONLY_ROUTES = [
    '/api/v1/notebooks/',
]

AUTHENTICATED_ROUTES = [
    '/api/v1/posts/',
    '/api/v1/books/',
    '/api/v1/groupchats/',
    '/api/v1/wallet',
    '/api/v1/users/profile',
    '/api/v1/users/feed',
]

PUBLIC_ROUTES = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/swagger/',
]


class RBACMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        for route in PUBLIC_ROUTES:
            if path.startswith(route):
                return self.get_response(request)

        auth_header = request.headers.get('Authorization', '')
        user_role = None
        if auth_header.startswith('Bearer '):
            token_str = auth_header.split(' ')[1]
            try:
                token = AccessToken(token_str)
                user_role = token.get('role')
                request.user_role_from_middleware = user_role
            except (InvalidToken, TokenError):
                pass

        for route in ADMIN_ONLY_ROUTES:
            if path.startswith(route):
                if user_role != 'admin':
                    return JsonResponse(
                        {'error': 'Admin access required'},
                        status=403
                    )

        return self.get_response(request)