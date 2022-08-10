import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserStats } from '../models/User';
import { environment } from 'src/environments/environment';
import { Relationship } from '../models/Relationship';
import { Notification, NotificationType } from '../models/Notification';
import { AccountService } from './account.service';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private relationshipsSubject: BehaviorSubject<Relationship[]>;
  public relationships: Observable<Relationship[]>;

  private notificationsSubject: BehaviorSubject<Notification[]>;
  public notifications: Observable<Notification[]>;

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private socketService: SocketService
  ) {
    const userId: string = this.accountService.getId();

    this.relationshipsSubject = new BehaviorSubject<Relationship[]>([]);
    this.relationships = this.relationshipsSubject.asObservable();

    this.notificationsSubject = new BehaviorSubject<Notification[]>([]);
    this.notifications = this.notificationsSubject.asObservable();

    // get user relationships
    this.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationshipsSubject.next(relationships);
      },
    });

    // get user notifications
    this.getNotifications(userId).subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
      },
    });

    // connect to notification socket service
    this.socketService.notificationListener().subscribe({
      next: (notification) => {
        this.notificationsSubject.value.push(notification);
        this.updateNotifications(this.notificationsSubject.value);
      },
    });
  }

  /**
   * Update the notifications list and send it to all subscribers.
   * @param notifications the new notifications
   */
  public updateNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
  }

  /**
   * Update the relationships list and send it to all subscribers.
   * @param relationships the new relationships
   */
  public updateRelationships(relationships: Relationship[]): void {
    this.relationshipsSubject.next(relationships);
  }

  /**
   * Retrieve the user who match `userId`
   * @param userId the user id
   * @returns an Observable of `User`, i.e. the user found
   */
  public getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.user_endpoint}/${userId}`);
  }

  /**
   * Retrieve the user who match `username`.
   * @param username the user username
   * @returns an Observable of `User`, i.e. the user found
   */
  public getUserByUsername(username: string): Observable<User> {
    const params = new HttpParams().set('username', username);
    return this.http.get<User>(environment.user_endpoint, { params });
  }

  /**
   * Update the user username.
   * @param userId the user id
   * @param username the username to set
   * @returns an Observable of `User`, i.e. the user record updated
   */
  public updateUsername(userId: string, username: string): Observable<User> {
    const body = { username };
    return this.http.put<User>(
      `${environment.user_endpoint}/${userId}/username`,
      body
    );
  }

  /**
   * Update the user password.
   * @param userId the user id
   * @param password the new password
   * @returns an empty Observable
   */
  public updatePassword(
    userId: string,
    currentPassword: string,
    password: string
  ): Observable<void> {
    const body = { currentPassword, password };
    return this.http.put<void>(
      `${environment.user_endpoint}/${userId}/password`,
      body
    );
  }

  /**
   * Update a new profile picture.
   * @param userId the user id
   * @param formData
   * @returns an empty Observable
   uploadPicture(userId: string, formData: FormData): Observable<void> {
     return this.http.put<void>(
       `${environment.user_endpoint}/${userId}/picture`,
       formData
       );
      }
      */

  /**
   * Update the user stats.
   * @param userId the user id
   * @param stats the new stats
   * @returns an Observable of `User`, i.e. the user record updated
   */
  public updateStats(userId: string, stats: UserStats): Observable<User> {
    const body = { stats };
    return this.http.put<User>(
      `${environment.user_endpoint}/${userId}/stats`,
      body
    );
  }

  /**
   * Retrieve the user relationships.
   * @param userId the user id
   * @returns an `Observable` of `Relationship[]`, i.e. the user relationships
   */
  public getRelationships(userId: string): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships`
    );
  }

  /**
   * Create a relationship between the two users.
   * @param userId the user id
   * @param friendId the friend id
   * @returns an empty `Observable`
   */
  public createRelationship(
    userId: string,
    friendId: string
  ): Observable<Relationship[]> {
    const body = { friendId };
    return this.http.post<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships`,
      body
    );
  }

  /**
   * Delete the relationship between the two users.
   * @param userId the user id
   * @param friendId the friend id
   * @returns an empty `Observable`
   */
  public deleteRelationship(
    userId: string,
    friendId: string
  ): Observable<Relationship[]> {
    return this.http.delete<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships/${friendId}`
    );
  }

  /**
   * Retrieve the user notifications.
   * @param userId the user id
   * @returns an `Observable` of `Notification[]`, i.e. the user notifications
   */
  public getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${environment.user_endpoint}/${userId}/notifications`
    );
  }

  /**
   * Post a notification to the specified user.
   * @param recipientId the recipient id
   * @param notification the notification to send
   * @returns an empty Observable
   */
  public postNotification(
    recipientId: string,
    notification: { senderId: string; type: NotificationType }
  ): Observable<void> {
    return this.http.post<void>(
      `${environment.user_endpoint}/${recipientId}/notifications`,
      notification
    );
  }

  /**
   * Delete the notification for the specified user.
   * @param userId the user id
   * @param notification the notification to delete
   * @returns an Observable of `Notification[]`, i.e. the user notifications
   * updated
   */
  public deleteNotification(
    userId: string,
    notification: { senderId: string; type: string }
  ): Observable<Notification[]> {
    const params = new HttpParams()
      .set('senderId', notification.senderId)
      .set('type', notification.type);

    return this.http.delete<Notification[]>(
      `${environment.user_endpoint}/${userId}/notifications`,
      { params }
    );
  }
}
