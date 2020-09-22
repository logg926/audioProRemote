import { Injectable } from '@angular/core';

import { log } from '../Helper/Helper';
import { Howler } from 'howler';
@Injectable({
  providedIn: 'root',
})
export class AudioProcessingService {
  constructor() {}

  putInIncomingProcessingWorklet(stream: MediaStream): void {
    log('putInIncomingProcessingWorklet');

    const audioContext = Howler.ctx;
    const source = audioContext.createMediaStreamSource(stream);
    audioContext.audioWorklet
      .addModule('assets/worklet/incoming-processor.js')
      .then(
        () => {
          const whiteNoiseNode = new AudioWorkletNode(
            audioContext,
            'incoming-processor'
          );
          source.connect(whiteNoiseNode);
          // send to speaker
          // whiteNoiseNode.connect(audioContext.destination);
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
