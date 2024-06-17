import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAssociationsComponent } from './crud-associations.component';

describe('CrudAssociationsComponent', () => {
  let component: CrudAssociationsComponent;
  let fixture: ComponentFixture<CrudAssociationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudAssociationsComponent],
    });
    fixture = TestBed.createComponent(CrudAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
