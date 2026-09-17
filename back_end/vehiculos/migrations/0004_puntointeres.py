# Generated for the new PuntoInteres model (public "Mapa y Grifos" module)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vehiculos", "0003_usuario_password"),
    ]

    operations = [
        migrations.CreateModel(
            name="PuntoInteres",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nombre", models.CharField(max_length=100)),
                (
                    "tipo",
                    models.CharField(
                        choices=[
                            ("grifo", "Grifo"),
                            ("taller", "Taller / Local de reparación"),
                            ("otro", "Otro punto de interés"),
                        ],
                        default="grifo",
                        max_length=20,
                    ),
                ),
                ("latitud", models.DecimalField(decimal_places=6, max_digits=9)),
                ("longitud", models.DecimalField(decimal_places=6, max_digits=9)),
                ("direccion", models.CharField(blank=True, max_length=200, null=True)),
                ("descripcion", models.TextField(blank=True, null=True)),
                ("publicado", models.BooleanField(default=True)),
            ],
        ),
    ]
