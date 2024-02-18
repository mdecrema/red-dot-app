export const enum RECORDING_STATE {
  NONE = 'NONE',
  RECORDING = 'RECORDING',
  RECORDED = 'RECORDED',
}

export interface EventHandlers {
  onDataChannelClosed: () => void;
  onDataChannelOpened: (dataChannel: RTCDataChannel) => void;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onMessageReceived: (message: string) => void;
  onRemoteStreamTrack: (track: MediaStreamTrack) => void;
}

export const enum CLIENT_TYPE {
  MASTER = 'MASTER',
  SLAVE = 'SLAVE'
}
