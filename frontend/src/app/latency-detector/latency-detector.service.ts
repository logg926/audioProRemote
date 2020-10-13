import { Injectable } from '@angular/core';
import { Metronome } from '../looper/looperhost-component/looper-host.service';
import { Correlator } from '../looper/looperclient-component/correlator';

@Injectable({
  providedIn: 'root',
})
export class LatencyDetectorService {
  constructor() {
    this.test = false;
  }

  test;
  clickBufferDuration;
  sampleRate;
  audioContext;
  async start() {
    var metronome, clickBuffer;
    var inputNode, mediaStream;

    this.sampleRate = 44100 * 1;
    // document.getElementById("sampleRate").disabled = true;
    console.log('Sample rate: %.0f Hz.', this.sampleRate);

    // document.getElementById("startButton").disabled = true;

    console.log('Creating audio context.');
    this.audioContext = new AudioContext({ sampleRate: this.sampleRate });

    // metronome and input node
    clickBuffer = await this.loadAudioBuffer('assets/snd/Closed_Hat.wav');
    this.clickBufferDuration = clickBuffer.duration;
    console.log(
      'click buffer duration: %.1f ms.',
      1000 * this.clickBufferDuration
    );

    if (this.test) {
      console.log('Working in simulation mode.');
      inputNode = new DelayNode(this.audioContext, {
        delayTime: 12345 / this.sampleRate,
      });
      inputNode.connect(this.audioContext.destination); // for monitoring

      metronome = new Metronome(this.audioContext, inputNode, 60, clickBuffer);
    } else {
      console.log('Working actual mode.');

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          channelCount: 1,
        },
      });
      inputNode = new MediaStreamAudioSourceNode(this.audioContext, {
        mediaStream,
      });

      metronome = new Metronome(
        this.audioContext,
        this.audioContext.destination,
        60,
        clickBuffer
      );
    }

    metronome.start(-1);

    console.log('Creating correlator');
    new Correlator(
      this.audioContext,
      inputNode,
      clickBuffer,
      (latency) => {
        console.log(
          'Latency: %.2f ms = %.0f samples',
          1000 * latency,
          Math.round(latency * this.sampleRate)
        );
        return;
      },
      this.sampleRate
    );

    console.log('running...');
  }

  updateOutput(latency) {
    console.log(
      'Latency: %.2f ms = %.0f samples',
      1000 * latency,
      Math.round(latency * this.sampleRate)
    );

    // document.getElementById('outputSpan').innerHTML =
    //   Math.round(1000 * latency) + ' ms';
  }

  async loadAudioBuffer(url) {
    var response, audioData, buffer;

    console.log('Loading audio data from %s.', url);
    response = await fetch(url);
    audioData = await response.arrayBuffer();
    buffer = await this.audioContext.decodeAudioData(audioData);
    console.log('Loaded audio data from %s.', url);
    return buffer;
  }
}
