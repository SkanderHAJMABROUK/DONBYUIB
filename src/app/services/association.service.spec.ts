import { TestBed } from '@angular/core/testing';

import { AssociationService } from './association.service';
describe('AuthentificationService', () => {
  let service: AssociationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssociationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
