from rest_framework import serializers
from .models import Rol, Usuario, TipoVehiculo, Vehiculo, Proveedor, Material, Personal, Mantencion, CostoMantencion, DetalleMantencion, MantencionPersonal

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class TipoVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoVehiculo
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
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