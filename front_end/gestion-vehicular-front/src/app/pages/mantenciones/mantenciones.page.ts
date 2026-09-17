import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  IonContent, IonSpinner, IonIcon, IonBadge,
  IonButton, IonSelect, IonSelectOption, IonItem
} from '@ionic/angular';
import { MantencionesService, Mantencion } from '../../services/mantenciones.service';
import { VehiculosService, Vehiculo } from '../../services/vehiculos.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

/**
 * Consulta pública del historial de mantenciones (HU-08: "Como ciudadano, quiero
 * consultar las mantenciones disponibles de un vehículo para conocer sus
 * antecedentes"). Página pública: no requiere sesión iniciada.
 */
@Component({
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.page.html',
  styleUrls: ['./mantenciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, SiteNavComponent,
    IonContent, IonSpinner, IonIcon, IonBadge,
    IonButton, IonSelect, IonSelectOption, IonItem
  ]
})
export class MantencionesPage implements OnInit {
  mantenciones: Mantencion[] = [];
  vehiculos: Vehiculo[] = [];
  vehiculoSeleccionado: number | null = null;
  cargando = false;
  errorMessage = '';

  constructor(
    private mantencionesService: MantencionesService,
    private vehiculosService: VehiculosService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Permite llegar con ?vehiculo=<id> desde la página de Vehículos.
    const vehiculoParam = this.route.snapshot.queryParamMap.get('vehiculo');
    if (vehiculoParam) {
      this.vehiculoSeleccionado = Number(vehiculoParam);
    }

    this.vehiculosService.listar().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('No se pudo cargar el listado de vehículos para el filtro:', err)
    });

    this.cargarMantenciones();
  }

  cargarMantenciones() {
    this.cargando = true;
    this.errorMessage = '';
    this.mantencionesService.listar(this.vehiculoSeleccionado ?? undefined).subscribe({
      next: (data) => {
        this.mantenciones = data;
        this.cargando = false;
        // La app corre en modo "zoneless" (sin zone.js): hay que pedir explícitamente
        // que se vuelva a renderizar la vista cuando llegan datos de forma asíncrona.
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar mantenciones:', err);
        this.errorMessage = 'No se pudo cargar el historial de mantenciones. Verifique que el servidor esté disponible.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  onCambioVehiculo(event: any) {
    this.vehiculoSeleccionado = event.detail.value || null;
    this.cargarMantenciones();
  }

  colorEstado(estado: string): string {
    const normalizado = (estado || '').toLowerCase();
    if (normalizado.includes('complet') || normalizado.includes('final')) return 'success';
    if (normalizado.includes('proceso') || normalizado.includes('pendiente')) return 'warning';
    if (normalizado.includes('cancel')) return 'danger';
    return 'medium';
  }

  formatoCosto(costo: string | number): string {
    const valor = typeof costo === 'string' ? parseFloat(costo) : costo;
    if (!valor) return '$0';
    return '$' + valor.toLocaleString('es-CL');
  }
}
