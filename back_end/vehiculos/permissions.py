
from rest_framework import permissions

from .models import Usuario


class EsAdminOReadonly(permissions.BasePermission):
    """
    Permite consultar mantenciones a usuarios autenticados.
    Solo los administradores pueden crear, editar o eliminar.
    """

    def has_permission(self, request, view):
        usuario = request.user

        # Solo acepta usuarios autenticados mediante el modelo propio.
        if not isinstance(usuario, Usuario):
            return False

        # GET, HEAD y OPTIONS son operaciones de solo lectura.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Las modificaciones quedan reservadas al administrador.
        try:
            rol = usuario.rol.nombre_rol.strip().lower()
            return rol in ('admin', 'administrador')
        except (AttributeError, TypeError):
            return False
