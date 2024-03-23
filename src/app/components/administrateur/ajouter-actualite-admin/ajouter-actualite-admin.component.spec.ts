import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterActualiteAdminComponent } from './ajouter-actualite-admin.component';

describe('AjouterActualiteAdminComponent', () => {
  let component: AjouterActualiteAdminComponent;
  let fixture: ComponentFixture<AjouterActualiteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterActualiteAdminComponent]
    });
    fixture = TestBed.createComponent(AjouterActualiteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
