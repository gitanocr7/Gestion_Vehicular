
from django.db.models import Q
from django.core import signing

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Rol,
    Usuario,
    TipoVehiculo,
    Vehiculo,
    Proveedor,
    Material,
    Personal,
    Mantencion,
    CostoMantencion,
    DetalleMantencion,
    MantencionPersonal,
    PuntoInteres,
)

from .serializers import (
    RolSerializer,
    UsuarioSerializer,
    TipoVehiculoSerializer,
    VehiculoSerializer,
    ProveedorSerializer,
    MaterialSerializer,
    PersonalSerializer,
    MantencionSerializer,
    CostoMantencionSerializer,
    DetalleMantencionSerializer,
    MantencionPersonalSerializer,
    PuntoInteresSerializer,
)

from .permissions import EsAdminOReadonly
from .authentication import UsuarioTokenAuthentication


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class TipoVehiculoViewSet(viewsets.ModelViewSet):
    queryset = TipoVehiculo.objects.all()
    serializer_class = TipoVehiculoSerializer
    permission_classes = [AllowAny]


class VehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = (
            Vehiculo.objects
            .select_related('tipo_vehiculo')
            .all()
            .order_by('patente')
        )

        search = self.request.query_params.get('search')
        estado = self.request.query_params.get('estado')

        if search:
            queryset = queryset.filter(
                Q(patente__icontains=search)
                | Q(marca__icontains=search)
                | Q(modelo__icontains=search)
            )

        if estado:
            queryset = queryset.filter(
                estado_operativo__iexact=estado
            )

        return queryset


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [AllowAny]


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer


class MantencionViewSet(viewsets.ModelViewSet):
    """
    Solo usuarios autenticados pueden consultar mantenciones.
    Solo administradores pueden crear, editar y eliminar.
    Permite filtrar mediante ?vehiculo=<id>.
    """

    serializer_class = MantencionSerializer
    permission_classes = [EsAdminOReadonly]

    def get_queryset(self):
        queryset = (
            Mantencion.objects
            .select_related('vehiculo', 'usuario_responsable')
            .all()
            .order_by('-fecha_programada')
        )

        vehiculo_id = self.request.query_params.get('vehiculo')

        if vehiculo_id:
            queryset = queryset.filter(vehiculo_id=vehiculo_id)

        return queryset


class CostoMantencionViewSet(viewsets.ModelViewSet):
    queryset = CostoMantencion.objects.all()
    serializer_class = CostoMantencionSerializer


class DetalleMantencionViewSet(viewsets.ModelViewSet):
    queryset = DetalleMantencion.objects.all()
    serializer_class = DetalleMantencionSerializer


class MantencionPersonalViewSet(viewsets.ModelViewSet):
    queryset = MantencionPersonal.objects.all()
    serializer_class = MantencionPersonalSerializer


class PuntoInteresViewSet(viewsets.ModelViewSet):
    serializer_class = PuntoInteresSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = PuntoInteres.objects.all().order_by('nombre')

        tipo = self.request.query_params.get('tipo')

        if tipo:
            queryset = queryset.filter(tipo=tipo)

        if not self.request.query_params.get('all'):
            queryset = queryset.filter(publicado=True)

        return queryset


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    identificador = (
        request.data.get('identificador')
        or request.data.get('correo')
        or request.data.get('rut')
    )

    password = request.data.get('password')

    if not identificador or not password:
        return Response(
            {
                'success': False,
                'mensaje': 'Debe ingresar su identificador y contraseña.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario = Usuario.objects.select_related('rol').get(
            Q(correo=identificador) | Q(rut=identificador),
            estado=True
        )
    except Usuario.DoesNotExist:
        return Response(
            {
                'success': False,
                'mensaje': 'Credenciales inválidas.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Conserva temporalmente la validación actual de tu proyecto.
    # Se debe migrar a contraseñas con hash.
    if usuario.password != password:
        return Response(
            {
                'success': False,
                'mensaje': 'Credenciales inválidas.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    token = signing.dumps(
        {'usuario_id': usuario.id},
        salt=UsuarioTokenAuthentication.TOKEN_SALT
    )

    return Response(
        {
            'success': True,
            'mensaje': 'Login exitoso.',
            'id': usuario.id,
            'nombre': usuario.nombre,
            'rol': usuario.rol.nombre_rol.strip().lower(),
            'token': token
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    serializer = UsuarioSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                'success': True,
                'mensaje': 'Usuario registrado con éxito.'
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        {
            'success': False,
            'errores': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )
