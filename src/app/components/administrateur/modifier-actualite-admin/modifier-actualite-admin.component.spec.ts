import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierActualiteAdminComponent } from './modifier-actualite-admin.component';

describe('ModifierActualiteAdminComponent', () => {
  let component: ModifierActualiteAdminComponent;
  let fixture: ComponentFixture<ModifierActualiteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierActualiteAdminComponent],
    });
    fixture = TestBed.createComponent(ModifierActualiteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
