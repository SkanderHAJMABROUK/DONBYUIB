import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteDetailsAssociationsComponent } from './actualite-details-associations.component';

describe('ActualiteDetailsAssociationsComponent', () => {
  let component: ActualiteDetailsAssociationsComponent;
  let fixture: ComponentFixture<ActualiteDetailsAssociationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualiteDetailsAssociationsComponent]
    });
    fixture = TestBed.createComponent(ActualiteDetailsAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
