import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCollecteComponent } from './modifier-collecte.component';

describe('ModifierCollecteComponent', () => {
  let component: ModifierCollecteComponent;
  let fixture: ComponentFixture<ModifierCollecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierCollecteComponent]
    });
    fixture = TestBed.createComponent(ModifierCollecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
