import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyWebCamService } from '../../video/mywebcam.service';
import { VonageVideoAPI } from '../../video/vonageVideoAPI.service';
import { log, err } from '../../Helper/Helper';
import { LooperClientService } from './looper-client.service';
@Component({
  selector: 'app-looperclient-component',
  templateUrl: './looperclient.component.html',
  styleUrls: ['./looperclient.component.css'],
})
export class LooperclientComponent implements OnInit {
  constructor(
    private vonageVideoAPI: VonageVideoAPI,
    private looperClientService: LooperClientService
  ) {}
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  videoStream: MediaStream;
  @ViewChild('subscriber') subscriber: ElementRef;
  videoElementCreated = (element): void => {
    try {
      this.subscriber.nativeElement.appendChild(element);
      this.videoStream = element.captureStream();
      this.looperClientService.gotRemoteStream(this.videoStream);
    } catch (e) {
      err(e);
    }
  };

  ngOnInit(): void {
    console.log('sender init session');
    // this.vonageVideoAPI.clientInitializeSession(MEDIASTREAM, 'publisher').subscribe(log);
    this.looperClientService.startStream((a, b, c) => {
      this.vonageVideoAPI.clientInitializeSession(a, b, c).subscribe();
    }, this.videoElementCreated);
  }
  //if have track this.looperClientService.gotRemoteStream
  ngOnDestroy() {}
}
