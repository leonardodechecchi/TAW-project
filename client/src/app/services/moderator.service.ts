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
   * Create a new user with moderator role.
   * @param moderatorId the moderator id
   * @param name the new user name
   * @param surname the new user surname
   * @param email the new user email
   * @returns an Observable of `User`, i.e the new user created
   */
  public createModeratorUser(
    moderatorId: string,
    name: string,
    surname: string,
    email: string
  ): Observable<User> {
    const body = {
      name,
      surname,
      email,
    };
    return this.http.post<User>(
      `${environment.moderator_endpoint}/${moderatorId}/users`,
      body
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
   * Create a new chat with the given user.
   * @param moderatorId the moderator id
   * @param userUsername the user username
   * @returns an Observable of `Chat`, i.e. the chat created
   */
  public createChat(
    moderatorId: string,
    userUsername: string
  ): Observable<Chat> {
    const body = { userUsername };
    return this.http.post<Chat>(
      `${environment.moderator_endpoint}/${moderatorId}/chats`,
      body
    );
  }

  /**
   * Get all the chats from db if the requester has
   * moderator or admin role.
   * @param moderatorId the moderator id
   * @returns an Observable of `Chat[]`, i.e. the list of chats
   */
  public getChats(moderatorId: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(
      `${environment.moderator_endpoint}/${moderatorId}/chats`
    );
  }
}
