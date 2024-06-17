import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeSuppressionActualiteComponent } from './demande-suppression-actualite.component';

describe('DemandeSuppressionActualiteComponent', () => {
  let component: DemandeSuppressionActualiteComponent;
  let fixture: ComponentFixture<DemandeSuppressionActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeSuppressionActualiteComponent],
    });
    fixture = TestBed.createComponent(DemandeSuppressionActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
