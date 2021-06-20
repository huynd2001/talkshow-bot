import { Component, OnInit } from '@angular/core';
import { DiscordMessService } from "../../services/discord-mess.service";
import { EventEmitter } from "events";
import { DisplayConstants } from "../../../assets/constants/display";
import { Message } from "../../../assets/models/message";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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
  opacity: number = DisplayConstants.OPACITY;
  maxMessages: number | undefined = DisplayConstants.MAXMESSAGES;
  isConnected : boolean = false;

  constructor(private discordService: DiscordMessService,
              private route: ActivatedRoute) { }

  getColor(r: number, g: number, b: number) : string {
    return `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.width = params['width'] ?? this.width;
      this.height = params['height'] ?? this.height;
      this.opacity = (params['opacity'] ?? this.opacity) / 100;
      this.maxMessages = params['maxMessages'] ?? this.maxMessages;
    });

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

      this.discordEventEmitter.on('connect', () => {
        this.isConnected = true;
      })

    }

  }

  addMessage(msg : Message) {
    msg.init = true;
    msg.remove = false;
    msg.delete = false;
    this.msgArray.push(msg);
    if(this.maxMessages && this.msgArray.find.length > this.maxMessages) {
      this.msgArray.shift();
    }
    new Promise(r => setTimeout(r, 5)).then(() => {
      msg.init = false;
    });
    new Promise(r => setTimeout(r, this.timeOut)).then(() => {
      msg.remove = true;
    }).then(() => {
      new Promise(r => setTimeout(r, 500)).then(() => {
        if (this.msgArray.find((m) => m.id == msg.id))
          this.msgArray.shift();
      });
    });
  }

}
