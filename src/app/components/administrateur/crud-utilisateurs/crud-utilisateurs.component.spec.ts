import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudUtilisateursComponent } from './crud-utilisateurs.component';

describe('CrudUtilisateursComponent', () => {
  let component: CrudUtilisateursComponent;
  let fixture: ComponentFixture<CrudUtilisateursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudUtilisateursComponent],
    });
    fixture = TestBed.createComponent(CrudUtilisateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
