import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteAssociationComponent } from './compte-association.component';

describe('CompteAssociationComponent', () => {
  let component: CompteAssociationComponent;
  let fixture: ComponentFixture<CompteAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompteAssociationComponent]
    });
    fixture = TestBed.createComponent(CompteAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
