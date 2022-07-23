import { Message } from './Message';

export interface Chat {
  _id: string;
  users: string[];
  messages: Message[];
}
