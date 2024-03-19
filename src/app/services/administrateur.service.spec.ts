import { TestBed } from '@angular/core/testing';

import { AdministrateurService } from './administrateur.service';

describe('AdministrateurService', () => {
  let service: AdministrateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
