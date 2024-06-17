import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollecteListAssociationComponent } from './collecte-list-association.component';

describe('CollecteListAssociationComponent', () => {
  let component: CollecteListAssociationComponent;
  let fixture: ComponentFixture<CollecteListAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollecteListAssociationComponent],
    });
    fixture = TestBed.createComponent(CollecteListAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
