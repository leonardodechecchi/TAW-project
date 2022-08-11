import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { Shot } from '../models/Shot';
import { AccountService } from './account.service';

interface MatchData {
  matchId: string;
}

interface PlayerStateChangedData {
  message: string;
}

interface PositioningCompletedData {
  message: string;
}

type SocketEvent =
  | 'chat-message'
  | 'notification'
  | 'player-state-changed'
  | 'positioning-completed'
  | 'match-found'
  | 'shot-fired';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private accountService: AccountService) {
    this.socket = this.getSocketInstance();
  }

  /**
   * Return the socket instance.
   * @returns the socket instance
   */
  private getSocketInstance(): Socket {
    if (!this.socket) {
      const userId = this.accountService.getId();
      this.socket = io(environment.base_endpoint, { auth: { userId } });
    }
    return this.socket;
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
  public notificationListener(): Observable<Notification> {
    const event: SocketEvent = 'notification';
    console.log(`Listening on '${event}' event`);

    return new Observable<Notification>(
      (subscriber: Subscriber<Notification>) => {
        this.on<Notification>(event, (notification) => {
          subscriber.next(notification);
        });

        return () => {
          console.log(`Unlistening '${event}' event`);
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   * Connect to chat messages socket service.
   * @param chatId the chat id
   * @returns an Observable of `Message`
   */
  public chatMessageListener(chatId: string): Observable<Message> {
    const event: SocketEvent = 'chat-message';
    console.log(`Listening on '${event}' event`);

    return new Observable<Message>((subscriber: Subscriber<Message>) => {
      this.emit<string>('chat-joined', chatId);
      this.on<Message>(event, (message) => {
        subscriber.next(message);
      });
      return () => {
        console.log(`Unlistening '${event}' event`);
        this.socket.removeListener(event);
        this.emit<string>('chat-left', chatId);
      };
    });
  }

  /**
   *
   * @returns
   */
  public matchFoundListener(): Observable<MatchData> {
    const event: SocketEvent = 'match-found';
    console.log(`Listening on '${event}' event`);

    return new Observable<MatchData>((subscriber: Subscriber<MatchData>) => {
      this.on<MatchData>(event, (eventData) => {
        subscriber.next(eventData);
      });

      return () => {
        console.log(`Unlistening '${event}' event`);
        this.socket.removeListener(event);
      };
    });
  }

  /**
   *
   * @returns an Observable of `PositioningCompletedData`
   */
  public positioningCompletedListener(): Observable<PositioningCompletedData> {
    const event: SocketEvent = 'positioning-completed';
    console.log(`Listening on '${event}' event`);

    return new Observable<PositioningCompletedData>(
      (subscriber: Subscriber<PositioningCompletedData>) => {
        this.on<PositioningCompletedData>(event, (eventData) => {
          subscriber.next(eventData);
        });
        return () => {
          console.log(`Unlistening ${event}' event`);
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   *
   * @returns an Observable of `PlayerStateChangedData`
   */
  public playerStateChangedListener(): Observable<PlayerStateChangedData> {
    const event: SocketEvent = 'player-state-changed';
    console.log(`Listening on '${event}' event`);

    return new Observable<PlayerStateChangedData>(
      (subscriber: Subscriber<PlayerStateChangedData>) => {
        this.on<PlayerStateChangedData>(event, (eventData) => {
          subscriber.next(eventData);
        });
        return () => {
          console.log(`Unlistening '${event}' event`);
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   *
   * @returns an Observable of `Shot`
   */
  public shotFiredListener(matchId: string): Observable<Shot> {
    const event: SocketEvent = 'shot-fired';
    console.log(`Listening on '${event}' event`);

    return new Observable<Shot>((subscriber: Subscriber<Shot>) => {
      this.emit<{ matchId: string }>('match-joined', { matchId });
      this.on<Shot>(event, (shot) => {
        subscriber.next(shot);
      });
      return () => {
        console.log(`Unlistening '${event}' event`);
        this.socket.removeListener(event);
      };
    });
  }
}
