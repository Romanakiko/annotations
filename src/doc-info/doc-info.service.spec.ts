import { TestBed } from '@angular/core/testing';

import { DocInfoService } from './doc-info.service';

describe('DocInfoService', () => {
  let service: DocInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
