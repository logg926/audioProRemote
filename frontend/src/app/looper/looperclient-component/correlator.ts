let sampleRate;
let clickBufferDuration;
let callBackFunction: (latency: number) => void;
export class Correlator {
  constructor(
    audioContext,
    inputNode,
    clickBuffer,
    callBack: (networkLatency: number) => void,
    sampleRateVar,
    inputNodeOutput = 0
  ) {
    console.log('Creating convolver node.');
    clickBufferDuration = clickBuffer.duration;
    sampleRate = sampleRateVar;
    const reverseBuffer = revertBuffer(audioContext, clickBuffer);
    const convolverNode = new ConvolverNode(audioContext, {
      buffer: reverseBuffer,
    });
    callBackFunction = callBack;
    inputNode.connect(convolverNode, inputNodeOutput);

    console.log('Creating script processor.');
    const scriptProcessor = audioContext.createScriptProcessor(16384, 1, 1);
    scriptProcessor.onaudioprocess = processAudio;
    convolverNode.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    // Need to connect script processor to destination, otherwise
    // onaudioprocess would not be fired in Chrome.  See
    // https://stackoverflow.com/q/27324608
  }
}
function revertBuffer(audioContext, buffer) {
  var i;

  const reverseBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );

  const array = new Float32Array(buffer.length);

  for (i = 0; i < buffer.numberOfChannels; i++) {
    buffer.copyFromChannel(array, i, 0);
    array.reverse();
    reverseBuffer.copyToChannel(array, i, 0);
  }

  return reverseBuffer;
}

function processAudio(event) {
  var array, i, networkLatency, bufferSize, bufferDuration;
  var startSecond, endSecond, boundarySample, currentPlaybackTime;
  var playbackTimeAdjustment;

  array = event.inputBuffer.getChannelData(0);
  bufferSize = event.inputBuffer.length;
  bufferDuration = event.inputBuffer.duration;
  startSecond = Math.floor(event.playbackTime);
  endSecond = Math.floor(event.playbackTime + bufferDuration);

  if (!this.max) this.max = this.argmax = -1;

  // Dirty trick
  currentPlaybackTime = Math.round(event.playbackTime * sampleRate) % 16384;
  if (!this.initialPlaybackTime) this.initialPlaybackTime = currentPlaybackTime;
  playbackTimeAdjustment =
    (currentPlaybackTime - this.initialPlaybackTime) % 16384;

  if (startSecond == endSecond) {
    // Buffer contained within one second
    for (i = 0; i < bufferSize; i++)
      if (array[i] > this.max) {
        this.argmax = frac(event.playbackTime + i / sampleRate);
        this.max = array[i];
      }
  } // Buffer spans two seconds
  else {
    // Process part of buffer in start second
    boundarySample = Math.round((endSecond - event.playbackTime) * sampleRate);

    for (i = 0; i < boundarySample; i++)
      if (array[i] > this.max) {
        this.argmax = frac(event.playbackTime + i / sampleRate);
        this.max = array[i];
      }

    // Perform calculation
    networkLatency = frac(
      this.argmax -
        clickBufferDuration -
        bufferDuration -
        (playbackTimeAdjustment - 1) / sampleRate
    );
    if (networkLatency > 16384 / sampleRate)
      networkLatency -= 16384 / sampleRate;

    // console.log(networkLatency);
    // console.log(typeof callBackFunction);
    callBackFunction(networkLatency);

    // Process part of buffer in end second
    this.max = this.argmax = -1;
    for (i = boundarySample; i < bufferSize; i++)
      if (array[i] > this.max) {
        this.argmax = frac(event.playbackTime + i / sampleRate);
        this.max = array[i];
      }
  }
}

function frac(x) {
  return x - Math.floor(x);
}
