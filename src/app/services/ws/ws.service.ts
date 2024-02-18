import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WS_MESSAGE } from './ws.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CLIENT_TYPE } from '../video-record/video-record.model';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  masterClient: Subject<any> = new ReplaySubject<any>()
  slaveClient: Subject<any> = new ReplaySubject<any>()
  socket: any;
  readonly url: string = environment.webSocketUrl;

  private messagesSubject = new Subject<WS_MESSAGE>();
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.socket = io(this.url);
  }

  webSocketConnect() {
    console.log('connect_yeah');
    return this.socket;
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: WS_MESSAGE) => {
        subscriber.next(data);
        console.log('data');
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  getOffer() {
    return new Observable((subscriber) => {
      this.socket.on('onOffer', (data: any) => {
        subscriber.next(data);
        console.log(data);
      });
    });
  }

  sendOffer(data: any) {
    this.socket.emit('newOffer', data);
  }

  setMasterClient() {
    this.masterClient.next({id: 1, name: CLIENT_TYPE.MASTER})
  }
}
