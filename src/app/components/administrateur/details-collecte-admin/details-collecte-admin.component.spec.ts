import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCollecteAdminComponent } from './details-collecte-admin.component';

describe('DetailsCollecteAdminComponent', () => {
  let component: DetailsCollecteAdminComponent;
  let fixture: ComponentFixture<DetailsCollecteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsCollecteAdminComponent],
    });
    fixture = TestBed.createComponent(DetailsCollecteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
