import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetForgottenPasswordComponent } from './reset-forgotten-password.component';

describe('ResetForgottenPasswordComponent', () => {
  let component: ResetForgottenPasswordComponent;
  let fixture: ComponentFixture<ResetForgottenPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetForgottenPasswordComponent],
    });
    fixture = TestBed.createComponent(ResetForgottenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
