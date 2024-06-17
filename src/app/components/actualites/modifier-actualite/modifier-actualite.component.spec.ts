import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierActualiteComponent } from './modifier-actualite.component';

describe('ModifierActualiteComponent', () => {
  let component: ModifierActualiteComponent;
  let fixture: ComponentFixture<ModifierActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierActualiteComponent],
    });
    fixture = TestBed.createComponent(ModifierActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
