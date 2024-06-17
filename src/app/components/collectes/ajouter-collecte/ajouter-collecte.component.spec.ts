import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCollecteComponent } from './ajouter-collecte.component';

describe('AjouterCollecteComponent', () => {
  let component: AjouterCollecteComponent;
  let fixture: ComponentFixture<AjouterCollecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterCollecteComponent],
    });
    fixture = TestBed.createComponent(AjouterCollecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
