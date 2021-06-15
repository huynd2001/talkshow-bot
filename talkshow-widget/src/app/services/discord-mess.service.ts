import { Injectable, Input } from '@angular/core';
import { EventEmitter } from "events";
import {SocketMessage} from "../../assets/models/message";
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  constructor(private socket: Socket) {

  }

  start() : EventEmitter | undefined {

    let retEventEmitter = new EventEmitter();

    this.socket.fromEvent('discord').pipe((data) => {
      return data
    }).subscribe({
      next(response) { 
        let socketmess = response as SocketMessage;
        retEventEmitter.emit(socketmess.update, socketmess.response_obj);
        console.log(socketmess); 
      },
      error(err) { 
        console.error('Error: ' + err); 
      },
      complete() { 
        console.log('Completed'); 
      }
    });

    return retEventEmitter;
  }

}
