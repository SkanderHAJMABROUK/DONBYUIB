import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscrireAssociationComponent } from './inscrire-association.component';

describe('InscrireAssociationComponent', () => {
  let component: InscrireAssociationComponent;
  let fixture: ComponentFixture<InscrireAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscrireAssociationComponent]
    });
    fixture = TestBed.createComponent(InscrireAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
