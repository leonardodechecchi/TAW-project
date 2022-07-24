import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit, OnDestroy {
  private socket: Socket;

  // why it works only inside the constructor?
  constructor(private accountService: AccountService) {
    const userId = this.accountService.getId();
    this.socket = io(environment.base_endpoint, { auth: { userId } });
    if (this.socket) console.log('socket connected');
    this.socket.emit('server-joined');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.socket.emit('server-left');
    this.socket.disconnect();
  }

  /**
   *
   */
  connectUserNotifications() {}

  /**
   *
   * @param chatId the chat id
   * @returns
   */
  connectChatMessages(chatId: string) {
    return new Observable<Message>((subscriber: Subscriber<Message>) => {
      this.socket.emit('chat-joined', chatId);
      this.socket.on('new-message', (message: Message) => {
        subscriber.next(message);
      });
      return () => {
        this.socket.emit('chat-left', chatId);
      };
    });
  }
}
