import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats } from '../models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { Token } from '../models/Token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

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
   * @returns an Observable of `void`
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
  updateUserStats(userId: string, stats: UserStats): Observable<User> {
    const body = { stats };
    return this.http.put<User>(
      `${environment.user_endpoint}/${userId}/stats`,
      body
    );
  }

  /**
   *
   * @returns
   */
  getToken(): string {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   *
   * @returns
   */
  getId(): string {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return (jwt_decode(token) as Token).userId;
  }

  /**
   *
   * @returns
   */
  getUsername(): string {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return (jwt_decode(token) as Token).username;
  }

  /**
   *
   * @returns
   */
  getEmail(): string {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return (jwt_decode(token) as Token).email;
  }

  /**
   *
   * @returns
   */
  getStatus(): string {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return (jwt_decode(token) as Token).status;
  }

  /**
   *
   * @returns
   */
  getRoles(): string[] {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return (jwt_decode(token) as Token).roles;
  }
}
