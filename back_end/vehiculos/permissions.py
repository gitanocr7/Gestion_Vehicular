
from rest_framework import permissions


class EsAdminOReadonly(permissions.BasePermission):
    """
    Solo usuarios autenticados pueden consultar.
    Solo administradores pueden modificar.
    """

    def has_permission(self, request, view):
        # Confirma que DRF autenticó la petición.
        if request.successful_authenticator is None:
            return False

        usuario = request.user

        if request.method in permissions.SAFE_METHODS:
            return True

        try:
            rol = usuario.rol.nombre_rol.strip().lower()
            return rol in ('admin', 'administrador')
        except (AttributeError, TypeError):
            return False
