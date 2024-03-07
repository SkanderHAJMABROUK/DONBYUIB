import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterActualiteComponent } from './ajouter-actualite.component';

describe('AjouterActualiteComponent', () => {
  let component: AjouterActualiteComponent;
  let fixture: ComponentFixture<AjouterActualiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterActualiteComponent]
    });
    fixture = TestBed.createComponent(AjouterActualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
