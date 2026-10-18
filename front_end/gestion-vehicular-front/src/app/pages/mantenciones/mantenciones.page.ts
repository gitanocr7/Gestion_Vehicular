
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  AlertController,
  IonNote,
  IonSpinner,
  IonSearchbar,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular';

import { SiteNavComponent } from '../../shared/site-nav/site-nav.component';
import { AuthService } from '../../services/auth.service';
import { MantencionesService } from '../../services/mantenciones.service';

@Component({
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.page.html',
  styleUrls: ['./mantenciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SiteNavComponent,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonNote,
    IonSpinner,
    IonSearchbar,
    IonSegment,
    IonSegmentButton
  ]
})
export class MantencionesPage implements OnInit {

  mantenciones: any[] = [];
  isAdmin = false;
  cargando = false;
  errorMessage = '';

  terminoBusqueda = '';
  filtroEstado = 'todas';

  readonly estados = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'en proceso', label: 'En proceso' },
    { value: 'realizada', label: 'Realizadas' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private mantencionService: MantencionesService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.verificarRolUsuario();
  }

  ionViewWillEnter(): void {
    this.verificarRolUsuario();
    this.cargarMantenciones();
  }

  get mantencionesFiltradas(): any[] {
    let resultado = [...this.mantenciones];

    const busqueda = this.terminoBusqueda.trim().toLowerCase();

    if (busqueda) {
      resultado = resultado.filter((mantencion) => {
        const texto = [
          mantencion.vehiculo_patente,
          mantencion.vehiculo_marca,
          mantencion.vehiculo_modelo,
          mantencion.descripcion,
          mantencion.tipo_mantencion,
          mantencion.estado
        ]
          .filter(valor => valor !== null && valor !== undefined)
          .join(' ')
          .toLowerCase();

        return texto.includes(busqueda);
      });
    }

    if (this.filtroEstado !== 'todas') {
      resultado = resultado.filter((mantencion) => {
        const estado = this.obtenerEstado(mantencion);

        return estado === this.normalizar(this.filtroEstado);
      });
    }

    return resultado;
  }

  verificarRolUsuario(): void {
    const rol = this.authService.getRole()
      .trim()
      .toLowerCase();

    this.isAdmin = rol === 'admin' || rol === 'administrador';

    this.cdr.markForCheck();
  }

  cargarMantenciones(): void {
    if (!this.authService.isLoggedIn()) {
      this.mantenciones = [];
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.mantencionService.getMantenciones().subscribe({
      next: (data: any[]) => {
        this.mantenciones = Array.isArray(data) ? data : [];
        this.cargando = false;
        this.cdr.detectChanges();

        console.log('Mantenciones recibidas:', this.mantenciones);
      },
      error: (err: any) => {
        console.error('Error al cargar mantenciones:', err);
        this.cargando = false;
        this.errorMessage = 'No se pudieron cargar las mantenciones.';

        this.mostrarAlerta(
          'Error',
          err.status === 401 || err.status === 403
            ? 'No tienes autorización para consultar las mantenciones. Inicia sesión nuevamente si es necesario.'
            : 'No se pudieron cargar las mantenciones.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  onBuscar(event: any): void {
    this.terminoBusqueda = event?.detail?.value ?? '';
  }

  onFiltroEstado(event: any): void {
    this.filtroEstado = event?.detail?.value ?? 'todas';
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todas';
  }

  private obtenerEstado(mantencion: any): string {
    const estado = mantencion?.estado
      ?? mantencion?.estado_mantencion
      ?? mantencion?.estado_mantenimiento
      ?? '';

    return this.normalizar(String(estado));
  }

  private normalizar(valor: string): string {
    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  colorEstado(estado: string): string {
    const normalizado = this.normalizar(estado || '');

    if (
      normalizado.includes('realizada') ||
      normalizado.includes('completada') ||
      normalizado.includes('finalizada')
    ) {
      return 'success';
    }

    if (
      normalizado.includes('pendiente') ||
      normalizado.includes('programada')
    ) {
      return 'warning';
    }

    if (
      normalizado.includes('proceso') ||
      normalizado.includes('curso')
    ) {
      return 'primary';
    }

    return 'medium';
  }

  async mostrarAlerta(
    titulo: string,
    mensaje: string
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmarEliminacion(id: number): Promise<void> {
    if (!this.isAdmin) {
      await this.mostrarAlerta(
        'Acceso denegado',
        'Solo el administrador puede eliminar mantenciones.'
      );
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta mantención?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarMantencion(id);
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarMantencion(id: number): void {
    if (!this.isAdmin) {
      return;
    }

    this.mantencionService.deleteMantencion(id).subscribe({
      next: () => {
        this.mostrarAlerta(
          'Éxito',
          'Mantención eliminada correctamente.'
        );

        this.cargarMantenciones();
      },
      error: (err: any) => {
        console.error('Error al eliminar mantención:', err);

        this.mostrarAlerta(
          'Error',
          err.status === 401 || err.status === 403
            ? 'No tienes permisos para eliminar esta mantención.'
            : 'No fue posible eliminar la mantención.'
        );

        this.cdr.markForCheck();
      }
    });
  }

  irACrear(): void {
    if (!this.isAdmin) {
      return;
    }

    this.router.navigate(['/mantenciones/crear']);
  }

  irAEditar(id: number): void {
    if (!this.isAdmin) {
      return;
    }

    this.router.navigate(['/mantenciones/editar', id]);
  }
}
