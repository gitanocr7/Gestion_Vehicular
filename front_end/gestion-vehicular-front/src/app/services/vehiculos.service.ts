import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  estado_operativo: string;
  kilometraje: number;
  fecha_adquisicion: string;
  imagen?: string | null;
  tipo_vehiculo: number;
  tipo_vehiculo_nombre?: string;
}

/**
 * Servicio de consulta pública de la flota de vehículos.
 * Cubre HU-02 (listar), HU-03 (buscar), HU-04 (consultar estado) y HU-06 (filtrar por
 * disponibilidad). No requiere sesión iniciada: cualquier persona puede consultarlo.
 */
@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private baseUrl = `${environment.apiUrl}vehiculos/`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { search?: string; estado?: string }): Observable<Vehiculo[]> {
    let params = new HttpParams();
    if (filtros?.search) {
      params = params.set('search', filtros.search);
    }
    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }
    return this.http.get<Vehiculo[]>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.baseUrl}${id}/`);
  }
}
