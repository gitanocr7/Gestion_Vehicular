import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel, IonSpinner, IonIcon, IonBadge, IonButton
} from '@ionic/angular';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

/**
 * Consulta pública de la flota de vehículos.
 * Cubre HU-02 (visualizar vehículos), HU-03 (buscar), HU-04 (consultar estado) y
 * HU-06 (filtrar por disponibilidad). Página pública: no requiere sesión iniciada.
 */
@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, SiteNavComponent,
    IonContent, IonSearchbar, IonSegment,
    IonSegmentButton, IonLabel, IonSpinner, IonIcon, IonBadge, IonButton
  ]
})
export class VehiculosPage implements OnInit {
  vehiculos: Vehiculo[] = [];
  cargando = false;
  errorMessage = '';

  terminoBusqueda = '';
  filtroEstado: string = 'todos';

  readonly estados = [
    { value: 'todos', label: 'Todos' },
    { value: 'Disponible', label: 'Disponible' },
    { value: 'Mantención', label: 'En mantención' },
    { value: 'Fuera de Servicio', label: 'Fuera de servicio' },
  ];

  constructor(
    private vehiculosService: VehiculosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.cargando = true;
    this.errorMessage = '';
    const filtros: { search?: string; estado?: string } = {};
    if (this.terminoBusqueda?.trim()) {
      filtros.search = this.terminoBusqueda.trim();
    }
    if (this.filtroEstado && this.filtroEstado !== 'todos') {
      filtros.estado = this.filtroEstado;
    }

    this.vehiculosService.listar(filtros).subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cargando = false;
        // La app corre en modo "zoneless" (sin zone.js): al llegar datos de forma
        // asíncrona hay que pedir explícitamente que se vuelva a renderizar la vista.
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.errorMessage = 'No se pudo cargar la información de la flota. Verifique que el servidor esté disponible.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onBuscar(event: any) {
    this.terminoBusqueda = event.detail.value ?? '';
    this.cargarVehiculos();
  }

  onFiltroEstado(event: any) {
    this.filtroEstado = event.detail.value;
    this.cargarVehiculos();
  }

  limpiarFiltro() {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todos';
    this.cargarVehiculos();
  }

  colorEstado(estado: string): string {
    const normalizado = (estado || '').toLowerCase();
    if (normalizado.includes('dispon')) return 'success';
    if (normalizado.includes('mantenci')) return 'warning';
    if (normalizado.includes('fuera')) return 'danger';
    return 'medium';
  }
}
