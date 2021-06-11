import { Injectable, Input } from '@angular/core';
import { EventEmitter } from "events";
import {parseJson} from "@angular/cli/utilities/json-file";
import {WssMessage} from "../../assets/models/message";
import {ServerConstants} from "../../assets/constants/server";

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  constructor() {

  }

  start() : EventEmitter | undefined {
    let ws = new WebSocket(ServerConstants.DISCORD_ENDPOINT);
    let retEventEmitter = new EventEmitter();

    if(ws != null) {

      ws.onopen = (e) => {
        console.log(e);
      }

      ws.onmessage = (e) => {

        console.log(e.data);

        let message : WssMessage = JSON.parse(e.data)

        retEventEmitter.emit(message.update, message.response_obj)
      };

      ws.onerror = (e) => {
        console.log(e);
      }

      return retEventEmitter;
    }
    else {
      console.log("Bro it brokey");
      return undefined;
    }
  }

}
