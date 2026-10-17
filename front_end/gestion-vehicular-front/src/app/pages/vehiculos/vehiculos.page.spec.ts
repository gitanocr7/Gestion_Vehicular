
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculosPage } from './vehiculos.page';
import { VehiculosService } from '../../services/vehiculos.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('VehiculosPage', () => {
  let component: VehiculosPage;
  let fixture: ComponentFixture<VehiculosPage>;

  const vehiculosServiceMock = {
    listar: jasmine.createSpy('listar').and.returnValue(of([])),
    listarTipos: jasmine.createSpy('listarTipos').and.returnValue(of([])),
    obtener: jasmine.createSpy('obtener').and.returnValue(
      of({
        id: 1,
        patente: 'TEST01',
        marca: 'Toyota',
        modelo: 'Yaris',
        anio: 2024,
        estado_operativo: 'Disponible',
        kilometraje: 1000,
        fecha_adquisicion: '2024-01-01',
        tipo_vehiculo: 5
      })
    ),
    crear: jasmine.createSpy('crear').and.returnValue(
      of({
        id: 1,
        patente: 'TEST01',
        marca: 'Toyota',
        modelo: 'Yaris',
        anio: 2024,
        estado_operativo: 'Disponible',
        kilometraje: 1000,
        fecha_adquisicion: '2024-01-01',
        tipo_vehiculo: 5
      })
    )
  };

  const authServiceMock = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
    getRole: jasmine.createSpy('getRole').and.returnValue('admin'),
    getUser: jasmine.createSpy('getUser').and.returnValue({
      id: 1,
      rol: 'admin',
      token: 'test-token'
    }),
    getToken: jasmine.createSpy('getToken').and.returnValue('test-token'),
    getUsuarioActual: jasmine.createSpy('getUsuarioActual').and.returnValue({
      id: 1,
      rol: 'admin',
      token: 'test-token'
    })
  };

  beforeEach(async () => {
    // Reiniciar los mocks antes de cada prueba.
    vehiculosServiceMock.listar.calls.reset();
    vehiculosServiceMock.listarTipos.calls.reset();
    vehiculosServiceMock.obtener.calls.reset();
    vehiculosServiceMock.crear.calls.reset();

    await TestBed.configureTestingModule({
      imports: [VehiculosPage],
      providers: [
        {
          provide: VehiculosService,
          useValue: vehiculosServiceMock
        },
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los vehículos', () => {
    expect(vehiculosServiceMock.listar).toHaveBeenCalled();
  });

  it('debería cargar los tipos de vehículos', () => {
    expect(vehiculosServiceMock.listarTipos).toHaveBeenCalled();
  });

  it('debería reconocer al usuario administrador', () => {
    expect(component.esAdmin).toBeTrue();
  });
});
