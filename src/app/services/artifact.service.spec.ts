import { TestBed } from '@angular/core/testing';

import { ArtifactService } from './artifact.service';

describe('ArtifactService', () => {
  let service: ArtifactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
