/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { VonageVideoAPI } from '../vonageVideoAPI.service';
import { Socket } from 'ngx-socket-io';

import { SocketEvent } from '../../Constants/socket';
import { environment } from 'src/environments/environment';
import { log } from '../../Helper/Helper';

type recorderAndChunks = {
  mediaRecorder: MediaRecorder;
  recordedChunks: any[];
};

@Component({
  selector: 'app-reciever-component',
  templateUrl: './recieverVideo.component.html',
  styleUrls: ['./recieverVideo.component.css'],
})
export class RecieverComponent implements OnInit {
  rtcPeerConn: webkitRTCPeerConnection;

  @ViewChild('videoPlayer3') videoplayer: ElementRef;

  videoStream: MediaStream;
  constructor(
    private vonageVideoAPI: VonageVideoAPI // private socket: Socket
  ) {
    this.recorders = [];
    this.recordedChunks = [];
  }
  recorders: recorderAndChunks[];

  @ViewChild('subscriber') subscriber: ElementRef;

  recordedChunks: any[];

  recordMediaStream(stream: MediaStream) {
    log(stream);
    const options: MediaRecorderOptions = {
      mimeType: 'video/webm; codecs=vp9',
    };
    // const mediaRecorder = new MediaRecorder(stream, options);
    // const recordedChunks = [];
    // this.recorders.push({ mediaRecorder, recordedChunks });
    // mediaRecorder.ondataavailable = (evt) => {
    //   console.log('data-available');
    //   if (evt.data.size > 0) {
    //     recordedChunks.push(evt.data);
    //     console.log(recordedChunks);
    //     download(recordedChunks);
    //   } else {
    //     console.log('no data avaliable');
    //   }
    // };
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.vonageVideoAPI
      .recieverInitializeSession(
        this.recordMediaStream,
        this.subscriber.nativeElement
      )
      .subscribe(log);
  }
}

function download(recordedChunks) {
  var blob = new Blob(recordedChunks, {
    type: 'video/webm',
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  // a.style = "display: none";
  a.href = url;
  a.download = 'test.webm';
  a.click();
  window.URL.revokeObjectURL(url);
}
