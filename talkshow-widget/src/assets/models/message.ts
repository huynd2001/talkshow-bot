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
}

export interface MessagePart {

  cleanContent: string;
  attachment: Array<string>;
  emoji? : {
    id: string;
    alt: string;
  };
  format?: {
    color: string;
  }

}
