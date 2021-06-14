import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../../assets/models/message";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('push', [
      state('init', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      state('loaded', style({
        opacity: 1
      })),
      state('removed', style({
        opacity: 0
      })),
      state('deleted', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('init => loaded', [animate('0.3s')]),
      transition('loaded => removed', [animate('0.3s')]),
      transition('loaded => deleted', [animate('0.3s 1s')])
    ])
  ]
})
export class MessageComponent implements OnInit {

  @Input() message : Message | undefined;

  getIcon() {
    return (this.message?.author.isBot || this.message?.author.isAdmin)
      ? (this.message.author.isBot) ? "bi bi-gear" : "bi bi-person-badge"
        : "";
  }

  getState() : string {
    if(this.message?.init) return 'init';
    else if(this.message?.delete) return 'deleted';
    else if(this.message?.remove) return 'removed';
    else return 'loaded';
  }

  constructor() {

  }

  ngOnInit(): void {

  }

}
