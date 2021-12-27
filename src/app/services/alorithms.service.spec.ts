import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AlgorithmsService } from './algorithms.service';

describe('AlorithmsService', () => {
  let service: AlgorithmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(AlgorithmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
});
