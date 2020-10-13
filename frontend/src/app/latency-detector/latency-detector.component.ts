import { Component, OnInit } from '@angular/core';

import { LatencyDetectorService } from './latency-detector.service';
@Component({
  selector: 'app-latency-detector',
  templateUrl: './latency-detector.component.html',
  styleUrls: ['./latency-detector.component.css'],
})
export class LatencyDetectorComponent implements OnInit {
  constructor(private latencyDetectorService: LatencyDetectorService) {}

  ngOnInit(): void {
    this.latencyDetectorService.start();
  }
}
