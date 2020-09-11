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

    const audioContext = Howler.ctx;
    audioContext.audioWorklet
      .addModule('assets/worklet/white-noise-processor.js')
      .then(
        () => {
          const whiteNoiseNode = new AudioWorkletNode(
            audioContext,
            'white-noise-processor'
          );

          // send to speaker

          Howler.masterGain.connect(whiteNoiseNode);
          whiteNoiseNode.connect(audioContext.destination);
        },
        (err) => {
          console.error(err);
        }
      );

    this.mediaRecorder(audioContext, sound.play, sound.stop);
  }

  mediaRecorder(audioContext, playfn, stopfn) {
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

    playfn();
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      stopfn();
    }, 5000);
  }
}
