import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeModificationActualiteComponent } from './demande-modification-actualite.component';

describe('DemandeModificationActualiteComponent', () => {
  let component: DemandeModificationActualiteComponent;
  let fixture: ComponentFixture<DemandeModificationActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeModificationActualiteComponent]
    });
    fixture = TestBed.createComponent(DemandeModificationActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
