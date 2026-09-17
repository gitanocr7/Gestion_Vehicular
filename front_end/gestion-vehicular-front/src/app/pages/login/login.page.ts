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
  IonIcon
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  credentials = {
    identificador: '',
    password: ''
  };

  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin() {
    if (!this.credentials.identificador || !this.credentials.password) {
      this.errorMessage = 'Por favor, ingrese su identificador (RUT o Correo) y contraseña.';
      return;
    }

    this.errorMessage = '';

    const payload = {
      identificador: this.credentials.identificador,
      password: this.credentials.password
    };

    console.log('Intentando iniciar sesión con payload:', payload);

    this.authService.login(payload).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/index']);
      },
      error: (err: any) => {
        console.error('Error detallado del backend al iniciar sesión:', err);
        this.errorMessage = err.error?.mensaje || 'Credenciales inválidas. Verifique sus datos.';
        // La app corre en modo "zoneless" (sin zone.js): hay que pedir explícitamente
        // que se vuelva a renderizar la vista al recibir la respuesta de forma asíncrona.
        this.cdr.markForCheck();
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}