
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonBadge,
  IonButton,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText
} from '@ionic/angular';

import {
  VehiculosService,
  Vehiculo,
  VehiculoCrear,
  TipoVehiculo
} from '../../services/vehiculos.service';

import { AuthService } from '../../services/auth.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SiteNavComponent,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonIcon,
    IonBadge,
    IonButton,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText
  ]
})
export class VehiculosPage implements OnInit {
  vehiculos: Vehiculo[] = [];
  tiposVehiculo: TipoVehiculo[] = [];

  cargando = false;
  guardando = false;

  errorMessage = '';
  errorFormulario = '';
  mensajeExito = '';

  terminoBusqueda = '';
  filtroEstado = 'todos';
  mostrarFormulario = false;

  readonly estados = [
    { value: 'todos', label: 'Todos' },
    { value: 'Disponible', label: 'Disponible' },
    { value: 'Mantención', label: 'En mantención' },
    { value: 'Fuera de Servicio', label: 'Fuera de servicio' }
  ];

  formulario: VehiculoCrear = this.formularioVacio();

  constructor(
    private vehiculosService: VehiculosService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get esAdmin(): boolean {
    return this.authService.isLoggedIn() &&
      this.authService.getRole() === 'admin';
  }

  ngOnInit(): void {
    console.log('Página de vehículos iniciada.');
    console.log('Usuario autenticado:', this.authService.isLoggedIn());
    console.log('Rol detectado:', this.authService.getRole());
    console.log('¿Es administrador?:', this.esAdmin);

    this.cargarVehiculos();

    // Cargamos los tipos al iniciar la página.
    this.cargarTiposVehiculo();
  }

  private formularioVacio(): VehiculoCrear {
    return {
      patente: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      estado_operativo: 'Disponible',
      kilometraje: 0,
      fecha_adquisicion: '',
      tipo_vehiculo: 0,
      imagen: null
    };
  }

  cargarVehiculos(): void {
    this.cargando = true;
    this.errorMessage = '';

    const filtros: { search?: string; estado?: string } = {};

    if (this.terminoBusqueda.trim()) {
      filtros.search = this.terminoBusqueda.trim();
    }

    if (this.filtroEstado !== 'todos') {
      filtros.estado = this.filtroEstado;
    }

    this.vehiculosService.listar(filtros).subscribe({
      next: (data) => {
        console.log('Vehículos recibidos:', data);

        this.vehiculos = data;
        this.cargando = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);

        this.errorMessage =
          'No se pudo cargar la flota. Comprueba la conexión con Django.';

        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarTiposVehiculo(): void {
    console.log(
      'Consultando tipos de vehículos en:',
      'https://gestion-vehicular-back.onrender.com/api/tipos-vehiculo/'
    );

    this.vehiculosService.listarTipos().subscribe({
      next: (data) => {
        console.log('Tipos recibidos desde Django:', data);

        this.tiposVehiculo = data;

        if (!data || data.length === 0) {
          this.errorFormulario =
            'La API respondió, pero no hay tipos de vehículos registrados.';
        } else {
          this.errorFormulario = '';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tipos de vehículos:', err);

        this.errorFormulario =
          `No se pudieron cargar los tipos de vehículos. HTTP: ${
            err.status || 'sin conexión'
          }`;

        this.cdr.detectChanges();
      }
    });
  }

  onBuscar(event: any): void {
    this.terminoBusqueda = event.detail.value ?? '';
    this.cargarVehiculos();
  }

  onFiltroEstado(event: any): void {
    this.filtroEstado = event.detail.value;
    this.cargarVehiculos();
  }

  limpiarFiltro(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.cargarVehiculos();
  }

  abrirFormulario(): void {
    if (!this.esAdmin) {
      this.errorFormulario =
        'Solo un administrador puede registrar vehículos.';
      return;
    }

    this.errorFormulario = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;

    // Reintenta cargar los tipos si aún no han llegado.
    if (this.tiposVehiculo.length === 0) {
      this.cargarTiposVehiculo();
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.errorFormulario = '';
    this.formulario = this.formularioVacio();
  }

  registrarVehiculo(): void {
    if (!this.esAdmin) {
      this.errorFormulario =
        'Solo un administrador puede registrar vehículos.';
      return;
    }

    const patente = this.formulario.patente.trim().toUpperCase();
    const marca = this.formulario.marca.trim();
    const modelo = this.formulario.modelo.trim();
    const anio = Number(this.formulario.anio);
    const kilometraje = Number(this.formulario.kilometraje);
    const tipo = Number(this.formulario.tipo_vehiculo);

    if (
      !patente ||
      !marca ||
      !modelo ||
      !this.formulario.fecha_adquisicion ||
      !Number.isInteger(anio) ||
      anio < 1900 ||
      anio > new Date().getFullYear() + 1 ||
      !Number.isInteger(kilometraje) ||
      kilometraje < 0 ||
      !Number.isInteger(tipo) ||
      tipo <= 0
    ) {
      this.errorFormulario =
        'Completa los campos obligatorios con valores válidos.';
      return;
    }

    const datos: VehiculoCrear = {
      ...this.formulario,
      patente,
      marca,
      modelo,
      anio,
      kilometraje,
      tipo_vehiculo: tipo
    };

    this.guardando = true;
    this.errorFormulario = '';
    this.mensajeExito = '';

    this.vehiculosService.crear(datos).subscribe({
      next: (vehiculo) => {
        this.guardando = false;

        this.mensajeExito =
          `Vehículo ${vehiculo.patente} registrado correctamente.`;

        this.mostrarFormulario = false;
        this.formulario = this.formularioVacio();

        this.terminoBusqueda = '';
        this.filtroEstado = 'todos';

        this.cargarVehiculos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al registrar vehículo:', err);

        this.guardando = false;

        if (err.status === 400) {
          if (err.error?.patente) {
            this.errorFormulario =
              'La patente ya está registrada o no tiene un formato válido.';
          } else {
            this.errorFormulario =
              'Revisa los datos ingresados. Django rechazó uno o más campos.';
          }
        } else if (err.status === 401 || err.status === 403) {
          this.errorFormulario =
            'No tienes autorización para registrar vehículos.';
        } else {
          this.errorFormulario =
            'No se pudo registrar el vehículo. Verifica la conexión con Django.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  colorEstado(estado: string): string {
    const normalizado = (estado || '').toLowerCase();

    if (normalizado.includes('dispon')) return 'success';
    if (normalizado.includes('mantenci')) return 'warning';
    if (normalizado.includes('fuera')) return 'danger';

    return 'medium';
  }
}
  