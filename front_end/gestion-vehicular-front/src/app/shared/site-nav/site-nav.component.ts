import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Barra superior + menú de navegación del sitio, reutilizable en todas las páginas
 * públicas (Inicio, Vehículos, Mantenciones, Mapa y Grifos, etc.). Se agregó para que
 * el usuario pueda moverse entre secciones con un clic, sin depender del botón
 * "atrás" del navegador.
 */
@Component({
  selector: 'app-site-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-nav.component.html',
  styleUrls: ['./site-nav.component.scss']
})
export class SiteNavComponent {}
