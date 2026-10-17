import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.page.html',
  styleUrls: ['./mantenciones.page.scss'],
})
export class MantencionesPage implements OnInit {
  mantenciones: any[] = [];
  isAdmin: boolean = false; // Bandera para controlar la interfaz
  private apiUrl = 'http://localhost:8000/api/mantenciones/'; // Ajusta tu URL API

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ionViewWillEnter() {
    this.verificarRol();
    this.cargarMantenciones();
  }

  verificarRol() {
    // Lee el rol guardado durante el Login en localStorage/SessionStorage
    const nombreRol = localStorage.getItem('nombre_rol');
    this.isAdmin = nombreRol === 'Administrador';
  }

  cargarMantenciones() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => (this.mantenciones = data),
      error: (err) => console.error('Error cargando mantenciones:', err),
    });
  }

  // Método de eliminación exclusivo para Admin
  async eliminarMantencion(id: number) {
    if (!this.isAdmin) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar este registro de mantención?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Token ${token}`);

            this.http.delete(`${this.apiUrl}${id}/`, { headers }).subscribe({
              next: () => {
                this.mostrarToast('Mantención eliminada correctamente');
                this.cargarMantenciones();
              },
              error: () => this.mostrarToast('Error al intentar eliminar'),
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarToast(msj: string) {
    const toast = await this.toastCtrl.create({ message: msj, duration: 2000 });
    toast.present();
  }
}