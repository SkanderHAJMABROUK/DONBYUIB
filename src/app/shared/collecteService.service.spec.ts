import { TestBed } from '@angular/core/testing';

import { CollecteServiceService } from './collecte-service.service';

describe('CollecteServiceService', () => {
  let service: CollecteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollecteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
