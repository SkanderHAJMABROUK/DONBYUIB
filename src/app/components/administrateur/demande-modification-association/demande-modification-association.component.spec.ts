import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeModificationAssociationComponent } from './demande-modification-association.component';

describe('DemandeModificationAssociationComponent', () => {
  let component: DemandeModificationAssociationComponent;
  let fixture: ComponentFixture<DemandeModificationAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeModificationAssociationComponent],
    });
    fixture = TestBed.createComponent(DemandeModificationAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
