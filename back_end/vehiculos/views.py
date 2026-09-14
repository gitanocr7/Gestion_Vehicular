from rest_framework import viewsets
from .models import Rol, Usuario, TipoVehiculo, Vehiculo, Proveedor, Material, Personal, Mantencion, CostoMantencion, DetalleMantencion, MantencionPersonal
from .serializers import (
    RolSerializer, UsuarioSerializer, TipoVehiculoSerializer, VehiculoSerializer,
    ProveedorSerializer, MaterialSerializer, PersonalSerializer, MantencionSerializer,
    CostoMantencionSerializer, DetalleMantencionSerializer, MantencionPersonalSerializer
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UsuarioSerializer 
from django.db.models import Q

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class TipoVehiculoViewSet(viewsets.ModelViewSet):
    queryset = TipoVehiculo.objects.all()
    serializer_class = TipoVehiculoSerializer

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer

class MantencionViewSet(viewsets.ModelViewSet):
    queryset = Mantencion.objects.all()
    serializer_class = MantencionSerializer

class CostoMantencionViewSet(viewsets.ModelViewSet):
    queryset = CostoMantencion.objects.all()
    serializer_class = CostoMantencionSerializer

class DetalleMantencionViewSet(viewsets.ModelViewSet):
    queryset = DetalleMantencion.objects.all()
    serializer_class = DetalleMantencionSerializer

class MantencionPersonalViewSet(viewsets.ModelViewSet):
    queryset = MantencionPersonal.objects.all()
    serializer_class = MantencionPersonalSerializer


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