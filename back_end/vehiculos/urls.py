from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RolViewSet, UsuarioViewSet, TipoVehiculoViewSet, VehiculoViewSet,
    ProveedorViewSet, MaterialViewSet, PersonalViewSet, MantencionViewSet,
    CostoMantencionViewSet, DetalleMantencionViewSet, MantencionPersonalViewSet,
    login_view, registrar_usuario  
)

router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'tipos-vehiculo', TipoVehiculoViewSet)
router.register(r'vehiculos', VehiculoViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'materiales', MaterialViewSet)
router.register(r'personal', PersonalViewSet)
router.register(r'mantenciones', MantencionViewSet)
router.register(r'costos-mantencion', CostoMantencionViewSet)
router.register(r'detalles-mantencion', DetalleMantencionViewSet)
router.register(r'mantencion-personal', MantencionPersonalViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', login_view, name='login'),
    path('api/registro/', registrar_usuario, name='registro'), 
]