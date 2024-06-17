import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsActualiteAdminComponent } from './details-actualite-admin.component';

describe('DetailsActualiteAdminComponent', () => {
  let component: DetailsActualiteAdminComponent;
  let fixture: ComponentFixture<DetailsActualiteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsActualiteAdminComponent],
    });
    fixture = TestBed.createComponent(DetailsActualiteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
