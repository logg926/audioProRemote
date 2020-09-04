import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyWebCamService } from '../mywebcam.service';
import { environment } from 'src/environments/environment';
import { VonageVideoAPI } from '../vonageVideoAPI.service';
import { log } from '../../Helper/Helper';

@Component({
  selector: 'app-sender-component',
  templateUrl: './senderVideo.component.html',
  styleUrls: ['./senderVideo.component.css'],
})
export class SenderComponent implements OnInit {
  constructor(private vonageVideoAPI: VonageVideoAPI) {}
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  ngOnInit(): void {
    console.log('sender init session');
    this.vonageVideoAPI.senderInitializeSession('publisher').subscribe(log);
  }

  ngOnDestroy() {}
}
