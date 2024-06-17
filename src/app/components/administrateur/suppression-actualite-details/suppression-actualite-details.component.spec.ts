import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppressionActualiteDetailsComponent } from './suppression-actualite-details.component';

describe('SuppressionActualiteDetailsComponent', () => {
  let component: SuppressionActualiteDetailsComponent;
  let fixture: ComponentFixture<SuppressionActualiteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuppressionActualiteDetailsComponent],
    });
    fixture = TestBed.createComponent(SuppressionActualiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
