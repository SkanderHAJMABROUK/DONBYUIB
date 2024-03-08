import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilAssociationComponent } from './profil-association.component';

describe('ProfilAssociationComponent', () => {
  let component: ProfilAssociationComponent;
  let fixture: ComponentFixture<ProfilAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilAssociationComponent]
    });
    fixture = TestBed.createComponent(ProfilAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
