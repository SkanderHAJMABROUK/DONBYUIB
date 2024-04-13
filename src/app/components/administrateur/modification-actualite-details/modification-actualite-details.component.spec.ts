import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationActualiteDetailsComponent } from './modification-actualite-details.component';

describe('ModificationActualiteDetailsComponent', () => {
  let component: ModificationActualiteDetailsComponent;
  let fixture: ComponentFixture<ModificationActualiteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificationActualiteDetailsComponent]
    });
    fixture = TestBed.createComponent(ModificationActualiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
