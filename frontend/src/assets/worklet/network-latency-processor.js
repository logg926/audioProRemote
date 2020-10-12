
class WhiteNoiseProcessor extends AudioWorkletProcessor {
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process
  process(inputs, outputs, parameters) {
    var array, i, networkLatency, bufferSize, bufferDuration;
    var startSecond, endSecond, boundarySample, currentPlaybackTime;
    var playbackTimeAdjustment;
  
    array          = inputs.getChannelData(0);
    bufferSize     = inputs.length;
    bufferDuration = inputs.duration;
    startSecond    = Math.floor(event.playbackTime);
    endSecond      = Math.floor(event.playbackTime + bufferDuration);
  
    if (!max) max = argmax = -1;
  
    // Dirty trick
    currentPlaybackTime = Math.round(event.playbackTime*sampleRate) % 16384;
    if (!initialPlaybackTime) initialPlaybackTime = currentPlaybackTime;
    playbackTimeAdjustment = (currentPlaybackTime - initialPlaybackTime) % 16384;
  
    if (startSecond == endSecond) // Buffer contained within one second
    {
      for (i = 0; i < bufferSize; i++) if (array[i] > max)
      {
        argmax = frac(event.playbackTime + i/sampleRate);
        max    = array[i];
      }
    }
    else // Buffer spans two seconds
    {
      // Process part of buffer in start second
      boundarySample = Math.round((endSecond - event.playbackTime)*sampleRate);
  
      for (i = 0; i < boundarySample; i++) if (array[i] > max)
      {
        argmax = frac(event.playbackTime + i/sampleRate);
        max = array[i];
      }
  
      // Perform calculation
      networkLatency = frac(argmax - clickBufferDuration - bufferDuration
        - (playbackTimeAdjustment - 1)/sampleRate);
      if (networkLatency > 16384/sampleRate) networkLatency -= 16384/sampleRate;
  
      callBackFunction(networkLatency);
  
      // Process part of buffer in end second
      max = argmax = -1;
      for (i = boundarySample; i < bufferSize; i++) if (array[i] > max)
      {
        argmax = frac(event.playbackTime + i/sampleRate);
        max = array[i];
      }
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpEncodingParameters

  //https://tools.ietf.org/id/draft-ietf-mmusic-msid-14.xml

  // WebRTC: Relationship between Channels, Tracks & Streams vis-a-vis RTP SSRC and RTP Sessions
  // https://stackoverflow.com/questions/53673672/webrtc-relationship-between-channels-tracks-streams-vis-a-vis-rtp-ssrc-and-r

  // packet guide:
  // https://learning.oreilly.com/library/view/packet-guide-to/9781449339661/ch04.html
  // " While there are several fields in an RTP packet, the protocol has two main focal points: payload identification and sequencing."

  // capture with blob :
  // https://developer.mozilla.org/en-US/docs/Web/API/BlobEvent/timecode ? may be not

  // See Media Capture and Streams API (Media Stream)Capabilities, constraints, and settings: ******important look at latency
  // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints

  // One way to apply latency:
  // https://w3c.github.io/mediacapture-main/#def-constraint-latency
  // https://w3c.github.io/mediacapture-main/#mediastreamtrack
  // https://github.com/w3c/webrtc-pc/issues/2109

  // Intet to Ship: RTCRtpReceiver playoutDelayHint property
  // https://groups.google.com/a/chromium.org/g/blink-dev/c/4W4orKqA3Rs
  // https://www.chromestatus.com/feature/5685279400656896
}

registerProcessor("white-noise-processor", WhiteNoiseProcessor);
