import { Component, OnInit } from '@angular/core';
import { MediasoupService } from '../Services/mediasoup.service';
@Component({
  selector: 'app-video-call-page',
  templateUrl: './video-call-page.component.html',
  styleUrls: ['./video-call-page.component.css'],
})
export class VideoCallPageComponent implements OnInit {
  constructor(private mediasoupService: MediasoupService) {}

  ngOnInit(): void {}
}
