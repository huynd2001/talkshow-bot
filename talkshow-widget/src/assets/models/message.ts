import {MessageFormat} from "../../../../discord-service-backend/models/models";

export interface Author {
  author : string;
  color: string;
  isAdmin: boolean;
  isBot: boolean;
}

export interface WssMessage {
  update: string;
  response_obj: string | Message;
}

export interface Message {
  id: string;
  author: Author;
  content: Array<MessagePart>;
  attachments: Array<string>;
  edit? : boolean;
}

export interface MessagePart {

  cleanContent: string;
  emoji? : {
    id: string;
    alt: string;
  };
  format?: {
    color: string;
  }

}
