import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Match } from '../models/Match';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { Relationship } from '../models/Relationship';
import { Shot } from '../models/Shot';
import { AccountService } from './account.service';

interface MatchData {
  matchId: string;
}

interface PlayerStateChangedData {
  message: string;
}

interface PositioningCompletedData {
  matchId: string;
}

interface MatchAvailableData {
  match: Match;
}

interface MatchEndedData {
  matchId: string;
  message: string;
}

interface FriendOnlineData {
  userId: string;
}

type SocketEvent =
  | 'chat-message'
  | 'notification'
  | 'player-state-changed'
  | 'positioning-completed'
  | 'match-found'
  | 'shot-fired'
  | 'match-available'
  | 'match-ended'
  | 'friend-request-accepted'
  | 'friend-online'
  | 'friend-offline';

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

    return new Observable<Notification>(
      (subscriber: Subscriber<Notification>) => {
        this.on<Notification>(event, (notification) => {
          subscriber.next(notification);
        });

        return () => {
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   *
   * @returns
   */
  public friendRequestAcceptedListener(): Observable<Relationship> {
    const event: SocketEvent = 'friend-request-accepted';

    return new Observable<Relationship>(
      (subscriber: Subscriber<Relationship>) => {
        this.on<Relationship>(event, (relationship) => {
          subscriber.next(relationship);
        });

        return () => {
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   *
   * @returns
   */
  public friendOnlineListener(): Observable<FriendOnlineData> {
    const event: SocketEvent = 'friend-online';

    return new Observable<FriendOnlineData>(
      (subscriber: Subscriber<FriendOnlineData>) => {
        this.on<FriendOnlineData>(event, (eventData) => {
          subscriber.next(eventData);
        });

        return () => {
          this.socket.removeListener(event);
        };
      }
    );
  }
  /**
   *
   * @returns
   */
  public friendOfflineListener(): Observable<FriendOnlineData> {
    const event: SocketEvent = 'friend-offline';

    return new Observable<FriendOnlineData>(
      (subscriber: Subscriber<FriendOnlineData>) => {
        this.on<FriendOnlineData>(event, (eventData) => {
          subscriber.next(eventData);
        });

        return () => {
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

    return new Observable<Message>((subscriber: Subscriber<Message>) => {
      this.emit<string>('chat-joined', chatId);
      this.on<Message>(event, (message) => {
        subscriber.next(message);
      });
      return () => {
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

    return new Observable<MatchData>((subscriber: Subscriber<MatchData>) => {
      this.on<MatchData>(event, (eventData) => {
        subscriber.next(eventData);
      });

      return () => {
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

    return new Observable<PositioningCompletedData>(
      (subscriber: Subscriber<PositioningCompletedData>) => {
        this.on<PositioningCompletedData>(event, (eventData) => {
          subscriber.next(eventData);
        });
        return () => {
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

    return new Observable<PlayerStateChangedData>(
      (subscriber: Subscriber<PlayerStateChangedData>) => {
        this.on<PlayerStateChangedData>(event, (eventData) => {
          subscriber.next(eventData);
        });
        return () => {
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

    return new Observable<Shot>((subscriber: Subscriber<Shot>) => {
      this.emit<MatchData>('match-joined', { matchId });
      this.on<Shot>(event, (shot) => {
        subscriber.next(shot);
      });
      return () => {
        this.socket.removeListener(event);
      };
    });
  }

  /**
   *
   * @returns
   */
  public matchAvailableListener(): Observable<MatchAvailableData> {
    const event: SocketEvent = 'match-available';

    return new Observable<MatchAvailableData>(
      (subscriber: Subscriber<MatchAvailableData>) => {
        this.on<MatchAvailableData>(event, (eventData) => {
          subscriber.next(eventData);
        });

        return () => {
          this.socket.removeListener(event);
        };
      }
    );
  }

  /**
   *
   * @returns
   */
  public matchEndedListener(): Observable<MatchEndedData> {
    const event: SocketEvent = 'match-ended';

    return new Observable<MatchEndedData>(
      (subscriber: Subscriber<MatchEndedData>) => {
        this.on<MatchEndedData>(event, (eventData) => {
          subscriber.next(eventData);
        });

        return () => {
          this.socket.removeListener(event);
        };
      }
    );
  }
}
