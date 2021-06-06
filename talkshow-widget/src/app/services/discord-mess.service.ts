import {Injectable, Input} from '@angular/core';
import {EventEmitter} from "events";

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  discordEmitter : EventEmitter = new EventEmitter();

  constructor() {

  }

}
