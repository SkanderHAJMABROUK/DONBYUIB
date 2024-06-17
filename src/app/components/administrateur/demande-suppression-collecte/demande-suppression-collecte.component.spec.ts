import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeSuppressionCollecteComponent } from './demande-suppression-collecte.component';

describe('DemandeSuppressionCollecteComponent', () => {
  let component: DemandeSuppressionCollecteComponent;
  let fixture: ComponentFixture<DemandeSuppressionCollecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeSuppressionCollecteComponent],
    });
    fixture = TestBed.createComponent(DemandeSuppressionCollecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
