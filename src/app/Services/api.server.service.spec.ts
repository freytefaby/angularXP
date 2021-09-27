import { TestBed } from '@angular/core/testing';

import { Api.ServerService } from './api.server.service';

describe('Api.ServerService', () => {
  let service: Api.ServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Api.ServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
