import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationDemandeComponent } from './association-demande.component';

describe('AssociationDemandeComponent', () => {
  let component: AssociationDemandeComponent;
  let fixture: ComponentFixture<AssociationDemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociationDemandeComponent]
    });
    fixture = TestBed.createComponent(AssociationDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
