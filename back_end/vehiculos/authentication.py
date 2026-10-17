
from django.core import signing
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Usuario


class UsuarioTokenAuthentication(BaseAuthentication):
    """
    Autentica usuarios del modelo personalizado Usuario
    mediante tokens firmados por Django.
    """

    TOKEN_SALT = 'gestion-vehicular-auth'
    TOKEN_MAX_AGE = 60 * 60 * 24  # 24 horas

    def authenticate(self, request):
        header = request.headers.get('Authorization', '')

        if not header:
            return None

        partes = header.split()

        if len(partes) != 2 or partes[0].lower() != 'token':
            raise AuthenticationFailed(
                'Formato de autenticación inválido.'
            )

        token = partes[1]

        try:
            datos = signing.loads(
                token,
                salt=self.TOKEN_SALT,
                max_age=self.TOKEN_MAX_AGE
            )
        except signing.SignatureExpired:
            raise AuthenticationFailed('El token ha expirado.')
        except signing.BadSignature:
            raise AuthenticationFailed('El token no es válido.')

        usuario_id = datos.get('usuario_id')

        try:
            usuario = Usuario.objects.select_related('rol').get(
                pk=usuario_id,
                estado=True
            )
        except (Usuario.DoesNotExist, TypeError, ValueError):
            raise AuthenticationFailed(
                'El usuario no existe o está deshabilitado.'
            )

        return (usuario, token)

    def authenticate_header(self, request):
        return 'Token'
