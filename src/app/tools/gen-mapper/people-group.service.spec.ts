import { TestBed } from '@angular/core/testing';

import { PeopleGroupService } from './people-group.service';

describe('PeopleGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopleGroupService = TestBed.get(PeopleGroupService);
    expect(service).toBeTruthy();
  });
});
