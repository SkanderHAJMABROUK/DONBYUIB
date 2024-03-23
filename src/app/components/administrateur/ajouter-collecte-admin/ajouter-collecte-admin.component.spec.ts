import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCollecteAdminComponent } from './ajouter-collecte-admin.component';

describe('AjouterCollecteAdminComponent', () => {
  let component: AjouterCollecteAdminComponent;
  let fixture: ComponentFixture<AjouterCollecteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterCollecteAdminComponent]
    });
    fixture = TestBed.createComponent(AjouterCollecteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
