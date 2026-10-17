
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoVehiculo {
  id: number;
  nombre_tipo: string;
  descripcion?: string | null;
}

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

export interface VehiculoCrear {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  estado_operativo: string;
  kilometraje: number;
  fecha_adquisicion: string;
  tipo_vehiculo: number;
  imagen?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private readonly baseUrl = `${environment.apiUrl}vehiculos/`;
  private readonly tiposUrl = `${environment.apiUrl}tipos-vehiculo/`;

  constructor(private http: HttpClient) {}

  listar(
    filtros?: { search?: string; estado?: string }
  ): Observable<Vehiculo[]> {
    let params = new HttpParams();

    if (filtros?.search) {
      params = params.set('search', filtros.search);
    }

    if (filtros?.estado && filtros.estado !== 'todos') {
      params = params.set('estado', filtros.estado);
    }

    return this.http.get<Vehiculo[]>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.baseUrl}${id}/`);
  }

  listarTipos(): Observable<TipoVehiculo[]> {
    console.log('[VehiculosService] URL de tipos:', this.tiposUrl);

    return this.http.get<TipoVehiculo[]>(this.tiposUrl).pipe(
      tap({
        next: (datos) => {
          console.log('[VehiculosService] Tipos recibidos:', datos);
        },
        error: (error) => {
          console.error(
            '[VehiculosService] Error al obtener tipos:',
            error.status,
            error.message,
            error
          );
        }
      })
    );
  }

  crear(datos: VehiculoCrear): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.baseUrl, datos);
  }
}
