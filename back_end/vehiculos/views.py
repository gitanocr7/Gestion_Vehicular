from rest_framework import viewsets
from .models import Rol, Usuario, TipoVehiculo, Vehiculo, Proveedor, Material, Personal, Mantencion, CostoMantencion, DetalleMantencion, MantencionPersonal, PuntoInteres
from .serializers import (
    RolSerializer, UsuarioSerializer, TipoVehiculoSerializer, VehiculoSerializer,
    ProveedorSerializer, MaterialSerializer, PersonalSerializer, MantencionSerializer,
    CostoMantencionSerializer, DetalleMantencionSerializer, MantencionPersonalSerializer,
    PuntoInteresSerializer,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UsuarioSerializer
from django.db.models import Q

# Nota sobre acceso público (alcance ampliado del proyecto):
# La consulta (listar/ver) de vehículos, mantenciones y puntos de interés es pública
# (cualquier persona, sin necesidad de iniciar sesión), tal como se definió en las
# historias de usuario "Como ciudadano...". El registro/edición sigue abierto en la
# API a nivel de permisos (AllowAny) porque el control de "quién puede escribir" hoy
# se resuelve en el frontend (rutas protegidas con authGuard); si se requiere reforzar
# esto a nivel de API más adelante, se recomienda separar permisos de lectura/escritura
# por rol de Usuario.

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
    """Consulta pública de la flota (HU-02 listar, HU-03 buscar, HU-04 consultar estado,
    HU-06 filtrar por disponibilidad). Acepta ?search=<patente/marca/modelo> y
    ?estado=<Disponible|Mantención|Fuera de Servicio>."""
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Vehiculo.objects.select_related('tipo_vehiculo').all().order_by('patente')
        search = self.request.query_params.get('search')
        estado = self.request.query_params.get('estado')
        if search:
            queryset = queryset.filter(
                Q(patente__icontains=search) | Q(marca__icontains=search) | Q(modelo__icontains=search)
            )
        if estado:
            queryset = queryset.filter(estado_operativo__iexact=estado)
        return queryset

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [AllowAny]

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    # Registro interno del personal (bomberos/mecánicos): no es de consulta pública.
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer

class MantencionViewSet(viewsets.ModelViewSet):
    """Consulta pública del historial de mantenciones (HU-08). Acepta ?vehiculo=<id>
    para ver solo las mantenciones de un vehículo."""
    serializer_class = MantencionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Mantencion.objects.select_related('vehiculo', 'usuario_responsable').all().order_by('-fecha_programada')
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
    """Mapa público de grifos, talleres y otros puntos de interés (HU-13, HU-14).
    Al público solo se le muestran los puntos marcados como publicados."""
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


from django.db.models import Q

@api_view(['POST'])
def login_view(request):
    identificador = request.data.get('identificador') or request.data.get('correo') or request.data.get('rut')
    password = request.data.get('password')
    
    if not identificador or not password:
        return Response({'success': False, 'mensaje': 'Debe ingresar su identificador y contraseña'}, status=400)

    try:
        # Buscamos al usuario por correo o RUT
        usuario = Usuario.objects.get(Q(correo=identificador) | Q(rut=identificador))
        
        # Validamos la contraseña (si la guardas en texto plano o usando check_password)
        if usuario.password == password: # O usa check_password(password, usuario.password) si está cifrada
            return Response({
                'success': True,
                'mensaje': 'Login exitoso',
                'id': usuario.id,
                'nombre': f"{usuario.nombre}",
                'rol': usuario.rol.nombre_rol.lower()
            })
        else:
            return Response({'success': False, 'mensaje': 'Credenciales inválidas'}, status=400)
            
    except Usuario.DoesNotExist:
        return Response({'success': False, 'mensaje': 'Credenciales inválidas'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'mensaje': 'Usuario registrado con éxito'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errores': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)