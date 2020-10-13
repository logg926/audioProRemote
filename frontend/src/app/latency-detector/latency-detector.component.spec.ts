import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatencyDetectorComponent } from './latency-detector.component';

describe('LatencyDetectorComponent', () => {
  let component: LatencyDetectorComponent;
  let fixture: ComponentFixture<LatencyDetectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatencyDetectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatencyDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
