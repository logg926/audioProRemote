import { Component, OnInit } from '@angular/core';
import { Howl, Howler } from 'howler';
import { err, log } from 'src/app/Helper/Helper';

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

    const audioContext = Howler.ctx;
    const synthDelay = audioContext.createDelay(7.0);

    log(audioContext.currentTime)

    Howler.masterGain.disconnect()
    synthDelay.disconnect()
    Howler.masterGain.connect(synthDelay);
    log('synthDelay connect')
    synthDelay.connect(audioContext.destination);
    log('destination connect')


  
    setTimeout(() => {
      sound.play();
      setTimeout(() => {
        sound.stop();
      }, 5000);
    }, 5000);



  }
/*
  mediaRecorder(audioContext,sound) {
    try{
    Howler.mute(false);

    const mediaDest: MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

    Howler.masterGain.disconnect();
    // Master Gain -> mediaDest
    Howler.masterGain.connect(mediaDest);

    const audioChunks = [];
    const mediaRecorder = new MediaRecorder(mediaDest.stream, {
      mimeType: 'audio/webm',
    });

    mediaRecorder.onstart = (event) => {
      console.log('Started recording Howl output...');
    };
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size) {
        audioChunks.push(e.data);
      }
    };
    mediaRecorder.onstop = (event) => {
      console.log('Completed Recording', audioChunks); // why is this returning empty?
      // let buffer = new Blob(chunks)
      // let audioPlayer = document.createElement("AUDIO")
      // audioPlayer.src = window.URL.createObjectURL(buffer)
      // audioPlayer.play()
    };

    sound.play();
    log('play func')
    mediaRecorder.start();
    log('play and start rec')

    setTimeout(() => {
      mediaRecorder.stop();
      sound.stop();
    }, 1000);

    log('timeout set')
  }
  catch(e){
    err(e)
  }
  }
  */
}
