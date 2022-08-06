import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { AccountService } from './account.service';

interface MatchData {
  matchId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket;

  constructor(private accountService: AccountService) {
    const userId = this.accountService.getId();
    this.socket = io(environment.base_endpoint, { auth: { userId } });
    this.emit('server-joined');
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  /**
   *
   * @param eventName the event name
   * @param data the data to send
   */
  public emit<T>(eventName: string, data?: T): void {
    this.socket.emit(eventName, data);
  }

  /**
   *
   * @param eventName the event name
   * @param listener the handler
   */
  private on<T>(eventName: string, listener: (data?: T) => void): void {
    this.socket.on(eventName, listener);
  }

  /**
   * Connect to user notification socket service.
   * @returns an Observable of `Message`
   */
  notifications(): Observable<Notification> {
    return new Observable<Notification>(
      (subscriber: Subscriber<Notification>) => {
        this.on<Notification>('notification', (notification) => {
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
  chatMessages(chatId: string): Observable<Message> {
    return new Observable<Message>((subscriber: Subscriber<Message>) => {
      this.emit<string>('chat-joined', chatId);
      this.on<Message>('chat-message', (message) => {
        subscriber.next(message);
      });
      return () => {
        this.emit<string>('chat-left', chatId);
      };
    });
  }

  /**
   *
   * @returns
   */
  matchFound(): Observable<string> {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      this.on<MatchData>('match-found', (matchData) => {
        subscriber.next(matchData.matchId);
      });
    });
  }
}
