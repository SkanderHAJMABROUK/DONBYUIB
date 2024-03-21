import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudActualitesComponent } from './crud-actualites.component';

describe('CrudActualitesComponent', () => {
  let component: CrudActualitesComponent;
  let fixture: ComponentFixture<CrudActualitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudActualitesComponent]
    });
    fixture = TestBed.createComponent(CrudActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
