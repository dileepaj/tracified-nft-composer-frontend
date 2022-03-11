import { TestBed } from '@angular/core/testing';

import { ProofsService } from './proofs.service';

describe('ProofsService', () => {
  let service: ProofsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProofsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
