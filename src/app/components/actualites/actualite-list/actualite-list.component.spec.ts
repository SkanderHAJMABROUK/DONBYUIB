import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteListComponent } from './actualite-list.component';

describe('ActualiteListComponent', () => {
  let component: ActualiteListComponent;
  let fixture: ComponentFixture<ActualiteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualiteListComponent],
    });
    fixture = TestBed.createComponent(ActualiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
