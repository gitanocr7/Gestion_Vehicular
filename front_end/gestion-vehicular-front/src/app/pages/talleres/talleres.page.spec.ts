import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TalleresPage } from './talleres.page';

describe('TalleresPage', () => {
  let component: TalleresPage;
  let fixture: ComponentFixture<TalleresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TalleresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
