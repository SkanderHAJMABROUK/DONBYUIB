import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCollectesComponent } from './demandes-collectes.component';

describe('DemandesCollectesComponent', () => {
  let component: DemandesCollectesComponent;
  let fixture: ComponentFixture<DemandesCollectesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesCollectesComponent],
    });
    fixture = TestBed.createComponent(DemandesCollectesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
