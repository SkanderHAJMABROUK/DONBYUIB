import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteListAssociationComponent } from './actualite-list-association.component';

describe('ActualiteListAssociationComponent', () => {
  let component: ActualiteListAssociationComponent;
  let fixture: ComponentFixture<ActualiteListAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualiteListAssociationComponent],
    });
    fixture = TestBed.createComponent(ActualiteListAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
