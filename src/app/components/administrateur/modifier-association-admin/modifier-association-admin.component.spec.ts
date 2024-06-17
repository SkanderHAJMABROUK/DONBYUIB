import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAssociationAdminComponent } from './modifier-association-admin.component';

describe('ModifierAssociationAdminComponent', () => {
  let component: ModifierAssociationAdminComponent;
  let fixture: ComponentFixture<ModifierAssociationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierAssociationAdminComponent],
    });
    fixture = TestBed.createComponent(ModifierAssociationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
