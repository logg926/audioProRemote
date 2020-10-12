import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LooperHostService {
  constructor() {}
  'use strict';
  // import {signalingServerUrl, stunServerUrl} from "./constants.js";
  // import "https://webrtc.github.io/adapter/adapter-latest.js"

  signalingChannel;
  ownId; // for Websocket
  connection = []; // For RTC
  audioContext;
  clientOutputNode;
  gainNode;
  delayNode;
  channelMergerNode;
  sampleRate;
  loopGain; // for Web Audio API

  // document.addEventListener("DOMContentLoaded", initDocument);

  // function initDocument()
  // {
  //   // Adding event handlers to DOM.
  //   document.getElementById("startServerButton").onclick = startServer;

  //   // Creating this.connection to signaling server.
  //   this.signalingChannel = new WebSocket(signalingServerUrl)
  //   this.signalingChannel.onmessage = receiveMessage;
  //   this.signalingChannel.onopen = () =>
  //     document.getElementById("startServerButton").disabled = false;
  // }

  async startServer() {
    var metronome, loopLength, loopBeats, tempo, metronomeGain;

    // Update UI
    // document.getElementById("sampleRate")       .disabled = true;
    // document.getElementById("loopBeats")        .disabled = true;
    // document.getElementById("tempo")            .disabled = true;
    // document.getElementById("loopGain")         .disabled = true;
    // document.getElementById("metronomeGain")    .disabled = true;
    // document.getElementById("startServerButton").disabled = true;

    // Get user input
    this.sampleRate = 44100;
    this.loopGain = 0.9;
    metronomeGain = 0.5;
    tempo = 120;
    loopBeats = 4;

    // Adjust loop length and tempo according to the Web Audio API specification:
    // "If this.delayNode is part of a cycle, then the value of the delayTime
    // attribute is clamped to a minimum of one render quantum."  We do this
    // explicitly here so we can sync the metronome.
    loopLength = (60 / tempo) * loopBeats;
    loopLength =
      (Math.round((loopLength * this.sampleRate) / 128) * 128) /
      this.sampleRate;
    tempo = (60 / loopLength) * loopBeats;
    console.log('Loop lengh is %.5f s, tempos is %.1f bpm.', loopLength, tempo);
    console.log('Creating Web Audio.');
    this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
    this.gainNode = new GainNode(this.audioContext, { gain: this.loopGain });
    this.delayNode = new DelayNode(this.audioContext, {
      delayTime: loopLength,
      maxDelayTime: loopLength,
    });
    this.channelMergerNode = new ChannelMergerNode(this.audioContext, {
      numberOfInputs: 2,
    });
    this.clientOutputNode = new MediaStreamAudioDestinationNode(
      this.audioContext
    );

    this.gainNode.connect(this.delayNode);
    this.delayNode.connect(this.gainNode);
    this.gainNode.connect(this.channelMergerNode, 0, 0);
    this.channelMergerNode.connect(this.clientOutputNode);

    /*
CLIENT           |                                  A
-----------------+----------------------------------+-------------------------
SERVER           V                                  |
          clientInputNode(s)*                this.clientOutputNode(s)
                 |                                  A
                 V                                  |
        channelSplitterNode(s)* -----1-----> this.channelMergerNode(s)
                 |                                  |
                 V                                  |
           clientGainNode(s)*                       |
                 |                                  |
                 +-----0------> this.gainNode -----0-----+
                                 |    A             |
                                 V    |             |
                                this.delayNode        metronome

                                                  *created on demand
*/

    const clickBuffer = await this.loadAudioBuffer('assets/snd/Closed_Hat.wav');
    metronome = new Metronome(
      this.audioContext,
      this.channelMergerNode,
      tempo,
      clickBuffer,
      0,
      metronomeGain
    );
    metronome.start();

    console.log('Waiting for offers.');
    return this.clientOutputNode.stream;
  }

  // function receiveMessage(message)
  // {
  //   var data;

  //   data = JSON.parse(message.data);

  //   if (data.id)           receiveIdMessage(data);
  //   if (data.offer)        receiveOfferMessage(data);
  //   if (data.iceCandidate) receiveIceCandidateMessage(data);
  // }

  // function receiveIdMessage(data)
  // {
  //   this.ownId = data.id;
  //   console.log("Received own ID: %d.", this.ownId);
  //   document.getElementById("sessionId").innerHTML = this.ownId;
  // }

  // async function receiveOfferMessage(data)
  // {
  //   var description, clientId;

  //   clientId = data.from;

  //   console.log("Received offer %o from %s.", data.offer, clientId)

  //   this.connection[clientId] = new RTCPeerthis.connection({iceServers: [{urls: stunServerUrl}]});

  //   this.connection[clientId].onicecandidate = function (event)
  //                                         {
  //                                           if (event.candidate)
  //                                           {
  //                                             console.log("Sending ICE candidate %o to %s", event.candidate, clientId);
  //                                             signal({iceCandidate: event.candidate, to: clientId});
  //                                           }
  //                                         };

  //   this.connection[clientId].ontrack = gotRemoteStream;

  //   this.connection[clientId].onthis.connectionstatechange = function ()
  //                                                  {
  //                                                    console.log("State of this.connection with %s: %s.",
  //                                                      clientId,
  //                                                      this.connection[clientId].this.connectionState);
  //                                                  }

  //   // Sending output to client
  //   this.connection[clientId].addTrack(this.clientOutputNode.stream.getAudioTracks()[0],
  //                                 this.clientOutputNode.stream);
  //   await this.connection[clientId].setRemoteDescription(data.offer);
  //   description = await this.connection[clientId].createAnswer();
  //   description.sdp = description.sdp.replace("minptime=10",
  //     "minptime=10;stereo=1;sprop-stereo=1"); // For Chrome, see
  //     // https://bugs.chromium.org/p/webrtc/issues/detail?id=8133#c25
  //   console.log("Answer SDP:\n%s", description.sdp)
  //   await this.connection[clientId].setLocalDescription(description);
  //   signal({answer: description, to: clientId});
  // }

  // function receiveIceCandidateMessage(data)
  // {
  //   const clientId = data.from;
  //   console.log("Received ICE candidate %o from %s.", data.iceCandidate, clientId);
  //   this.connection[clientId].addIceCandidate(data.iceCandidate);
  // }

  //entry point ontrack
  gotRemoteStream(mediaStream) {
    console.log('Got remote media stream.');

    // const mediaStream = event.streams[0];
    //const mediaStreamTrack = event.track;

    // Workaround for Chrome from https://stackoverflow.com/a/54781147
    new Audio().srcObject = mediaStream;

    const clientInputNode = new MediaStreamAudioSourceNode(this.audioContext, {
      mediaStream: mediaStream,
    });
    const channelSplitterNode = new ChannelSplitterNode(this.audioContext, {
      numberOfOutputs: 2,
    });
    const clientGainNode = new GainNode(this.audioContext, { gain: 0 });

    clientInputNode.connect(channelSplitterNode);
    channelSplitterNode.connect(this.channelMergerNode, 1, 1);
    channelSplitterNode.connect(clientGainNode, 0);
    clientGainNode.connect(this.gainNode);

    clientGainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 0.5);
    clientGainNode.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + 1
    );
    // This is to get rid of the initial "click" when new clients connect.
    // New clients will be silenced for 0.5 seconds, then brought to full volume
    // for another 0.5 seconds. Does not really work. :-(
  }

  // function signal(message)
  // {
  //   message.from = this.ownId;
  //   this.signalingChannel.send(JSON.stringify(message));
  // }

  async loadAudioBuffer(url) {
    console.log('Loading audio data from %s.', url);

    const response = await fetch(url);
    const audioData = await response.arrayBuffer();
    const buffer = await this.audioContext.decodeAudioData(audioData);

    return buffer;
  }
}

export class Metronome {
  audioContext;
  outputNode;
  tempo;
  buffer;
  outputNodeInput;
  period;
  gain;
  constructor(
    audioContext,
    outputNode,
    tempo,
    buffer,
    outputNodeInput = 0,
    gain = 1.0
  ) {
    this.audioContext = audioContext;
    this.outputNode = outputNode;
    this.period = 60 / tempo;
    this.buffer = buffer;
    this.outputNodeInput = outputNodeInput;
    this.gain = gain;
  }

  playClick(t = 0) {
    var node;
    var gainNode;

    node = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.buffer,
    });
    gainNode = new GainNode(this.audioContext, { gain: this.gain });
    node.connect(gainNode);
    gainNode.connect(this.outputNode, 0, this.outputNodeInput);
    node.start(t);
  }

  // Use when =  0 to start playback immediately.
  // Use when = -1 to start playback as soon as possible but in sync with
  //               currentTime.
  start(when = 0) {
    var t, now;

    now = this.audioContext.currentTime;

    if (when == 0) when = now;
    if (when == -1) when = Math.ceil(now / this.period) * this.period;

    for (t = when; t < now + 2; t += this.period) this.playClick(t);

    setTimeout(() => this.start(t), 1000);
  }
}
