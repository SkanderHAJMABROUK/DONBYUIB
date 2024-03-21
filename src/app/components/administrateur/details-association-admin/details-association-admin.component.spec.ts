import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAssociationAdminComponent } from './details-association-admin.component';

describe('DetailsAssociationAdminComponent', () => {
  let component: DetailsAssociationAdminComponent;
  let fixture: ComponentFixture<DetailsAssociationAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsAssociationAdminComponent]
    });
    fixture = TestBed.createComponent(DetailsAssociationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
