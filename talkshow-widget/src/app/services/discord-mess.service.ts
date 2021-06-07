import { Injectable, Input } from '@angular/core';
import { EventEmitter } from "events";
import { Subject, Observable, Observer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiscordMessService {

  discordEmitter : EventEmitter = new EventEmitter();

  constructor() {

  }

  private subject: Subject<MessageEvent> | undefined;

  public connect(url: string): Subject<MessageEvent> | undefined {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
