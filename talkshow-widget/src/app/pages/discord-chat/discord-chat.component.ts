import { Component, OnInit } from '@angular/core';
import { DiscordMessService } from "../../services/discord-mess.service";
import { EventEmitter } from "events";
import {Message} from "discord.js";

@Component({
  selector: 'app-discord-chat',
  templateUrl: './discord-chat.component.html',
  styleUrls: ['./discord-chat.component.css']
})

export class DiscordChatComponent implements OnInit {

  msgArray : Array<Message> = [];
  channelName : string = "";
  timeOut : number = 30;
  height : number = 600;
  width : number = 400;

  borderString : string = "solid 3px black";

  getWidthStyle() : string {
    return this.width.toString() + "px";
  }

  getStyle() : string {
    return `width : ${this.width}px; height : ${this.height}px; max-width: ${this.width}px; max-height: ${this.height}; border: solid 3px black`;
  }

  constructor(private discordService: DiscordMessService,
              private eventListener: EventEmitter) { }

  ngOnInit() {
    this.eventListener = this.discordService.discordEmitter;

    this.eventListener.on('message', msg => {
      this.addMessage(msg);
    });

    this.eventListener.on('channel', channel => {
      this.channelName = channel.name;
    });

  }

  addMessage(msg : Message) {
    this.msgArray.push(msg);
    new Promise(r => setTimeout(r, this.timeOut)).then(() => {
      this.msgArray.shift();
    });
  }

}
