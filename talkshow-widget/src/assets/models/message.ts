export interface Message {
  author: string;
  message: string;
}

export interface WssMessage {
  update: string;
  response_obj: string | Message;
}
