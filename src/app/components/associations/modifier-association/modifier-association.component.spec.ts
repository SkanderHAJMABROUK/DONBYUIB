import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAssociationComponent } from './modifier-association.component';

describe('ModifierAssociationComponent', () => {
  let component: ModifierAssociationComponent;
  let fixture: ComponentFixture<ModifierAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierAssociationComponent],
    });
    fixture = TestBed.createComponent(ModifierAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
