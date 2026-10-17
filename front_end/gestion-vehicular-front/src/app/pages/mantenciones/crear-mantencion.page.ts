
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { MantencionesService } from '../../services/mantenciones.service';
import {
  VehiculosService,
  Vehiculo
} from '../../services/vehiculos.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-crear-mantencion',
  standalone: true,
  templateUrl: './crear-mantencion.page.html',
  styleUrls: ['./crear-mantencion.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea
  ]
})
export class CrearMantencionPage implements OnInit {
  guardando = false;
  cargandoVehiculos = false;
  cargandoUsuarios = false;

  vehiculos: Vehiculo[] = [];
  usuarios: any[] = [];

  private usuariosUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}/usuarios/`;

  formulario = {
    vehiculo: '',
    usuario_responsable: '',
    tipo_mantencion: 'Preventiva',
    fecha_programada: '',
    fecha_realizada: '',
    estado: 'Pendiente',
    km_actual: 0,
    observaciones: '',
    costo_total: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private mantencionesService: MantencionesService,
    private vehiculosService: VehiculosService,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const rol = this.authService.getRole().trim().toLowerCase();

    if (!['admin', 'administrador'].includes(rol)) {
      this.router.navigate(['/mantenciones']);
      return;
    }

    this.cargarVehiculos();
    this.cargarUsuarios();
  }

  cargarVehiculos(): void {
    this.cargandoVehiculos = true;

    this.vehiculosService.listar().subscribe({
      next: (datos) => {
        this.vehiculos = Array.isArray(datos) ? datos : [];
        this.cargandoVehiculos = false;
      },
      error: (error) => {
        this.cargandoVehiculos = false;
        console.error('Error al cargar vehículos:', error);

        this.mostrarAlerta(
          'Error',
          'No se pudieron cargar los vehículos. Verifica la conexión con la API.'
        );
      }
    });
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;

    this.http.get<any>(this.usuariosUrl).subscribe({
      next: (respuesta) => {
        this.usuarios = Array.isArray(respuesta)
          ? respuesta
          : respuesta?.results ?? [];

        this.cargandoUsuarios = false;
      },
      error: (error) => {
        this.cargandoUsuarios = false;
        console.error('Error al cargar usuarios:', error);

        this.mostrarAlerta(
          'Error',
          'No se pudieron cargar los responsables. Verifica el endpoint de usuarios y sus permisos.'
        );
      }
    });
  }

  async guardar(): Promise<void> {
    const km = Number(this.formulario.km_actual);
    const costo = Number(this.formulario.costo_total);

    if (
      !this.formulario.vehiculo ||
      !this.formulario.usuario_responsable ||
      !this.formulario.fecha_programada ||
      !Number.isFinite(km) ||
      km < 0 ||
      !Number.isFinite(costo) ||
      costo < 0
    ) {
      await this.mostrarAlerta(
        'Datos incompletos',
        'Completa el vehículo, responsable, fecha programada y valores numéricos válidos.'
      );
      return;
    }

    this.guardando = true;

    const datos = {
      vehiculo: Number(this.formulario.vehiculo),
      usuario_responsable: Number(
        this.formulario.usuario_responsable
      ),
      tipo_mantencion: this.formulario.tipo_mantencion,
      fecha_programada: this.formulario.fecha_programada,
      fecha_realizada: this.formulario.fecha_realizada || null,
      estado: this.formulario.estado,
      km_actual: km,
      observaciones: this.formulario.observaciones,
      costo_total: costo
    };

    this.mantencionesService.crear(datos).subscribe({
      next: async () => {
        this.guardando = false;

        await this.mostrarAlerta(
          'Mantención registrada',
          'La mantención se guardó correctamente.'
        );

        this.router.navigate(['/mantenciones']);
      },
      error: async (error) => {
        this.guardando = false;
        console.error('Error al guardar mantención:', error);

        const mensaje =
          error?.error?.detail ||
          error?.error?.mensaje ||
          this.formatearErrores(error?.error) ||
          'No se pudo registrar la mantención. Verifica los datos y tus permisos.';

        await this.mostrarAlerta('Error', mensaje);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/mantenciones']);
  }

  private formatearErrores(error: any): string {
    if (!error || typeof error !== 'object') {
      return '';
    }

    return Object.entries(error)
      .map(([campo, mensajes]) => {
        const detalle = Array.isArray(mensajes)
          ? mensajes.join(', ')
          : String(mensajes);

        return `${campo}: ${detalle}`;
      })
      .join('\n');
  }

  private async mostrarAlerta(
    titulo: string,
    mensaje: string
  ): Promise<void> {
    const alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alerta.present();
  }
}
