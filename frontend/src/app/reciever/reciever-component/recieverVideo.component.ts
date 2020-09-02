import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RecievingService } from '../recieving.service';
import { Socket } from 'ngx-socket-io';

import { SocketEvent } from '../../Constants/socket';
import { Signaling } from 'src/app/model/signaling';
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
    private recievingService: RecievingService,
    private socket: Socket
  ) {
    this.rtcPeerConn = null;
  }

  ngOnInit(): void {
    this.rtcPeerConn = new webkitRTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });
    this.rtcPeerConn.onicecandidate = (evt) => {
      if (evt.candidate) {
        this.rtcPeerConn.addIceCandidate(new RTCIceCandidate(evt.candidate));
        console.log('Local ICE candidate: \n' + evt.candidate.candidate);
      }
    };
    (this.rtcPeerConn as any).onaddstream = (evt) => {
      this.videoplayer.nativeElement.srcObject = evt.stream;
    };

    this.socket
      .fromEvent<any>(SocketEvent.signalingMessage)
      .subscribe(async (val) => {
        console.log(val);
        await this.rtcPeerConn.setRemoteDescription(val.message.sdp);
        this.rtcPeerConn.createAnswer().then((desc) => {
          this.rtcPeerConn.setLocalDescription(desc);

          console.log('Answer from remotePeerConnection: \n' + desc.sdp);
          this.socket.emit('signaling_answer', desc);
        });
      });
  }
}
