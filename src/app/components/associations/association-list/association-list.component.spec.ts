import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationListComponent } from './association-list.component';

describe('AssociationListComponent', () => {
  let component: AssociationListComponent;
  let fixture: ComponentFixture<AssociationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociationListComponent]
    });
    fixture = TestBed.createComponent(AssociationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
