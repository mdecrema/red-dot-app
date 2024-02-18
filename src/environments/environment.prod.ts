export const environment = {
  production: true,
  apiUri: 'http://localhost:3000/api/v1/',
  webSocketUrl: 'ws://localhost:3000',
  wsProtocol: 'Bearer',
  RTCPeerConfiguration: {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302'
      }
    ]
  }
};
