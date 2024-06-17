import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeModificationCollecteComponent } from './demande-modification-collecte.component';

describe('DemandeModificationCollecteComponent', () => {
  let component: DemandeModificationCollecteComponent;
  let fixture: ComponentFixture<DemandeModificationCollecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeModificationCollecteComponent],
    });
    fixture = TestBed.createComponent(DemandeModificationCollecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
