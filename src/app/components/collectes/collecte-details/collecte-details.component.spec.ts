import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollecteDetailsComponent } from './collecte-details.component';

describe('CollecteDetailsComponent', () => {
  let component: CollecteDetailsComponent;
  let fixture: ComponentFixture<CollecteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollecteDetailsComponent]
    });
    fixture = TestBed.createComponent(CollecteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
