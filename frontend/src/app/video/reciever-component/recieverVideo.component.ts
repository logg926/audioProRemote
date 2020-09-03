import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { VonageVideoAPI } from '../vonageVideoAPI.service';
import { Socket } from 'ngx-socket-io';

import { SocketEvent } from '../../Constants/socket';
import { Signaling } from 'src/app/model/signaling';
import { environment } from 'src/environments/environment';
import { log } from '../../Helper/Helper';

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
  ) {}

  ngOnInit(): void {
    this.vonageVideoAPI.recieverInitializeSession().subscribe(log);
  }
}
