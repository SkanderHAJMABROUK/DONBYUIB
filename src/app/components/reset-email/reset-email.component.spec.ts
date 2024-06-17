import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetEmailComponent } from './reset-email.component';

describe('ResetEmailComponent', () => {
  let component: ResetEmailComponent;
  let fixture: ComponentFixture<ResetEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetEmailComponent],
    });
    fixture = TestBed.createComponent(ResetEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
