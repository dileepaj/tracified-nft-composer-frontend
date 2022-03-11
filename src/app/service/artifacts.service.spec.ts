import { TestBed } from '@angular/core/testing';

import { ArtifactService } from './artifacts.service';

describe('ArtifactsService', () => {
  let service: ArtifactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtifactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
