
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
    crear: jasmine.createSpy('crear').and.returnValue(of({
      id: 1,
      patente: 'TEST01'
    }))
  };

  const authServiceMock = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
    getRole: jasmine.createSpy('getRole').and.returnValue('admin'),
    getUser: jasmine.createSpy('getUser').and.returnValue({
      id: 1,
      rol: 'admin',
      token: 'test-token'
    }),
    getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicle types', () => {
    expect(vehiculosServiceMock.listarTipos).toHaveBeenCalled();
  });
});
