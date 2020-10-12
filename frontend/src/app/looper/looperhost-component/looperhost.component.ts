/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { err, log } from '../../Helper/Helper';
import { VonageVideoAPI } from '../../video/vonageVideoAPI.service';
import { LooperHostService } from './looper-host.service';
type recorderAndChunks = {
  mediaRecorder: MediaRecorder;
  recordedChunks: any[];
};

@Component({
  selector: 'app-looperhost-component',
  templateUrl: './looperhost.component.html',
  styleUrls: ['./looperhost.component.css'],
})
export class LooperhostComponent implements OnInit {
  rtcPeerConn: webkitRTCPeerConnection;

  // @ViewChild('videoPlayer3') videoplayer: ElementRef;

  @ViewChild('subscriber') subscriber: ElementRef;

  videoStream: MediaStream;

  constructor(
    private vonageVideoAPI: VonageVideoAPI,
    private looperHostService: LooperHostService
  ) {
    this.recorders = [];
    this.recordedChunks = [];
  }
  recorders: recorderAndChunks[];

  recordedChunks: any[];

  recordMediaStream(stream: MediaStream): void {
    log('stream ', stream);
  }

  videoElementCreated = (element): void => {
    try {
      this.subscriber.nativeElement.appendChild(element);
      this.videoStream = element.captureStream();
      console.log(this.videoStream);
      this.looperHostService.gotRemoteStream(this.videoStream);
    } catch (e) {
      err(e);
    }
  };

  async ngOnInit(): Promise<void> {
    const stream = await this.looperHostService.startServer();
    // signalingChannel = new WebSocket('ws://127.0.0.1');
    // signalingChannel.onmessage = receiveMessage;
    // signalingChannel.onopen = () =>
    //   (document.getElementById('startServerButton').disabled = false);
    try {
      log('ngOnInit');
      this.vonageVideoAPI
        .hostInitializeSession(this.videoElementCreated, 'subscriber', stream)
        .subscribe(() => {});
      log('ngOnInit finished');
    } catch (e) {
      err(e);
    }

    // this.connection[clientId].ontrack = this.looperHostService.gotRemoteStream;
  }
}
