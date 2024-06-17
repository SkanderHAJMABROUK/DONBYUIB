import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilDonateurComponent } from './profil-donateur.component';

describe('ProfilDonateurComponent', () => {
  let component: ProfilDonateurComponent;
  let fixture: ComponentFixture<ProfilDonateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilDonateurComponent],
    });
    fixture = TestBed.createComponent(ProfilDonateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
