import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollecteDetailsAssocationComponent } from './collecte-details-assocation.component';

describe('CollecteDetailsAssocationComponent', () => {
  let component: CollecteDetailsAssocationComponent;
  let fixture: ComponentFixture<CollecteDetailsAssocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollecteDetailsAssocationComponent],
    });
    fixture = TestBed.createComponent(CollecteDetailsAssocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
