import { TestBed } from '@angular/core/testing';

import { CollecteService } from './collecte.service';

describe('CollecteService', () => {
  let service: CollecteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollecteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
