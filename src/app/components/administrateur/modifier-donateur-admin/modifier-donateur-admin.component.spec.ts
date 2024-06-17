import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDonateurAdminComponent } from './modifier-donateur-admin.component';

describe('ModifierDonateurAdminComponent', () => {
  let component: ModifierDonateurAdminComponent;
  let fixture: ComponentFixture<ModifierDonateurAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierDonateurAdminComponent],
    });
    fixture = TestBed.createComponent(ModifierDonateurAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
