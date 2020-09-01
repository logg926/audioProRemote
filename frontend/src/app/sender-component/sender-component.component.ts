import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SendingService } from '../services/sending.service';

@Component({
  selector: 'app-sender-component',
  templateUrl: './sender-component.component.html',
  styleUrls: ['./sender-component.component.css'],
})
export class SenderComponentComponent implements OnInit {
  constructor(private sendingService: SendingService) {}

  subscription = this.sendingService.myWebCam$.subscribe((val) => {
    this.videoplayer.nativeElement.srcObject = val;
    this.toggleVideo();
  });
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  toggleVideo(): void {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {}

  startStreaming(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
