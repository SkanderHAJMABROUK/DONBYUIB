import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesActualitesComponent } from './demandes-actualites.component';

describe('DemandesActualitesComponent', () => {
  let component: DemandesActualitesComponent;
  let fixture: ComponentFixture<DemandesActualitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesActualitesComponent]
    });
    fixture = TestBed.createComponent(DemandesActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
