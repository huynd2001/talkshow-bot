import { Component, OnInit } from '@angular/core';
import { DiscordMessService } from "../../services/discord-mess.service";
import { EventEmitter } from "events";
import { DisplayConstants } from "../../../assets/constants/display";
import {Message} from "../../../assets/models/message";

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
        data.edit = false;
        data.delete = false;
        this.addMessage(data);
      });

      this.discordEventEmitter.on('channel', (data : string) => {
        this.channelName = data;
        this.msgArray = [];
      });

      this.discordEventEmitter.on('edit', (data: Message) => {
        let msg = this.msgArray.find((msg) => msg.id == data.id);
        if(msg) {
          msg.content = data.content
          msg.author = data.author
          msg.edit = true;
        }
      })

      this.discordEventEmitter.on('delete', (data: string) => {
        let msg = this.msgArray.find((msg) => msg.id == data);
        if(msg) {
          msg.delete = true;
        }
      })

    }

  }

  addMessage(msg : Message) {
    msg.init = true;
    msg.remove = false;
    msg.delete = false;
    this.msgArray.push(msg);
    new Promise(r => setTimeout(r, 5)).then(() => {
      msg.init = false;
    });
    new Promise(r => setTimeout(r, this.timeOut)).then(() => {
      msg.remove = true;
    }).then(() => {
      new Promise(r => setTimeout(r, 500)).then(() => {
        this.msgArray.shift();
      });
    });
  }

}
