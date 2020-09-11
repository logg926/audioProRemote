// white-noise-processor.js
class WhiteNoiseProcessor extends AudioWorkletProcessor {
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
}

registerProcessor("white-noise-processor", WhiteNoiseProcessor);
