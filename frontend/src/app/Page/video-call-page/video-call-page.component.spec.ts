import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallPageComponent } from './video-call-page.component';

describe('VideoCallPageComponent', () => {
  let component: VideoCallPageComponent;
  let fixture: ComponentFixture<VideoCallPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoCallPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoCallPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
