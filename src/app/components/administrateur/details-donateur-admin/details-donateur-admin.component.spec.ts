import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDonateurAdminComponent } from './details-donateur-admin.component';

describe('DetailsDonateurAdminComponent', () => {
  let component: DetailsDonateurAdminComponent;
  let fixture: ComponentFixture<DetailsDonateurAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsDonateurAdminComponent],
    });
    fixture = TestBed.createComponent(DetailsDonateurAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
