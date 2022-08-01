import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  // why it works only inside the constructor?
  constructor(private accountService: AccountService) {
    const userId = this.accountService.getId();
    this.socket = io(environment.base_endpoint, { auth: { userId } });
    this.socket.emit('server-joined');
  }

  ngOnDestroy(): void {
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
   *
   * @returns
   */
  connectFriendOnline(): Observable<void> {
    return new Observable<void>((subscriber: Subscriber<void>) => {
      this.socket.on('friend-online', () => {
        subscriber.next();
      });
    });
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

  /**
   *
   * @param eventName
   * @param data
   */
  public emit<T>(eventName: string, data?: T): void {
    this.socket.emit(eventName, data);
  }

  /**
   *
   * @param eventName
   * @param listener
   */
  public on<T>(eventName: string, listener: (data?: T) => void): void {
    this.socket.on(eventName, listener);
  }
}
