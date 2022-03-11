import { TestBed } from '@angular/core/testing';

import { CarbonFootprintStatsService } from './carbon-footprint-stats.service';

describe('CarbonFootprintStatsService', () => {
  let service: CarbonFootprintStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonFootprintStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
