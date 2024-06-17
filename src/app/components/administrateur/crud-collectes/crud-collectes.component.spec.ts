import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCollectesComponent } from './crud-collectes.component';

describe('CrudCollectesComponent', () => {
  let component: CrudCollectesComponent;
  let fixture: ComponentFixture<CrudCollectesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudCollectesComponent],
    });
    fixture = TestBed.createComponent(CrudCollectesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
