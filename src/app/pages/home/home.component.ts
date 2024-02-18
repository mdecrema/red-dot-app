import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventHandlers } from 'src/app/services/video-record/video-record.model';
import { VideoRecordService } from 'src/app/services/video-record/video-record.service';
import { WS_MESSAGE } from 'src/app/services/ws/ws.model';
import { WsService } from 'src/app/services/ws/ws.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
newMessage: string = ''
messageList: WS_MESSAGE[] = []

socketId: any;
masterClient: boolean = false

public peerConfigurations = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
public offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

eventHandlers!: EventHandlers

@ViewChild('local_video') localVideo!: ElementRef;
  @ViewChild('remote_video') remoteVideo!: ElementRef;

  private peerConnection!: RTCPeerConnection;

  private localStream!: MediaStream;

  mediaConstraints = {
    audio: true,
    video: {width: 400, height: 400}
  };
  
//   servers = {
//     iceServers:[
//         {
//             urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
//         }
//     ]
// }

  constructor(
    private webSocketService: WsService,
    private videoRecordService: VideoRecordService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // this.getLocalStream()
    // this.initialize(this.eventHandlers)
    this.peerConnection = new RTCPeerConnection(this.peerConfigurations)

    this.webSocketService.webSocketConnect()
    
    // this.webSocketService.listen('socketId').subscribe((socketId: any) => {
    //   console.log(socketId)
    //   this.socketId = socketId
    // })

    this.webSocketService.listen('connect').subscribe((message: any) => {
      console.log('successfully connected')
    })

    this.webSocketService.listen('room_users').subscribe((data: any) => {
      console.log('join >>> >>> >>> \n' + data)
      // this.initialize(this.eventHandlers)

      // this.callRequestReceived(message)
    })

    this.webSocketService.listen("getOffer").subscribe((sdp: any) => {
      console.log("get offer >>> >>> >>> \n" + sdp);
      this.createAnswer(sdp);
    });

    this.webSocketService.listen("getAnswer").subscribe((sdp: any) => {
      console.log("get answer >>> >>> >>>" + sdp);
      this.peerConnection.setRemoteDescription(sdp);
      // this.getLocalStream
    });

    this.webSocketService.listen("getCandidate").subscribe((candidate: any) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => {
          console.log("candidate add success");
          if (this.masterClient) {
            this.startSharing()
          }
        });
  });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("onicecandidate");
        this.webSocketService.emit("candidate", event.candidate);
      }
    };
    
    this.peerConnection.oniceconnectionstatechange = (event) => {
      console.log(event);
    };

    this.peerConnection.addEventListener('track', (ev) => {
      console.log("add remotetrack success");
      if (this.remoteVideo) {
        this.remoteVideo.nativeElement.srcObject = ev.streams[0];
      }
  });
  }

  // public call() {
  //   // this.createAndSetOffer(this.peerConnection)
  //   this.webSocketService.emit('join', 'newUSER')
  //   this.createOffer()
    
  // }

  public shareVideo(ev: any) {
    this.init(ev)
  }

  async init(event: any) {
        // this.webSocketService.emit('join', 'newUSER')
    // this.createOffer()
    console.log("render videos");
    try {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then(stream => {
                if (this.localVideo) {
                  this.gotLocalStream(stream)
                  // this.localVideo.nativeElement.srcObject = stream;
                }
                
                /*
                stream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, stream);
                });
                
                this.peerConnection.onicecandidate = e => {
                    if (e.candidate) {
                        console.log("onicecandidate");
                        this.webSocketService.emit("candidate", e.candidate);
                    }
                };
                */

                // this.peerConnection.oniceconnectionstatechange = e => {
                //     console.log(e);
                // };

                // this.peerConnection.ontrack = ev => {
                //     console.log("add remotetrack success");
                //     if (this.remoteVideo) {
                //       this.remoteVideo.nativeElement.srcObject = ev.streams[0];
                //     }
                // };

                // this.webSocketService.emit("join", {
                //     room: "1234",
                //     name: "skydoves@getstream.io",
                // });
            })
            .catch(error => {
                console.log(`getUserMedia error: ${error}`);
            });
    } catch (error) {
        console.log(error);
    }
}

public joinReq() {
  // this.webSocketService.emit('join-req', 'bla-bla-bla')
  this.webSocketService.emit('join', 'user-123')
}

public startSharing() {
  this.localStream.getTracks().forEach(track => {
    this.peerConnection.addTrack(track, this.localStream);
  });

  this.peerConnection.onicecandidate = e => {
    if (e.candidate) {
        console.log("onicecandidate");
        this.webSocketService.emit("candidate", e.candidate);
    }
  };
}

public setAsMaster() {
  this.masterClient = true
}

// }

// /**
//  * Step 2: caller sets localDescription
//  */
// private onCreateOfferSuccess(event: any) {
//   this.peerConnection.setLocalDescription(new RTCSessionDescription(event)).then(
//     () => {
//         /**Step 3: caller sends the description to the callee */
//         this.webSocketService.emit('newMessage', {desc: {
//           val: this.peerConnection.localDescription,
//           type: 'desc',
//           uid: 2
//         }});
//     },
//     // this.OnSetSessionDescriptionError.bind(this)
// );
// }

// private callRequestReceived(data: any) {

//   if (data.desc) {

//     const desc = new RTCSessionDescription(data.desc.val)

//     switch (desc.type) {

//       case 'offer':

//         this.setPeerConnection()
//         this.OnCallOffer(desc)
//         break;
    
//       case 'answer':

//         this.OnCallAnswer(data.desc.val);
//         break;

//         default:
//           break;
//     }

//   } else if (data.candidate) {

//     const candidate = new RTCIceCandidate(data.candidate.val);

//     this.peerConnection.addIceCandidate(candidate)
//       .catch(err => 
//           console.log(err)
//         );

//   }
// }

// OnCallOffer(descrip: any) {
//   /**Step 4: callee receives the offer sets remote description */
//   this.peerConnection.setRemoteDescription(descrip).then(
//       () => {
//           this.OnSetRemoteSuccess(this.peerConnection);
//       },
//       // this.OnSetSessionDescriptionError.bind(this)
//   );
// }

// OnSetRemoteSuccess(val: any) {
//   /**Step 5: callee creates answer */
//   this.peerConnection.createAnswer().then(
//       this.OnCreateAnswerSuccess.bind(this),
//       // this.OnCreateSessionDescriptionError.bind(this)
//   );
// }

// OnCreateAnswerSuccess(event: any) {
//   /**Step 6: callee sets local description */
//   this.peerConnection.setLocalDescription(new RTCSessionDescription(event)).then(
//       () => {
//           /**Step 7: callee send the description to caller */
//           this.webSocketService.emit('newMessage', {desc: {
//             val: this.peerConnection.localDescription,
//             type: 'desc',
//             uid: 1
//           }});
//           // this.ShowSuccess("create answer /n=>success");
//       },
//       // this.OnSetSessionDescriptionError.bind(this)
//   );
// }

// OnCallAnswer(descrip: any) {
//   /**Step 8: caller receives the answer and sets remote description */
//   this.peerConnection.setRemoteDescription(new RTCSessionDescription(descrip))
//       .then(() => console.log('success')).catch(err => { console.log(err); });
// }

// /////// ICE CANDIDATE
// OnIceCandidate(conn: any, event: any) {
//   if (event.candidate) {
//       // Send the candidate to the remote peer
//       //console.log("Send the candidate to the remote peer");
//       var candi = new RTCIceCandidate(event.candidate);
//       this.webSocketService.emit('newMessage', {candidate: {
//         val: candi, 
//         type: 'candidate',
//         uid: 34
//       }});

//   } else {
//       // All ICE candidates have been sent
//       //console.log("All ICE candidates have been sent");
//   }
// }


// ////// STREAM VIDEO 
 //get local stream
 getLocalStream() {
  // navigator.mediaDevices.enumerateDevices()
  //     .then(this.GotDevices.bind(this))
  //     .catch(this.HandleDeviceError.bind(this));
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
  }).then(this.gotLocalStream.bind(this))
      // .then(this.GotDevices.bind(this))
      // .catch(this.HandleDeviceError.bind(this));
}
//got local stream
gotLocalStream(stream: any) {
  this.localVideo.nativeElement.srcObject = stream;
  this.localVideo.nativeElement.controls = false;
  this.localVideo.nativeElement.muted = true;
  this.localVideo.nativeElement.volume = 0;
  this.localStream = stream;
  console.log("local stream id => " + stream.id);

  //this.SetConnection();
}

// new 
public initialize(eventHandlers: EventHandlers): RTCPeerConnection {
  this.peerConnection = new RTCPeerConnection(this.peerConfigurations);

  this.peerConnection.onicecandidate = (event) => {
      /* Each event.candidate generated after creating the offer
      must be added by the peer answering the connection */
      if (event.candidate) {
          eventHandlers.onIceCandidate(event.candidate);
      }
  };

  /* This method will be called when the peer creates a channel */
  this.peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;

      dataChannel.onopen = () => {
          eventHandlers.onDataChannelOpened(dataChannel);
      };

      dataChannel.onmessage = (event) => {
          const message = event.data;
          eventHandlers.onMessageReceived(message);
      };

      dataChannel.onclose = () => {
          eventHandlers.onDataChannelClosed();
      };
  };

  /* This method will be called when the peer adds a stream track */
  this.peerConnection.ontrack = (event) => {
      const { track } = event;
      eventHandlers.onRemoteStreamTrack(track);
  };

  return this.peerConnection;
}

public createDataChannel(
  connection: RTCPeerConnection,
  label: string,
  eventHandlers: EventHandlers,
) {
  const dataChannel = connection.createDataChannel(label);

  dataChannel.onopen = () => {
      eventHandlers.onDataChannelOpened(dataChannel);
  };

  dataChannel.onmessage = (event) => {
      const message = event.data;
      eventHandlers.onMessageReceived(message);
  };

  dataChannel.onclose = () => {
      eventHandlers.onDataChannelClosed();
  };
}

public addUserMediaTracks(
  connection: RTCPeerConnection,
  tracks: MediaStreamTrack[],
): RTCRtpSender[] {
  return tracks.map((track) => {
      return this.peerConnection.addTrack(track);
  });
}

public async createAndSetOffer(
  connection: RTCPeerConnection,
): Promise<RTCSessionDescriptionInit> {
  const offer = await connection.createOffer();
  await connection.setLocalDescription(offer);

  this.webSocketService.sendOffer(offer)
  return offer;
}

public createOffer() {
    console.log("1- create offer");
    this.peerConnection
        .createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
        .then(sdp => {
            this.peerConnection.setLocalDescription(sdp);
            this.webSocketService.emit("offer", sdp);
        })
        .catch(error => {
            console.log(error);
        });
}

public async createAndSetAnswer(
  connection: RTCPeerConnection,
): Promise<RTCSessionDescriptionInit> {
  const answer = await connection.createAnswer();
  await connection.setLocalDescription(answer);
  return answer;
}

private createAnswer(sdp: any) {
    this.peerConnection.setRemoteDescription(sdp).then(() => {
        console.log("answer set remote description success");
        this.peerConnection
            .createAnswer({
                offerToReceiveVideo: true,
                offerToReceiveAudio: true,
            })
            .then(sdp1 => {
                console.log("create answer");
                this.peerConnection.setLocalDescription(sdp1);
                this.webSocketService.emit("answer", sdp1);
            })
            .catch(error => {
                console.log(error);
            });
    });
};

public async setRemoteDescription(
  connection: RTCPeerConnection,
  remoteDescription: RTCSessionDescriptionInit,
) {
  await connection.setRemoteDescription(remoteDescription);
  this.addUserMediaTracks(connection, this.localStream.getTracks());
}

public async addIceCandidates(
  connection: RTCPeerConnection,
  candidates: RTCIceCandidateInit[],
) {
  for (const candidate of candidates) {
      await connection.addIceCandidate(candidate);
  }
}
 
}
