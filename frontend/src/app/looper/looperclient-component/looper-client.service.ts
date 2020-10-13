import { Injectable } from '@angular/core';

import { Metronome } from '../looperhost-component/looper-host.service';
import { Correlator } from './correlator';
@Injectable({
  providedIn: 'root',
})
export class LooperClientService {
  constructor() {}

  signalingChannel;
  ownId;
  sessionId; // for Websocket
  connection; // for RTC
  audioContext; // for Web Audio API
  clickBuffer; // click for latency detection
  delayNode;
  userLatency; // needs to be global to access from processAudio
  sampleRate;
  loopLength;
  recorder;

  // We start by associating the event handlers to the frontend.
  // function initDocument()
  // {
  //   // Adding event handlers to DOM
  //   document.getElementById("startButton").onclick = startStream;
  //   document.getElementById("stopButton").onclick = stopStream;

  //   // Creating connection to signaling server
  //   signalingChannel = new WebSocket(signalingServerUrl);
  //   signalingChannel.onmessage = receiveMessage;
  //   signalingChannel.onopen = () =>
  //     document.getElementById("startButton").disabled = false;
  // }

  /*                                               * created in gotRemoteStream

USER                        |                  A
----------------------------+------------------+------------------------------
CLIENT                      |                  |
                            V                  |
                     userInputNode        destination
                            |                  A
                            V                  |
                       delay Node              +---------> recordingNode*
                            |                  |
               1            V 0                | 0          1
metronome -----> channelMergerNode     channelSplitterNode* ----> correlator*
                            |                  A
                            V                  |
                    serverOutputNode    serverInputNode*
CLIENT                      |                  A
----------------------------+------------------+------------------------------
SERVER                      V                  |
*/

  async startStream(clientInitializeSession, videoElementCreated) {
    var userInputStream,
      description,
      userInputNode,
      serverOutputNode,
      channelMergerNode,
      metronome,
      tempo,
      loopBeats;

    // Disable UI

    // Get user input
    // sessionId   = document.getElementById("sessionId") .value;
    this.sampleRate = 44100;
    tempo = 120;
    this.userLatency = 40 / 1000;
    loopBeats = 4;

    // Calculate loop lenght
    this.loopLength = (60 / tempo) * loopBeats; // Theoretical loop lengh, but
    this.loopLength =
      (Math.round((this.loopLength * this.sampleRate) / 128) * 128) /
      this.sampleRate;
    tempo = (60 / this.loopLength) * loopBeats;
    // according to the Web Audio API specification, "If DelayNode is part of a
    // cycle, then the value of the delayTime attribute is clamped to a minimum
    // of one render quantum."  We do this explicitly here so we can sync the
    // metronome.
    console.log(
      'Loop lengh is %.5f s, tempos is %.1f bpm.',
      this.loopLength,
      tempo
    );

    // Getting user media
    userInputStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        channelCount: 1,
      },
    });

    // TODO: Assign handler to userInputStream.oninactive

    // Create Web Audio
    this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
    // this.audioContext.sampleRate = this.sampleRate;
    this.clickBuffer = await this.loadAudioBuffer('assets/snd/Closed_Hat.wav');

    userInputNode = new MediaStreamAudioSourceNode(this.audioContext, {
      mediaStream: userInputStream,
    });
    this.delayNode = new DelayNode(this.audioContext, {
      maxDelayTime: this.loopLength,
    });
    channelMergerNode = new ChannelMergerNode(this.audioContext, {
      numberOfInputs: 2,
    });
    serverOutputNode = new MediaStreamAudioDestinationNode(this.audioContext);
    metronome = new Metronome(
      this.audioContext,
      channelMergerNode,
      60,
      this.clickBuffer,
      1
    );

    userInputNode.connect(this.delayNode);
    this.delayNode.connect(channelMergerNode, 0, 0);
    channelMergerNode.connect(serverOutputNode);

    metronome.start(-1);
    try {
      clientInitializeSession(
        serverOutputNode.stream.getAudioTracks()[0],
        'publisher',
        videoElementCreated
      );
    } catch (err) {
      throw err;
    }
    // .getAudioTracks()[0]
    // Creating RTC connection
    // this.connection = new RTCPeerConnection({iceServers: [{urls: stunServerUrl}]});

    // this.connection.onicecandidate          = sendIceCandidate;
    // this.connection.ontrack                 = gotRemoteStream;

    // this.connection.onconnectionstatechange = reportConnectionState;

    // connection.addTrack(serverOutputNode.stream.getAudioTracks()[0],
    //                     serverOutputNode.stream);

    // Creating offer
    // description = await connection.createOffer({voiceActivityDetection: false});

    // Workaround for Chrome, see https://bugs.chromium.org/p/webrtc/issues/detail?id=8133#c25
    // description.sdp = description.sdp.replace("minptime=10",
    //                                           "minptime=10;stereo=1;sprop-stereo=1");

    // console.log("Offer SDP:\n%s", description.sdp)
    // await connection.setLocalDescription(description);
    // signal({offer: description, to:sessionId});
  }

  // function receiveMessage(event)
  // {
  //   const data = JSON.parse(event.data);

  //   if (data.id)           {console.log("Received own ID: %d.", data.id);                           ownId = data.id;                              }
  //   if (data.answer)       {console.log("Answer SDP:\n%s", data.answer.sdp);                        connection.setRemoteDescription(data.answer); }
  //   if (data.iceCandidate) {console.log("Received ICE candidate: %s", data.iceCandidate.candidate); connection.addIceCandidate(data.iceCandidate);}
  // }

  // function reportConnectionState()
  // {
  //   console.log("Connection state: %s.", connection.connectionState)
  // }

  // function sendIceCandidate(event)
  // {
  //   if (event.candidate)
  //   {
  //     console.log("Sending ICE candidate to signaling server: %s",
  //       event.candidate.candidate);
  //     signal({iceCandidate: event.candidate, to: sessionId});
  //   }
  // }

  gotRemoteStream(mediaStream) {
    var serverInputNode, channelSplitterNode;

    console.log('Got remote media stream.');

    // Workaround for Chrome from https://stackoverflow.com/a/54781147
    new Audio().srcObject = mediaStream;

    console.log('Creating server input node.');
    serverInputNode = new MediaStreamAudioSourceNode(this.audioContext, {
      mediaStream,
    });

    console.log('Creating channel splitter node.');
    channelSplitterNode = new ChannelSplitterNode(this.audioContext, {
      numberOfOutputs: 2,
    });
    serverInputNode.connect(channelSplitterNode);
    channelSplitterNode.connect(this.audioContext.destination, 0);

    console.log('Creating correlator');
    new Correlator(
      this.audioContext,
      channelSplitterNode,
      this.clickBuffer,
      this.updateDelayNode,
      this.sampleRate,
      1
    );

    console.log('Creating recorder');
    const recordingNode = new MediaStreamAudioDestinationNode(
      this.audioContext
    );
    channelSplitterNode.connect(recordingNode, 0);
    const downloadButton = document.getElementById('downloadButton');
    // this.recorder = new Recorder(recordingNode.stream, downloadButton, this.recorder);
    // this.recorder.start();

    // document.getElementById("stopButton").disabled = false;
  }

  updateDelayNode(networkLatency) {
    const totalLatency = this.userLatency + networkLatency;

    console.log(
      'Latency: %.2f ms (user) + %.2f ms (network) = %.2f ms.',
      1000 * this.userLatency,
      1000 * networkLatency,
      1000 * totalLatency
    );

    this.delayNode.delayTime.value = this.loopLength - totalLatency;
  }

  //  signal(message)
  // {
  //   message.from = this.ownId;
  //   this.signalingChannel.send(JSON.stringify(message));
  // }

  async loadAudioBuffer(url) {
    var response, audioData, buffer;

    console.log('Loading audio data from %s.', url);
    response = await fetch(url);
    audioData = await response.arrayBuffer();
    buffer = await this.audioContext.decodeAudioData(audioData);
    console.log('Loaded audio data from %s.', url);
    return buffer;
  }

  stopStream() {
    // document.getElementById("stopButton").disabled = true;
    console.log('Leaving the session');
    this.recorder.stop();
    this.connection.close();
  }
}

// class Recorder
// {
//   constructor(stream, downloadButton, recorder)
//   {
//     var chunks = [];
//     recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = function(event)
//     {
//       console.log("Pushing chunk.");
//       chunks.push(event.data);
//     }

//     recorder.onstop = function()
//     {
//       var blob;

//       console.log("Combining chunks.");

//       if(!chunks) {console.log("Chunks not initialized"); return;}
//       if(chunks.length == 0) {console.log("No chunks recorded"); return;}

//       blob = new Blob(chunks, {type: chunks[0].type});
//       downloadButton.href = URL.createObjectURL(blob);
//       downloadButton.download = "recording.oga";
//     }
//     return recorder
//   }

//   start()
//   {
//     this.recorder.start();
//   }

//   stop()
//   {
//     this.recorder.stop();
//   }
// }
