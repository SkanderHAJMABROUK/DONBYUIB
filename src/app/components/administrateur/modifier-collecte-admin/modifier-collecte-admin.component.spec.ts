import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCollecteAdminComponent } from './modifier-collecte-admin.component';

describe('ModifierCollecteAdminComponent', () => {
  let component: ModifierCollecteAdminComponent;
  let fixture: ComponentFixture<ModifierCollecteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierCollecteAdminComponent],
    });
    fixture = TestBed.createComponent(ModifierCollecteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
