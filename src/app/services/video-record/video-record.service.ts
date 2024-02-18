import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoRecordService {
  private mediaStream: any;
  private recorder: any;
  private blob: any;
  private _mediaStream = new Subject<any>();
  private _blob = new Subject<any>();

  constructor() {}

  // getObservable
  getMediaStream() {
    return this._mediaStream.asObservable();
  }

  getBlob() {
    return this._blob.asObservable();
  }

  startRecording() {
    this.handleRecording();
  }

  async handleRecording() {
    // @ts-ignore
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    // .then((stream) => {
    //     // Changing the source of video to current stream.
    //     video.srcObject = stream;
    //     video.addEventListener("loadedmetadata", () => {
    //         video.play();
    //     });
    // })
    // .catch(alert);

    // .getDisplayMedia({
    //   audio: true,
    //   video: true
    // });
    this._mediaStream.next(this.mediaStream);
    this.recorder = new RecordRTC(this.mediaStream, { type: 'video' });
    this.recorder.startRecording();
  }

  stopRecording() {
    if (!this.recorder) {
      return;
    }
    this.recorder.stopRecording(() => {
      this.blob = this.recorder.getBlob();
      const url = this.recorder.getDataURL();
      console.log(this.blob);
      this._blob.next(URL.createObjectURL(this.blob));
      this.mediaStream.stop();
      this.recorder.destroy();
      this.mediaStream = null;
      this.recorder = null;
    });
  }

  downloadRecording() {
    RecordRTC.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`);
  }

  downloadTest() {
    // downloadButton.addEventListener('click', () => {
    const blob = new Blob(this.blob, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    console.log(blob);
    console.log(url);
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    // });
  }

  clearRecording() {
    this.blob = null;
    this.recorder = null;
    this.mediaStream = null;
  }
}
