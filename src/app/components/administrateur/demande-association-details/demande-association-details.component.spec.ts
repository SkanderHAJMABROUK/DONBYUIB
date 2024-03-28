import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeAssociationDetailsComponent } from './demande-association-details.component';

describe('DemandeAssociationDetailsComponent', () => {
  let component: DemandeAssociationDetailsComponent;
  let fixture: ComponentFixture<DemandeAssociationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeAssociationDetailsComponent]
    });
    fixture = TestBed.createComponent(DemandeAssociationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
