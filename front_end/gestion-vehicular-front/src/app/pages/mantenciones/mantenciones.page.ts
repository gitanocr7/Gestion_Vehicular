
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
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
  IonSpinner
} from '@ionic/angular';

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
    IonHeader,
    IonToolbar,
    IonTitle,
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
    IonSpinner
  ]
})
export class MantencionesPage implements OnInit {

  mantenciones: any[] = [];
  isAdmin = false;
  cargando = false;

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

  /**
   * Comprueba el rol devuelto por el login.
   * Solo admin y administrador pueden modificar mantenciones.
   */
  verificarRolUsuario(): void {
    const rol = this.authService.getRole()
      .trim()
      .toLowerCase();

    this.isAdmin = rol === 'admin' || rol === 'administrador';

    this.cdr.markForCheck();
  }

  /**
   * Carga las mantenciones desde Django.
   */
  cargarMantenciones(): void {
    if (!this.authService.isLoggedIn()) {
      this.mantenciones = [];
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;
    this.cdr.markForCheck();

    this.mantencionService.getMantenciones().subscribe({
      next: (data: any[]) => {
        this.mantenciones = Array.isArray(data) ? data : [];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error al cargar mantenciones:', err);
        this.cargando = false;

        this.mostrarAlerta(
          'Error',
          err.status === 401 || err.status === 403
            ? 'No tienes autorización para consultar las mantenciones. Inicia sesión nuevamente si es necesario.'
            : 'No se pudieron cargar las mantenciones.'
        );

        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Muestra mensajes al usuario.
   */
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

  /**
   * Confirma la eliminación de una mantención.
   */
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

  /**
   * Elimina una mantención mediante el servicio.
   */
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

  /**
   * Abre el formulario de creación.
   */
  irACrear(): void {
    if (!this.isAdmin) {
      return;
    }

    this.router.navigate(['/mantenciones/crear']);
  }

  /**
   * Abre el formulario de edición.
   */
  irAEditar(id: number): void {
    if (!this.isAdmin) {
      return;
    }

    this.router.navigate(['/mantenciones/editar', id]);
  }
}
