import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Relationship } from '../models/Relationship';
import { Notification } from '../models/Notification';
import { UserStats, UserStatus } from '../models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface User {
  userId: string;
  username: string;
  status: UserStatus;
  online: boolean;
  stats: UserStats;
  roles: string[];
  relationships: Relationship[];
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  updateUser(changes: Partial<User>) {
    let updatedUser = { ...this.userSubject.value, ...changes };
    this.userSubject.next(updatedUser);
  }

  /**
   * Retrieve the user who match `userId`
   * @param userId the user id
   * @returns an Observable of `User`, i.e. the user found
   */
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.user_endpoint}/${userId}`);
  }

  /**
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
   * Retrieve the user notifications.
   * @param userId the user id
   * @returns an `Observable` of `Notification[]`, i.e. the user notifications
   */
  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${environment.user_endpoint}/${userId}/notifications`
    );
  }
}
