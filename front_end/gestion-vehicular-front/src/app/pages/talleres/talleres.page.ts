import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { 
  IonContent,
  IonLabel, 
  IonIcon, 
  IonSearchbar, 
  IonSpinner, 
  IonBadge, 
  IonButton,
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

export interface Taller {
  id: number;
  nombre: string;
  especialidad: string;
  direccion: string;
  telefono?: string;
  disponible: boolean;
  capacidad_vehiculos?: number;
  vehiculos_actuales?: number;
}

@Component({
  selector: 'app-talleres',
  templateUrl: './talleres.page.html',
  styleUrls: ['./talleres.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    SiteNavComponent,
    IonContent,
    IonLabel, 
    IonIcon,
    IonSearchbar,
    IonSpinner,
    IonBadge,
    IonButton,
    IonItem,
    IonSelect,
    IonSelectOption
  ]
})
export class TalleresPage implements OnInit {

  talleres: Taller[] = [];
  cargando: boolean = false;
  errorMessage: string = '';
  terminoBusqueda: string = '';
  tipoMantencion: string = 'todas';

  constructor() { }

  ngOnInit() {
    this.cargarTalleres();
  }

  cargarTalleres() {
    this.cargando = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.talleres = [
        { id: 1, nombre: 'Taller Central San Miguel', especialidad: 'Motor y Afinamiento', direccion: 'Av. Principal 1234', telefono: '+56 9 1234 5678', disponible: true, capacidad_vehiculos: 8, vehiculos_actuales: 3 },
        { id: 2, nombre: 'ElectroAuto Emergencias', especialidad: 'Sistema Eléctrico y Batería', direccion: 'Calle Los Olivos 45', telefono: '+56 9 8765 4321', disponible: true, capacidad_vehiculos: 5, vehiculos_actuales: 5 },
        { id: 3, nombre: 'Frenos y Suspensión Express', especialidad: 'Sistema de Frenos (Pastillas/Discos)', direccion: 'Pasaje Industrial 89', telefono: '+56 9 5555 4444', disponible: false, capacidad_vehiculos: 4, vehiculos_actuales: 4 },
        { id: 4, nombre: 'Mecánica Integral Norte', especialidad: 'Mantención Preventiva General', direccion: 'Av. El Salto 567', telefono: '+56 9 2222 3333', disponible: true, capacidad_vehiculos: 10, vehiculos_actuales: 2 }
      ];
      this.cargando = false;
    }, 800);
  }

  get talleresFiltrados(): Taller[] {
    return this.talleres.filter(taller => {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      const coincideTexto = !busqueda || 
        taller.nombre.toLowerCase().includes(busqueda) ||
        taller.direccion.toLowerCase().includes(busqueda) ||
        taller.especialidad.toLowerCase().includes(busqueda);

      const coincideMantencion = this.tipoMantencion === 'todas' || 
        taller.especialidad.toLowerCase().includes(this.tipoMantencion.toLowerCase());

      return coincideTexto && coincideMantencion;
    });
  }

  onBuscar(event: any) {
    this.terminoBusqueda = event.detail.value || '';
  }

  onCambiarTipoMantencion(event: any) {
    this.tipoMantencion = event.detail.value || 'todas';
  }

  limpiarFiltro() {
    this.terminoBusqueda = '';
    this.tipoMantencion = 'todas';
  }
}