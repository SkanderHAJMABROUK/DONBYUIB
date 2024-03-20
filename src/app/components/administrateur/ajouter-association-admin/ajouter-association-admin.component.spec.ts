import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAssociationAdminComponent } from './ajouter-association-admin.component';

describe('AjouterAssociationAdminComponent', () => {
  let component: AjouterAssociationAdminComponent;
  let fixture: ComponentFixture<AjouterAssociationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterAssociationAdminComponent]
    });
    fixture = TestBed.createComponent(AjouterAssociationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
