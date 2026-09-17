from rest_framework import serializers
from .models import Rol, Usuario, TipoVehiculo, Vehiculo, Proveedor, Material, Personal, Mantencion, CostoMantencion, DetalleMantencion, MantencionPersonal, PuntoInteres

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

class TipoVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoVehiculo
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(source='tipo_vehiculo.nombre_tipo', read_only=True)

    class Meta:
        model = Vehiculo
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = '__all__'

class MantencionSerializer(serializers.ModelSerializer):
    vehiculo_patente = serializers.CharField(source='vehiculo.patente', read_only=True)
    vehiculo_marca = serializers.CharField(source='vehiculo.marca', read_only=True)
    vehiculo_modelo = serializers.CharField(source='vehiculo.modelo', read_only=True)
    usuario_responsable_nombre = serializers.CharField(source='usuario_responsable.nombre', read_only=True)

    class Meta:
        model = Mantencion
        fields = '__all__'

class CostoMantencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostoMantencion
        fields = '__all__'

class DetalleMantencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleMantencion
        fields = '__all__'

class MantencionPersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantencionPersonal
        fields = '__all__'


class PuntoInteresSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuntoInteres
        fields = '__all__'