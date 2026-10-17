import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonContent, IonIcon, IonChip, IonLabel
} from '@ionic/angular';
import { PuntosInteresService, PuntoInteres } from '../../services/puntos-interes.service';
import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';

@Component({
  selector: 'app-mapa-grifos',
  templateUrl: './mapa-grifos.page.html',
  styleUrls: ['./mapa-grifos.page.scss'],
  standalone: true,
  imports: [CommonModule, SiteNavComponent, IonContent, IonIcon, IonChip, IonLabel]
})
export class MapaGrifosPage implements OnInit {
  mapaBomberosUrl!: SafeResourceUrl;
  puntos: PuntoInteres[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private puntosInteresService: PuntosInteresService
  ) {}

  ngOnInit() {
    // Sanitización obligatoria en Angular para permitir la carga de URLs externas en un iframe
    this.mapaBomberosUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://sig.bomberos.cl/');
    this.cargarPuntos();
  }

  cargarPuntos() {
    this.puntosInteresService.listar().subscribe({
      next: (data) => {
        this.puntos = data;
      },
      error: (err) => {
        console.error('Error al cargar puntos de interés locales:', err);
      }
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