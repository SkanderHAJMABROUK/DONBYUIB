import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterDonateurAdminComponent } from './ajouter-donateur-admin.component';

describe('AjouterDonateurAdminComponent', () => {
  let component: AjouterDonateurAdminComponent;
  let fixture: ComponentFixture<AjouterDonateurAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterDonateurAdminComponent]
    });
    fixture = TestBed.createComponent(AjouterDonateurAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
