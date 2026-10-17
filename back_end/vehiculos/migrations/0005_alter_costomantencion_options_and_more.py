# Generated for verbose_name / verbose_name_plural fixes (nombres en español correctos
# en el panel de administración: "Mantenciones" en vez de "Mantencions", etc.)

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("vehiculos", "0004_puntointeres"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="costomantencion",
            options={
                "verbose_name": "Costo de mantención",
                "verbose_name_plural": "Costos de mantención",
            },
        ),
        migrations.AlterModelOptions(
            name="detallemantencion",
            options={
                "verbose_name": "Detalle de mantención",
                "verbose_name_plural": "Detalles de mantención",
            },
        ),
        migrations.AlterModelOptions(
            name="mantencion",
            options={
                "verbose_name": "Mantención",
                "verbose_name_plural": "Mantenciones",
            },
        ),
        migrations.AlterModelOptions(
            name="mantencionpersonal",
            options={
                "verbose_name": "Personal asignado a mantención",
                "verbose_name_plural": "Personal asignado a mantenciones",
            },
        ),
        migrations.AlterModelOptions(
            name="material",
            options={"verbose_name": "Material", "verbose_name_plural": "Materiales"},
        ),
        migrations.AlterModelOptions(
            name="personal",
            options={"verbose_name": "Personal", "verbose_name_plural": "Personal"},
        ),
        migrations.AlterModelOptions(
            name="proveedor",
            options={"verbose_name": "Proveedor", "verbose_name_plural": "Proveedores"},
        ),
        migrations.AlterModelOptions(
            name="puntointeres",
            options={
                "verbose_name": "Punto de interés",
                "verbose_name_plural": "Puntos de interés",
            },
        ),
        migrations.AlterModelOptions(
            name="rol",
            options={"verbose_name": "Rol", "verbose_name_plural": "Roles"},
        ),
        migrations.AlterModelOptions(
            name="tipovehiculo",
            options={
                "verbose_name": "Tipo de vehículo",
                "verbose_name_plural": "Tipos de vehículo",
            },
        ),
        migrations.AlterModelOptions(
            name="usuario",
            options={"verbose_name": "Usuario", "verbose_name_plural": "Usuarios"},
        ),
        migrations.AlterModelOptions(
            name="vehiculo",
            options={"verbose_name": "Vehículo", "verbose_name_plural": "Vehículos"},
        ),
    ]
