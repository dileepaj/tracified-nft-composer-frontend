import { TestBed } from '@angular/core/testing';

import { ComposerBackendService } from './composer-backend.service';

describe('ComposerBackendService', () => {
  let service: ComposerBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComposerBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
