import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppressionCollecteDetailsComponent } from './suppression-collecte-details.component';

describe('SuppressionCollecteDetailsComponent', () => {
  let component: SuppressionCollecteDetailsComponent;
  let fixture: ComponentFixture<SuppressionCollecteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuppressionCollecteDetailsComponent]
    });
    fixture = TestBed.createComponent(SuppressionCollecteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
