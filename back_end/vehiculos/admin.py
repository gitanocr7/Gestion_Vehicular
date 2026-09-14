from django.contrib import admin
from .models import (
    Rol, Usuario, TipoVehiculo, Vehiculo, Proveedor, Material, 
    Personal, Mantencion, CostoMantencion, DetalleMantencion, MantencionPersonal
)

# Registramos todos los modelos para que aparezcan en el panel de administración
admin.site.register(Rol)
admin.site.register(Usuario)
admin.site.register(TipoVehiculo)
admin.site.register(Vehiculo)
admin.site.register(Proveedor)
admin.site.register(Material)
admin.site.register(Personal)
admin.site.register(Mantencion)
admin.site.register(CostoMantencion)
admin.site.register(DetalleMantencion)
admin.site.register(MantencionPersonal)