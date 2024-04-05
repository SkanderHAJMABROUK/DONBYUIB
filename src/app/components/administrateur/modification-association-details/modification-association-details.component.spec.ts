import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationAssociationDetailsComponent } from './modification-association-details.component';

describe('ModificationAssociationDetailsComponent', () => {
  let component: ModificationAssociationDetailsComponent;
  let fixture: ComponentFixture<ModificationAssociationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificationAssociationDetailsComponent]
    });
    fixture = TestBed.createComponent(ModificationAssociationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
