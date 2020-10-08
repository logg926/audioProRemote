import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MyWebCamService } from '../../video/mywebcam.service';
import { VonageVideoAPI } from '../../video/vonageVideoAPI.service';
import { log } from '../../Helper/Helper';

@Component({
  selector: 'app-looperclient-component',
  templateUrl: './looperclient.component.html',
  styleUrls: ['./looperclient.component.css'],
})
export class LooperclientComponent implements OnInit {
  constructor(private vonageVideoAPI: VonageVideoAPI) {}
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  ngOnInit(): void {
    console.log('sender init session');
    this.vonageVideoAPI.senderInitializeSession('publisher').subscribe(log);
  }

  ngOnDestroy() {}
}
