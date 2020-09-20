/// <reference types="@types/dom-mediacapture-record" />
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { VonageVideoAPI } from '../vonageVideoAPI.service';
import { Socket } from 'ngx-socket-io';

import { SocketEvent } from '../../Constants/socket';
import { environment } from 'src/environments/environment';
import { err, log } from '../../Helper/Helper';

type recorderAndChunks = {
  mediaRecorder: MediaRecorder;
  recordedChunks: any[];
};

@Component({
  selector: 'app-reciever-component',
  templateUrl: './recieverVideo.component.html',
  styleUrls: ['./recieverVideo.component.css'],
})
export class RecieverComponent implements OnInit  { // ngAfterViewChecked(), ngAfterContentChecked() to capture stram after <video change>
  rtcPeerConn: webkitRTCPeerConnection;

  //@ViewChild('videoPlayer3') videoplayer: ElementRef;

  @ViewChild('subscriber') subscriber: ElementRef;

  videoStream: MediaStream;

  constructor(
    private vonageVideoAPI: VonageVideoAPI // private socket: Socket
  ) {
    this.recorders = [];
    this.recordedChunks = [];
  }
  recorders: recorderAndChunks[];

  recordedChunks: any[];

  //TODO: main function for stream
  recordMediaStream(stream: MediaStream): void {
    log('stream ',stream);
    // const options: MediaRecorderOptions = {
    //   mimeType: 'video/webm; codecs=vp9',
    // };
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

  videoElementCreated = (element):void => {
    try{
      log('videoElementCreated')
      log('this:',this)
      this.videoStream = element.captureStream()
      log('videoStream',this.videoStream)
      log('videoElementCreated finished')
    }
    catch(e){
      err(e)
    }


    //this.subscriber.nativeElement.value = 'test';
  }

  ngOnInit(): void {
    try{
    log('ngOnInit')
    this.vonageVideoAPI
    .recieverInitializeSession(this.recordMediaStream, this.videoElementCreated, 'subscriber')
    .subscribe(log); 
    log('ngOnInit finished')
    }
    catch(e){
      err(e)
    }

  }

  //ngAfterViewChecked() {
    // viewChild is set after the view has been initialized
    //log('AfterViewInit');
    //if (this.subscriber.nativeElement){

    //}
  //}
}

// function download(recordedChunks) {
//   var blob = new Blob(recordedChunks, {
//     type: 'video/webm',
//   });
//   var url = URL.createObjectURL(blob);
//   var a = document.createElement('a');
//   document.body.appendChild(a);
//   // a.style = "display: none";
//   a.href = url;
//   a.download = 'test.webm';
//   a.click();
//   window.URL.revokeObjectURL(url);
// }
