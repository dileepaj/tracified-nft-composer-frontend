import { TestBed } from '@angular/core/testing';

import { ExpService } from './exp.service';

describe('ExpService', () => {
  let service: ExpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
