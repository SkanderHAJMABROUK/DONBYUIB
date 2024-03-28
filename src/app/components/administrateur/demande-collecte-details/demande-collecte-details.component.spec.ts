import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCollecteDetailsComponent } from './demande-collecte-details.component';

describe('DemandeCollecteDetailsComponent', () => {
  let component: DemandeCollecteDetailsComponent;
  let fixture: ComponentFixture<DemandeCollecteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeCollecteDetailsComponent]
    });
    fixture = TestBed.createComponent(DemandeCollecteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
