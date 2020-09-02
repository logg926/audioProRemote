export const SocketEvent = {
  signalingMessage: 'signaling_message',
  startSignaling: 'signaling',
  signalAnswer: 'signaling_answer_message',
};

export const Constraints = {
  width: { min: 640, ideal: 1280 },
  height: { min: 480, ideal: 720 },
  advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
};
