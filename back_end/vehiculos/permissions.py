from rest_framework import permissions

class EsAdminOReadonly(permissions.BasePermission):
    """
    Permite lectura (GET, HEAD, OPTIONS) a cualquier usuario autenticado.
    Permite escritura (POST, PUT, DELETE) SOLO si el usuario es Administrador.
    """
    def has_permission(self, request, view):
        # 1. Si no está autenticado, denegar acceso totalmente
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Si es una petición de lectura (GET, HEAD, OPTIONS), permitir a cualquier usuario
        if request.method in permissions.SAFE_METHODS:
            return True

        # 3. Si es una petición de escritura (POST, PUT, DELETE), verificar rol Administrador
        try:
            # Revisa la relación entre tu usuario auth y tu modelo Usuario/Rol
            return request.user.usuarioperfil.rol.nombre_rol.lower() == 'administrador'
        except AttributeError:
            return False