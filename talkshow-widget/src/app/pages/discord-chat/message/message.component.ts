import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../../assets/models/message";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message : Message | undefined;

  getIcon() {
    return (this.message?.author.isBot || this.message?.author.isAdmin)
      ? (this.message.author.isBot) ? "bi bi-gear" : "bi bi-person-badge"
        : "";
  }

  constructor() {

  }

  ngOnInit(): void {

  }

}
