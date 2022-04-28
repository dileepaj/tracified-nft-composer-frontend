import { TestBed } from '@angular/core/testing';

import { WidgethighlightingService } from './widgethighlighting.service';

describe('WidgethighlightingService', () => {
  let service: WidgethighlightingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgethighlightingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
