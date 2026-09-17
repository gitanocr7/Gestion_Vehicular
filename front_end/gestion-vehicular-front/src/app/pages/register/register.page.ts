import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  AlertController
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonIcon
  ]
})
export class RegisterPage {
  user = {
    nombre: '',
    correo: '',
    rut: '',
    password: '',
    rol: 3
  };

  errors = {
    nombre: '',
    correo: '',
    rut: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {}

  validarNombre() {
    if (!this.user.nombre.trim()) {
      this.errors.nombre = 'El nombre es obligatorio.';
    } else {
      this.errors.nombre = '';
    }
  }

  validarCorreo() {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.user.correo) {
      this.errors.correo = 'El correo electrónico es obligatorio.';
    } else if (!regexCorreo.test(this.user.correo)) {
      this.errors.correo = 'Ingrese un correo electrónico válido (ej: usuario@dominio.com).';
    } else {
      this.errors.correo = '';
    }
  }

  validarRut() {
    const regexRut = /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/;
    if (!this.user.rut) {
      this.errors.rut = 'El RUT es obligatorio.';
    } else if (!regexRut.test(this.user.rut)) {
      this.errors.rut = 'Formato inválido. Use el formato 12345678-9 o 12.345.678-K.';
    } else {
      this.errors.rut = '';
    }
  }

  validarPassword() {
    if (!this.user.password) {
      this.errors.password = 'La contraseña es obligatoria.';
    } else if (this.user.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      this.errors.password = '';
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  onRegister() {
    this.validarNombre();
    this.validarCorreo();
    this.validarRut();
    this.validarPassword();

    if (this.errors.nombre || this.errors.correo || this.errors.rut || this.errors.password) {
      return;
    }

    console.log('Enviando datos al backend:', this.user);

    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        console.log('Usuario registrado con éxito:', response);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error al registrar usuario:', err);
        
        let mensajes: string[] = [];
        // Apuntamos correctamente a la propiedad 'errores' devuelta por el backend
        const errorData = err.error?.errores || err.error;

        if (errorData) {
          if (errorData.correo) {
            this.errors.correo = 'El correo ya fue registrado.';
            mensajes.push('El correo ya fue registrado.');
          }
          if (errorData.rut) {
            this.errors.rut = 'El RUT ya esta ingresado.';
            mensajes.push('El RUT ya esta ingresado.');
          }
        }

        const mensajeAlerta = mensajes.length > 0 ? mensajes.join('\n') : 'Por favor, revise los datos ingresados.';
        this.mostrarAlerta('Atención', mensajeAlerta);
        // La app corre en modo "zoneless" (sin zone.js): hay que pedir explícitamente
        // que se vuelva a renderizar la vista al recibir la respuesta de forma asíncrona.
        this.cdr.markForCheck();
      }
    });
  }
} 