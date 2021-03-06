export interface Author {
  author : string;
  color: string;
  isAdmin: boolean;
  isBot: boolean;
}

export interface SocketMessage {
  update: string;
  response_obj: string | Message;
}

export interface Message {
  id: string;
  author: Author;
  content: Array<MessagePart>;
  attachments: Array<string>;
  edit? : boolean;
  delete? : boolean;
  init? : boolean;
  remove? : boolean;
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
