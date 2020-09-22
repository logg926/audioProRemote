// incoming-processor.js
class IncomingProcessor extends AudioWorkletProcessor {
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = Math.random() * 2 - 1;
      }
    });
    return true;
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

registerProcessor("incoming-processor", IncomingProcessor);
