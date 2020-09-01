import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyWebCamService } from '../mywebcam.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-sender-component',
  templateUrl: './sender-component.component.html',
  styleUrls: ['./sender-component.component.css'],
})
export class SenderComponentComponent implements OnInit {
  constructor(
    private sendingService: MyWebCamService,
    private socket: Socket
  ) {}

  videoStream: MediaStream;
  subscription = this.sendingService.myWebCam$.subscribe((val) => {
    this.videoStream = val;
    this.videoplayer.nativeElement.srcObject = val;
    this.toggleVideo();
  });
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  toggleVideo(): void {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {}

  startStreaming(): void {
    console.log('startStreaming');
    this.socket.emit('signaling', 'hi');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
