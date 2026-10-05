import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonSpinner, IonIcon, IonChip, IonLabel
} from '@ionic/angular';
import { PuntosInteresService, PuntoInteres } from '../../services/puntos-interes.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

// Leaflet se carga vía CDN en src/index.html
declare const L: any;

/**
 * Mapa público de grifos y puntos de interés (HU-13: visualizar mapa, HU-14: ver
 * grifos y otros puntos de interés). Página pública: no requiere sesión iniciada.
 */
@Component({
  selector: 'app-mapa-grifos',
  templateUrl: './mapa-grifos.page.html',
  styleUrls: ['./mapa-grifos.page.scss'],
  standalone: true,
  imports: [CommonModule, SiteNavComponent, IonContent, IonSpinner, IonIcon, IonChip, IonLabel]
})
export class MapaGrifosPage implements OnInit, AfterViewInit {
  @ViewChild('mapaContainer') mapaContainer?: ElementRef<HTMLDivElement>;

  puntos: PuntoInteres[] = [];
  cargando = false;
  errorMessage = '';
  mapaDisponible = typeof L !== 'undefined';

  // Centro por defecto: Santiago, Región Metropolitana
  private readonly centroDefecto: [number, number] = [-33.4489, -70.6693];
  private mapa: any;
  private markersGroup: any;

  constructor(
    private puntosInteresService: PuntosInteresService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPuntos();
  }

  ngAfterViewInit() {
    if (this.mapaDisponible && this.mapaContainer) {
      this.inicializarMapa();
    }
  }

  cargarPuntos() {
    this.cargando = true;
    this.errorMessage = '';
    this.puntosInteresService.listar().subscribe({
      next: (data) => {
        this.puntos = data;
        this.cargando = false;
        this.pintarMarcadores();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar puntos de interés:', err);
        this.errorMessage = 'No se pudo cargar el mapa de grifos y puntos de interés.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private inicializarMapa() {
    if (this.mapa) return;

    // Inicialización centrada en Santiago (-33.4489, -70.6693)
    this.mapa = L.map(this.mapaContainer!.nativeElement).setView(this.centroDefecto, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; colaboradores de OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.mapa);

    // Capa de marcadores dedicada para facilitarle la limpieza antes de redibujar
    this.markersGroup = L.layerGroup().addTo(this.mapa);

    this.pintarMarcadores();

    // Reajusta el tamaño del canvas de Leaflet tras el renderizado de Ionic
    setTimeout(() => {
      if (this.mapa) {
        this.mapa.invalidateSize();
      }
    }, 200);
  }

  private pintarMarcadores() {
    if (!this.mapa || !this.markersGroup || !this.puntos.length) return;

    // Limpia marcadores previos antes de agregar los nuevos
    this.markersGroup.clearLayers();

    const bounds: [number, number][] = [];

    this.puntos.forEach((punto) => {
      const lat = Number(punto.latitud);
      const lng = Number(punto.longitud);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      bounds.push([lat, lng]);

      const icono = this.iconoPara(punto.tipo);
      const marcador = L.marker([lat, lng], { icon: icono });
      marcador.bindPopup(
        `<strong>${punto.nombre}</strong><br>${this.etiquetaTipo(punto.tipo)}` +
        (punto.direccion ? `<br>${punto.direccion}` : '') +
        (punto.descripcion ? `<br><em>${punto.descripcion}</em>` : '')
      );

      this.markersGroup.addLayer(marcador);
    });

    // Ajusta la vista del mapa si hay marcadores válidos cargados
    if (bounds.length > 0) {
      this.mapa.fitBounds(bounds, { padding: [30, 30] });
    }
  }

  private iconoPara(tipo: string) {
    const colores: Record<string, string> = {
      grifo: '#2563eb',
      taller: '#f39c12',
      otro: '#6b7280',
    };
    const color = colores[tipo] || colores['otro'];
    return L.divIcon({
      className: 'punto-marker',
      html: `<span style="background:${color}"></span>`,
      iconSize: [16, 16],
    });
  }

  etiquetaTipo(tipo: string): string {
    const etiquetas: Record<string, string> = {
      grifo: 'Grifo',
      taller: 'Taller / Local de reparación',
      otro: 'Otro punto de interés',
    };
    return etiquetas[tipo] || tipo;
  }

  colorChip(tipo: string): string {
    if (tipo === 'grifo') return 'primary';
    if (tipo === 'taller') return 'warning';
    return 'medium';
  }
}