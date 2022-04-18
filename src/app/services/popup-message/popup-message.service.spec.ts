import { TestBed } from '@angular/core/testing';

import { PopupMessageService } from './popup-message.service';

describe('PopupMessageService', () => {
  let service: PopupMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
