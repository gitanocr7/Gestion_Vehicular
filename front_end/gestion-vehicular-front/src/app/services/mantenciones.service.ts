
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

@Injectable({
  providedIn: 'root'
})
export class MantencionesService {

  private baseUrl =
    `${environment.apiUrl.replace(/\/+$/, '')}/mantenciones/`;

  constructor(private http: HttpClient) {}

  /**
   * Lista las mantenciones.
   * Puede filtrar por el ID de un vehículo.
   */
  getMantenciones(vehiculoId?: number): Observable<Mantencion[]> {
    let params = new HttpParams();

    if (vehiculoId !== undefined && vehiculoId !== null) {
      params = params.set('vehiculo', vehiculoId.toString());
    }

    return this.http.get<Mantencion[]>(this.baseUrl, { params });
  }

  /**
   * Alias para conservar compatibilidad con otros componentes.
   */
  listar(vehiculoId?: number): Observable<Mantencion[]> {
    return this.getMantenciones(vehiculoId);
  }

  /**
   * Obtiene una mantención por su ID.
   */
  obtener(id: number): Observable<Mantencion> {
    return this.http.get<Mantencion>(
      `${this.baseUrl}${id}/`
    );
  }

  /**
   * Crea una mantención.
   */
  crear(datos: Partial<Mantencion>): Observable<Mantencion> {
    return this.http.post<Mantencion>(
      this.baseUrl,
      datos
    );
  }

  /**
   * Actualiza una mantención existente.
   */
  actualizar(
    id: number,
    datos: Partial<Mantencion>
  ): Observable<Mantencion> {
    return this.http.patch<Mantencion>(
      `${this.baseUrl}${id}/`,
      datos
    );
  }

  /**
   * Elimina una mantención.
   * Django debe verificar que el usuario sea administrador.
   */
  deleteMantencion(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${id}/`
    );
  }

  /**
   * Alias alternativo para eliminar.
   */
  eliminar(id: number): Observable<void> {
    return this.deleteMantencion(id);
  }
}
