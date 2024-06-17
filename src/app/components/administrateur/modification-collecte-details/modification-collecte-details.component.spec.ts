import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationCollecteDetailsComponent } from './modification-collecte-details.component';

describe('ModificationCollecteDetailsComponent', () => {
  let component: ModificationCollecteDetailsComponent;
  let fixture: ComponentFixture<ModificationCollecteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificationCollecteDetailsComponent],
    });
    fixture = TestBed.createComponent(ModificationCollecteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
