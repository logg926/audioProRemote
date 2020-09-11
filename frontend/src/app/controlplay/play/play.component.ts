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
    Howler.mute(false);
    let mediaDest = Howler.ctx.createMediaStreamDestination();

    Howler.masterGain.disconnect();
    Howler.masterGain.connect(mediaDest);

    let audioChunks = [];

    let mediaRecorder = new MediaRecorder(mediaDest.stream, {
      mimeType: 'audio/webm',
    });
    mediaRecorder.onstart = (event) => {
      console.log('Started recording Howl output...');
    };
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size) audioChunks.push(e.data);
    };
    mediaRecorder.onstop = (event) => {
      console.log('Completed Recording', audioChunks); // why is this returning empty?
      // let buffer = new Blob(chunks)
      // let audioPlayer = document.createElement("AUDIO")
      // audioPlayer.src = window.URL.createObjectURL(buffer)
      // audioPlayer.play()
    };

    var sound = new Howl({
      src: ['assets/sound.mp3'],
    });

    sound.play();
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      sound.stop();
    }, 5000);
  }
}
