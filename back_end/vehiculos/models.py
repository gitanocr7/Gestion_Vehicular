from django.db import models


class Rol(models.Model):
    nombre_rol = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.nombre_rol


class Usuario(models.Model):
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='usuarios')
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, unique=True)
    correo = models.EmailField(unique=True)
    password = models.CharField(max_length=128, default='')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    estado = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.nombre


class TipoVehiculo(models.Model):
    nombre_tipo = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Tipo de vehículo'
        verbose_name_plural = 'Tipos de vehículo'

    def __str__(self):
        return self.nombre_tipo


class Vehiculo(models.Model):
    ESTADO_OPERATIVO_CHOICES = [
        ('Disponible', 'Disponible'),
        ('Mantención', 'En mantención'),
        ('Fuera de Servicio', 'Fuera de servicio'),
    ]

    tipo_vehiculo = models.ForeignKey(TipoVehiculo, on_delete=models.CASCADE, related_name='vehiculos')
    patente = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    anio = models.IntegerField()
    estado_operativo = models.CharField(max_length=20, choices=ESTADO_OPERATIVO_CHOICES, default='Disponible')
    kilometraje = models.IntegerField()
    fecha_adquisicion = models.DateField()
    imagen = models.TextField(blank=True, null=True) # Para la foto física o referencia visual

    class Meta:
        verbose_name = 'Vehículo'
        verbose_name_plural = 'Vehículos'

    def __str__(self):
        return f"{self.patente} - {self.marca} {self.modelo}"


class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, unique=True)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'

    def __str__(self):
        return self.nombre


class Material(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name='materiales')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    unidad_medida = models.CharField(max_length=20)
    stock_actual = models.IntegerField()
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Material'
        verbose_name_plural = 'Materiales'

    def __str__(self):
        return self.nombre


class Personal(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, unique=True)
    especialidad = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Personal'
        verbose_name_plural = 'Personal'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Mantencion(models.Model):
    TIPO_MANTENCION_CHOICES = [
        ('Preventiva', 'Preventiva'),
        ('Reactiva', 'Reactiva'),
    ]
    ESTADO_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('En proceso', 'En proceso'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
    ]

    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, related_name='mantenciones')
    usuario_responsable = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mantenciones_asignadas')
    tipo_mantencion = models.CharField(max_length=20, choices=TIPO_MANTENCION_CHOICES, default='Preventiva')
    fecha_programada = models.DateField()
    fecha_realizada = models.DateField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Pendiente')
    km_actual = models.IntegerField()
    observaciones = models.TextField(blank=True, null=True)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        verbose_name = 'Mantención'
        verbose_name_plural = 'Mantenciones'

    def __str__(self):
        return f"Mantención #{self.id} - Vehículo: {self.vehiculo.patente}"


class CostoMantencion(models.Model):
    mantencion = models.ForeignKey(Mantencion, on_delete=models.CASCADE, related_name='costos')
    tipo_costo = models.CharField(max_length=20)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Costo de mantención'
        verbose_name_plural = 'Costos de mantención'

    def __str__(self):
        return f"Costo {self.tipo_costo}: ${self.monto}"


class DetalleMantencion(models.Model):
    mantencion = models.ForeignKey(Mantencion, on_delete=models.CASCADE, related_name='detalles_materiales')
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='detalles_mantencion')
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = 'Detalle de mantención'
        verbose_name_plural = 'Detalles de mantención'

    def __str__(self):
        return f"{self.cantidad}x {self.material.nombre} en Mantención #{self.mantencion.id}"


class PuntoInteres(models.Model):
    """Puntos georreferenciados de consulta pública: grifos, talleres u otros puntos de interés
    para el módulo público 'Mapa y Grifos'."""

    TIPO_CHOICES = [
        ('grifo', 'Grifo'),
        ('taller', 'Taller / Local de reparación'),
        ('otro', 'Otro punto de interés'),
    ]

    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='grifo')
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    publicado = models.BooleanField(default=True)  # solo lo publicado es visible para la ciudadanía

    class Meta:
        verbose_name = 'Punto de interés'
        verbose_name_plural = 'Puntos de interés'

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.nombre}"


class MantencionPersonal(models.Model):
    mantencion = models.ForeignKey(Mantencion, on_delete=models.CASCADE, related_name='personal_asignado')
    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='mantenciones_participadas')
    rol_en_mantencion = models.CharField(max_length=50)

    class Meta:
        unique_together = ('mantencion', 'personal') # Evita duplicar al mismo bombero en la misma mantención
        verbose_name = 'Personal asignado a mantención'
        verbose_name_plural = 'Personal asignado a mantenciones'

    def __str__(self):
        return f"{self.personal} como {self.rol_en_mantencion} en Mantención #{self.mantencion.id}"