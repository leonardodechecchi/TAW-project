import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/Chat';

@Injectable({
  providedIn: 'root',
})
export class ModeratorService {
  constructor(private http: HttpClient) {}

  /**
   * Return the list of user.
   * @param moderatorId the moderator id
   * @returns an Observable of `User[]`, i.e. the list of users
   */
  public getUsers(moderatorId: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.moderator_endpoint}/${moderatorId}/users`
    );
  }

  /**
   * Delete a user.
   * @param moderatorId the moderator id
   * @param userId the user id
   * @returns an empty Observable
   */
  public deleteUser(moderatorId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.moderator_endpoint}/${moderatorId}/users/${userId}`
    );
  }

  /**
   *
   * @param moderatorId
   * @param userId
   * @returns
   */
  public createChat(moderatorId: string, userId: string): Observable<Chat> {
    const body = { userId };
    return this.http.post<Chat>(
      `${environment.moderator_endpoint}/${moderatorId}/chats`,
      body
    );
  }

  /**
   *
   * @param moderatorId
   * @returns
   */
  public getChats(moderatorId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `${environment.moderator_endpoint}/${moderatorId}/chats`
    );
  }
}
