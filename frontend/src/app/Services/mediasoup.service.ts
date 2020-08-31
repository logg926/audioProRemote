import { Injectable, ɵConsole } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediasoupService {
  socket: 
  constructor(roomId, peerName) {
    console.log('connect to socket');

    this.socket = io('http://localhost:8080', { query: { roomId, peerName } });
  }
}
