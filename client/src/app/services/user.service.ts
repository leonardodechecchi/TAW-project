import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserStats } from '../models/User';
import { environment } from 'src/environments/environment';
import { Relationship } from '../models/Relationship';
import { Notification, NotificationType } from '../models/Notification';
import { AccountService } from './account.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private notificationsSubject: BehaviorSubject<Notification[]>;
  public notifications: Observable<Notification[]>;

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private socketService: SocketService
  ) {
    const userId: string = this.accountService.getId();
    this.notificationsSubject = new BehaviorSubject<Notification[]>([]);
    this.notifications = this.notificationsSubject.asObservable();

    this.getNotifications(userId).subscribe({
      next: (notifications) => {
        console.log('from user service ' + notifications);
        this.notificationsSubject.next(notifications);
      },
    });

    // socket notifications
    this.socketService.connectUserNotifications().subscribe({
      next: (notification) => {
        this.notificationsSubject.value.push(notification);
        this.updateNotifications(this.notificationsSubject.value);
      },
    });
  }

  /**
   *
   * @param notifications
   */
  updateNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
  }

  /**
   * `GET` method.
   * Retrieve the user who match `userId`
   * @param userId the user id
   * @returns an Observable of `User`, i.e. the user found
   */
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.user_endpoint}/${userId}`);
  }

  /**
   * `GET` method.
   * Retrieve the user who match `username`.
   * @param username the user username
   * @returns an Observable of `User`, i.e. the user found
   */
  getUserByUsername(username: string): Observable<User> {
    const params = new HttpParams().set('username', username);
    return this.http.get<User>(environment.user_endpoint, { params });
  }

  /**
   * `PUT` method.
   * Update the user password.
   * @param userId the user id
   * @param password the new password
   * @returns an empty Observable
   */
  modifyPassword(userId: string, password: string): Observable<void> {
    const body = { password };
    return this.http.put<void>(
      `${environment.user_endpoint}/${userId}/password`,
      body
    );
  }

  /**
   * `PUT` method.
   * Update the user stats.
   * @param userId the user id
   * @param stats the new stats
   * @returns an Observable of `User`, i.e. the user record updated
   */
  updateStats(userId: string, stats: UserStats): Observable<User> {
    const body = { stats };
    return this.http.put<User>(
      `${environment.user_endpoint}/${userId}/stats`,
      body
    );
  }

  /**
   * `GET` method.
   * Retrieve the user relationships.
   * @param userId the user id
   * @returns an `Observable` of `Relationship[]`, i.e. the user relationships
   */
  getRelationships(userId: string): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships`
    );
  }

  /**
   * `POST` method.
   * Create a relationship between the two users.
   * @param userId the user id
   * @param friendId the friend id
   * @returns an empty `Observable`
   */
  createRelationship(userId: string, friendId: string): Observable<void> {
    const body = { friendId };
    return this.http.post<void>(
      `${environment.user_endpoint}/${userId}/relationships`,
      body
    );
  }

  /**
   * `DELETE` method.
   * Delete the relationship between the two users.
   * @param userId the user id
   * @param friendId the friend id
   * @returns an empty `Observable`
   */
  deleteRelationship(
    userId: string,
    friendId: string
  ): Observable<Relationship[]> {
    return this.http.delete<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships/${friendId}`
    );
  }

  /**
   * `GET` method.
   * Retrieve the user notifications.
   * @param userId the user id
   * @returns an `Observable` of `Notification[]`, i.e. the user notifications
   */
  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${environment.user_endpoint}/${userId}/notifications`
    );
  }

  /**
   *
   * @param recipientId
   * @param notification
   * @returns
   */
  postNotification(
    recipientId: string,
    notification: { senderId: string; type: NotificationType }
  ): Observable<void> {
    return this.http.post<void>(
      `${environment.user_endpoint}/${recipientId}/notifications`,
      notification
    );
  }

  /**
   *
   * @param userId
   * @param notification
   * @returns
   */
  deleteNotification(
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
