export interface Author {
  author : string;
  color: string;
  isAdmin: boolean;
  isBot: boolean;
}

export interface Message {
  id: string;
  author: Author;
  content: string;
}

export interface WssMessage {
  update: string;
  response_obj: string | Message;
}
