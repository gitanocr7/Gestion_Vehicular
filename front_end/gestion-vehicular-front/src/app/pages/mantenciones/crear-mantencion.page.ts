
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AlertController,
  IonicModule
} from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { MantencionesService } from '../../services/mantenciones.service';
import {
  VehiculosService,
  Vehiculo
} from '../../services/vehiculos.service';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-mantencion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],
  templateUrl: './crear-mantencion.page.html',
  styleUrls: ['./crear-mantencion.page.scss']
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

    const rol = this.authService.getRole();

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
        this.vehiculos = datos;
        this.cargandoVehiculos = false;
      },
      error: async (error) => {
        this.cargandoVehiculos = false;

        console.error('Error al cargar vehículos:', error);

        await this.mostrarAlerta(
          'Error',
          'No se pudieron cargar los vehículos. Intenta nuevamente.'
        );
      }
    });
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;

    this.http.get<any>(this.usuariosUrl).subscribe({
      next: (respuesta) => {
        // DRF normalmente devuelve una lista, aunque puede configurarse
        // paginación y devolver un objeto con la propiedad results.
        this.usuarios = Array.isArray(respuesta)
          ? respuesta
          : (respuesta?.results ?? []);

        this.cargandoUsuarios = false;
      },
      error: async (error) => {
        this.cargandoUsuarios = false;

        console.error('Error al cargar usuarios:', error);

        await this.mostrarAlerta(
          'Error',
          'No se pudieron cargar los responsables. Verifica los permisos de la API.'
        );
      }
    });
  }

  async guardar(): Promise<void> {
    if (
      !this.formulario.vehiculo ||
      !this.formulario.usuario_responsable ||
      !this.formulario.fecha_programada ||
      Number(this.formulario.km_actual) < 0 ||
      Number(this.formulario.costo_total) < 0
    ) {
      await this.mostrarAlerta(
        'Datos incompletos',
        'Completa el vehículo, responsable, fecha programada y valores válidos.'
      );
      return;
    }

    this.guardando = true;

    const datos = {
      ...this.formulario,
      vehiculo: Number(this.formulario.vehiculo),
      usuario_responsable: Number(this.formulario.usuario_responsable),
      km_actual: Number(this.formulario.km_actual),
      costo_total: Number(this.formulario.costo_total),
      fecha_realizada: this.formulario.fecha_realizada || null
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
          'No se pudo registrar la mantención. Verifica los datos y tus permisos.';

        await this.mostrarAlerta('Error', mensaje);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/mantenciones']);
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
