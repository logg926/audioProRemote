import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SyncService } from 'src/app/sync/sync.service';
import { VonageVideoAPI } from '../video/vonageVideoAPI.service';
import { log, err } from '../Helper/Helper';
@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css'],
})
export class SyncComponent implements OnInit {
  constructor(
    private syncService: SyncService,
    private vonageVideoAPI: VonageVideoAPI
  ) {}

  audiosrc: string;
  @ViewChild('player') audioplayer: ElementRef;

  async ngOnInit(): Promise<void> {
    // get user stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const context = new AudioContext();
    // source node
    const sourceNode = context.createMediaStreamSource(stream);

    // scriptNode
    const scriptNode = context.createScriptProcessor(1024, 1, 1);

    // source node process
    scriptNode.onaudioprocess = function (
      audioProcessingEvent: AudioProcessingEvent
    ) {
      const inputBuffer = audioProcessingEvent.inputBuffer;

      // The output buffer contains the samples that will be modified and played
      const outputBuffer = audioProcessingEvent.outputBuffer;
      // log('hi');
      for (
        let channel = 0;
        channel < outputBuffer.numberOfChannels;
        channel++
      ) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        for (let sample = 0; sample < inputBuffer.length; sample++) {
          outputData[sample] = inputData[sample];
        }
      }
    };

    // connect sourcenode with script node
    sourceNode.connect(scriptNode);

    // test
    // var oscillator = context.createOscillator();
    // oscillator.type = 'square';
    // oscillator.frequency.setValueAtTime(440, context.currentTime); // value in hertz

    const mediaStreamNode = context.createMediaStreamDestination();
    // connect turn script node to stream node with script node
    scriptNode.connect(mediaStreamNode);

    // test
    // oscillator.connect(mediaStreamNode);
    // oscillator.start();

    //play in this window
    // scriptNode.connect(context.destination);

    // now mediaStreamNode.stream is an mediastream
    this.vonageVideoAPI.sendAudio(mediaStreamNode.stream).subscribe(log, err);
  }
}
