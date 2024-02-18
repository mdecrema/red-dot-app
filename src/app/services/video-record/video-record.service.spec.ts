import { TestBed } from '@angular/core/testing';

import { VideoRecordService } from './video-record.service';

describe('VideoRecordService', () => {
  let service: VideoRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
