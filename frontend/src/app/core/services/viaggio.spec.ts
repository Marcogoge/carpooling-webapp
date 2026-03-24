import { TestBed } from '@angular/core/testing';

import { Viaggio } from './viaggio';

describe('Viaggio', () => {
  let service: Viaggio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Viaggio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
