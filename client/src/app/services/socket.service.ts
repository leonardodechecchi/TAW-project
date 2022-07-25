import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit, OnDestroy {
  private socket: Socket;

  // why it works only inside the constructor?
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    const userId = this.accountService.getId();
    console.log('calling constructor from socket service ' + userId);
    this.socket = io(environment.base_endpoint, { auth: { userId } });
    if (this.socket) console.log('socket connected');
    this.socket.emit('server-joined');
  }

  ngOnDestroy(): void {
    console.log('disconnecting from socket service');
    this.socket.emit('server-left');
    this.socket.disconnect();
  }

  /**
   * Connect to user notification socket service.
   * @returns an Observable of `Message`
   */
  connectUserNotifications(): Observable<Notification> {
    return new Observable<Notification>(
      (subscriber: Subscriber<Notification>) => {
        this.socket.on('notification', (notification: Notification) => {
          subscriber.next(notification);
        });
      }
    );
  }

  /**
   * Connect to chat messages socket service.
   * @param chatId the chat id
   * @returns an Observable of `Message`
   */
  connectChatMessages(chatId: string): Observable<Message> {
    return new Observable<Message>((subscriber: Subscriber<Message>) => {
      this.socket.emit('chat-joined', chatId);
      this.socket.on('chat-message', (message: Message) => {
        subscriber.next(message);
      });
      return () => {
        this.socket.emit('chat-left', chatId);
      };
    });
  }
}
