import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyWebCamService } from '../mywebcam.service';
import { Socket } from 'ngx-socket-io';
import { Signaling } from 'src/app/model/signaling';
import { SocketEvent, Constraints } from '../../Constants/socket';

@Component({
  selector: 'app-sender-component',
  templateUrl: './sender-component.component.html',
  styleUrls: ['./sender-component.component.css'],
})
export class SenderComponentComponent implements OnInit {
  constructor(private sendingService: MyWebCamService, private socket: Socket) {
    this.rtcPeerConn = null;
  }

  videoStream: MediaStream;

  rtcPeerConn: webkitRTCPeerConnection;
  subscription = this.sendingService.myWebCam$.subscribe((val) => {
    this.videoStream = val;
    this.videoplayer.nativeElement.srcObject = val;
    this.videoplayer.nativeElement.play();
  });
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  ngOnInit(): void {
    this.rtcPeerConn = new webkitRTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });
    this.socket
      .fromEvent('signaling_answer_message')
      .subscribe(async (description) => {
        console.log('setRemoteDescription');
        this.rtcPeerConn.setRemoteDescription(description);

        // tracks.forEach(async (track) => {
        // });
      });
    this.rtcPeerConn.onicecandidate = (evt) => {
      if (evt.candidate) {
        this.rtcPeerConn.addIceCandidate(new RTCIceCandidate(evt.candidate));
        console.log('Local ICE candidate: \n' + evt.candidate.candidate);
      }
    };

    // const tracks = this.videoStream.getVideoTracks();
    // console.log('Created local peer connection object localPeerConnection');
    // tracks[0].applyConstraints(Constraints).then(() => {
    //   this.rtcPeerConn.addTrack(tracks[0]);
    // });
  }

  async startSignaling() {
    (this.rtcPeerConn as any).addStream(this.videoStream);
    this.rtcPeerConn
      .createOffer()
      .then((desc: RTCSessionDescriptionInit) => {
        return this.rtcPeerConn.setLocalDescription(desc);
      })
      .then(() => {
        console.log('send local describtor');
        this.socket.emit(SocketEvent.startSignaling, {
          type: 'SDP',
          message: { sdp: this.rtcPeerConn.localDescription },
        });
      });

    // this.rtcPeerConn.onnegotiationneeded = () => {
    //   this.rtcPeerConn
    //     .createOffer()
    //     .then((desc: RTCSessionDescriptionInit) => {
    //       return this.rtcPeerConn.setLocalDescription(desc);
    //     })
    //     .then(() => {
    //       console.log('send local describtor');
    //       this.socket.emit(SocketEvent.startSignaling, {
    //         type: 'SDP',
    //         message: { sdp: this.rtcPeerConn.localDescription },
    //       });
    //     });
    // };
  }

  async startStreaming() {
    (this.rtcPeerConn as any).addStream(this.videoStream);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
