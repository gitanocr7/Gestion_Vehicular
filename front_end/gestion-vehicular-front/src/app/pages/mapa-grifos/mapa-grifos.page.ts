import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonSpinner, IonIcon, IonChip, IonLabel
} from '@ionic/angular';
import { PuntosInteresService, PuntoInteres } from '../../services/puntos-interes.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

// Leaflet se carga vía CDN en src/index.html (ver <script src=".../leaflet.min.js">).
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

  // Centro por defecto: Talcahuano, Región del Biobío.
  private readonly centroDefecto: [number, number] = [-36.7226, -73.1167];
  private mapa: any;

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
        // La app corre en modo "zoneless" (sin zone.js): hay que pedir explícitamente
        // que se vuelva a renderizar la vista cuando llegan datos de forma asíncrona.
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar puntos de interés:', err);
        this.errorMessage = 'No se pudo cargar el mapa de grifos y puntos de interés. Verifique que el servidor esté disponible.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private inicializarMapa() {
    this.mapa = L.map(this.mapaContainer!.nativeElement).setView(this.centroDefecto, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; colaboradores de OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.mapa);
    this.pintarMarcadores();
  }

  private pintarMarcadores() {
    if (!this.mapa || !this.puntos.length) return;

    this.puntos.forEach((punto) => {
      const lat = Number(punto.latitud);
      const lng = Number(punto.longitud);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const icono = this.iconoPara(punto.tipo);
      const marcador = L.marker([lat, lng], { icon: icono }).addTo(this.mapa);
      marcador.bindPopup(
        `<strong>${punto.nombre}</strong><br>${this.etiquetaTipo(punto.tipo)}` +
        (punto.direccion ? `<br>${punto.direccion}` : '') +
        (punto.descripcion ? `<br><em>${punto.descripcion}</em>` : '')
      );
    });
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
