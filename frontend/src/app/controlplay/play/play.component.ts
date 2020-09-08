import { Component, OnInit } from '@angular/core';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    var sound = new Howl({
      src: ['assets/sound.mp3'],
    });

    sound.play();
  }
}
