import { Component, OnInit } from '@angular/core';
import { DiscordMessService } from "../../services/discord-mess.service";
import { EventEmitter } from "events";
import { DisplayConstants } from "../../../assets/constants/display";
import { Message } from "../../../assets/models/message";

@Component({
  selector: 'app-discord-chat',
  templateUrl: './discord-chat.component.html',
  styleUrls: ['./discord-chat.component.css']
})

export class DiscordChatComponent implements OnInit {

  msgArray : Array<Message> = [];
  discordEventEmitter : EventEmitter | undefined;
  channelName : string = "";
  timeOut : number = DisplayConstants.TIMEOUT;
  height : number = DisplayConstants.HEIGHT;
  width : number = DisplayConstants.WIDTH;

  constructor(private discordService: DiscordMessService) { }

  ngOnInit() {
    this.discordEventEmitter = this.discordService.start();
    if(this.discordEventEmitter) {
      this.discordEventEmitter.on('message', (data: Message) => {
        this.addMessage(data);
      });
      this.discordEventEmitter.on('channel', (data) => {
        this.channelName = data;
        this.msgArray = [];
      })
    }

  }

  addMessage(msg : Message) {
    this.msgArray.push(msg);
    new Promise(r => setTimeout(r, this.timeOut)).then(() => {
      this.msgArray.shift();
    });
  }

}
