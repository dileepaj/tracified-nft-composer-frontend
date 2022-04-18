import { TestBed } from '@angular/core/testing';

import { DndServiceService } from './dnd-service.service';

describe('DndServiceService', () => {
  let service: DndServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DndServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
