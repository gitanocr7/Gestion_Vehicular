import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PuntoInteres {
  id: number;
  nombre: string;
  tipo: 'grifo' | 'taller' | 'otro';
  latitud: string | number;
  longitud: string | number;
  direccion?: string | null;
  descripcion?: string | null;
  publicado: boolean;
}

/**
 * Servicio de consulta pública del mapa de grifos y puntos de interés
 * (HU-13: visualizar mapa, HU-14: ver grifos y otros puntos de interés).
 * No requiere sesión iniciada.
 */
@Injectable({
  providedIn: 'root'
})
export class PuntosInteresService {
  private baseUrl = `${environment.apiUrl}puntos-interes/`;

  constructor(private http: HttpClient) {}

  listar(tipo?: string): Observable<PuntoInteres[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get<PuntoInteres[]>(this.baseUrl, { params });
  }
}
