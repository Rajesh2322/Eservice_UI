import { TestBed } from '@angular/core/testing';

import { ObsService } from './obs.service';

describe('ObsService', () => {
  let service: ObsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
