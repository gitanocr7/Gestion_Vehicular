# Agrega opciones (choices) a los campos de estado para que en el panel de
# administración se muestren como listas desplegables en vez de campos de texto libre.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vehiculos", "0005_alter_costomantencion_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mantencion",
            name="estado",
            field=models.CharField(
                choices=[
                    ("Pendiente", "Pendiente"),
                    ("En proceso", "En proceso"),
                    ("Completada", "Completada"),
                    ("Cancelada", "Cancelada"),
                ],
                default="Pendiente",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="mantencion",
            name="tipo_mantencion",
            field=models.CharField(
                choices=[("Preventiva", "Preventiva"), ("Reactiva", "Reactiva")],
                default="Preventiva",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="vehiculo",
            name="estado_operativo",
            field=models.CharField(
                choices=[
                    ("Disponible", "Disponible"),
                    ("Mantención", "En mantención"),
                    ("Fuera de Servicio", "Fuera de servicio"),
                ],
                default="Disponible",
                max_length=20,
            ),
        ),
    ]
