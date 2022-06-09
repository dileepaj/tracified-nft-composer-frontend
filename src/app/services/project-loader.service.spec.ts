import { TestBed } from '@angular/core/testing';

import { ProjectLoaderService } from './project-loader.service';

describe('ProjectLoaderService', () => {
  let service: ProjectLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
