import { TestBed } from '@angular/core/testing';

import { ApiserverService } from './apiserver.service';

describe('ApiserverService', () => {
  let service: ApiserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
