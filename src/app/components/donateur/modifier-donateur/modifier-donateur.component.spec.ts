import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierDonateurComponent } from './modifier-donateur.component';

describe('ModifierDonateurComponent', () => {
  let component: ModifierDonateurComponent;
  let fixture: ComponentFixture<ModifierDonateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierDonateurComponent],
    });
    fixture = TestBed.createComponent(ModifierDonateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
