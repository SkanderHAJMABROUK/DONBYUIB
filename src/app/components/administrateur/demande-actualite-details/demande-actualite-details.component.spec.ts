import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeActualiteDetailsComponent } from './demande-actualite-details.component';

describe('DemandeActualiteDetailsComponent', () => {
  let component: DemandeActualiteDetailsComponent;
  let fixture: ComponentFixture<DemandeActualiteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeActualiteDetailsComponent],
    });
    fixture = TestBed.createComponent(DemandeActualiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
