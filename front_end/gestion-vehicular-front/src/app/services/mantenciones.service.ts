import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Mantencion {
  id: number;
  vehiculo: number;
  vehiculo_patente?: string;
  vehiculo_marca?: string;
  vehiculo_modelo?: string;
  usuario_responsable: number;
  usuario_responsable_nombre?: string;
  tipo_mantencion: string;
  fecha_programada: string;
  fecha_realizada?: string | null;
  estado: string;
  km_actual: number;
  observaciones?: string | null;
  costo_total: string | number;
}

/**
 * Servicio de consulta pública del historial de mantenciones (HU-08: "Como ciudadano,
 * quiero consultar las mantenciones disponibles de un vehículo para conocer sus
 * antecedentes"). No requiere sesión iniciada.
 */
@Injectable({
  providedIn: 'root'
})
export class MantencionesService {
  private baseUrl = `${environment.apiUrl}mantenciones/`;

  constructor(private http: HttpClient) {}

  listar(vehiculoId?: number): Observable<Mantencion[]> {
    let params = new HttpParams();
    if (vehiculoId) {
      params = params.set('vehiculo', vehiculoId);
    }
    return this.http.get<Mantencion[]>(this.baseUrl, { params });
  }
}
