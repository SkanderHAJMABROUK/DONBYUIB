import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAssociationsComponent } from './demandes-associations.component';

describe('DemandesAssociationsComponent', () => {
  let component: DemandesAssociationsComponent;
  let fixture: ComponentFixture<DemandesAssociationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesAssociationsComponent],
    });
    fixture = TestBed.createComponent(DemandesAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
