import { Component, OnInit } from '@angular/core';
import { DiscordMessService } from "../../services/discord-mess.service";
import { EventEmitter } from "events";

@Component({
  selector: 'app-discord-chat',
  templateUrl: './discord-chat.component.html',
  styleUrls: ['./discord-chat.component.css']
})

export class DiscordChatComponent implements OnInit {

  msgArray : Array<string> = [];
  discordEventEmitter : EventEmitter | undefined;
  channelName : string = "";
  timeOut : number = 30000;
  height : number = 600;
  width : number = 400;

  borderString : string = "solid 3px black";

  constructor(private discordService: DiscordMessService) { }

  ngOnInit() {
    this.discordEventEmitter = this.discordService.start();
    if(this.discordEventEmitter) {
      this.discordEventEmitter.on('message', (data) => {
        this.addMessage(data);
      });
      this.discordEventEmitter.on('channel', (data) => {
        this.channelName = data;
      })
    }

  }

  addMessage(msg : string) {
    this.msgArray.push(msg);
    new Promise(r => setTimeout(r, this.timeOut)).then(() => {
      this.msgArray.shift();
    });
  }

}
