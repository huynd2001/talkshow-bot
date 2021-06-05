import { TestBed } from '@angular/core/testing';

import { DiscordMessService } from './discord-mess.service';

describe('DiscordMessService', () => {
  let service: DiscordMessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscordMessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
