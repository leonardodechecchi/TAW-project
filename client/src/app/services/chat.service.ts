import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  /**
   * `GET` method.
   * @param chatId the chat id
   * @returns
   */
  getChat(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${environment.chat_endpoint}/${chatId}`);
  }

  /**
   * `DELETE` method.
   * @param chatId the chat id
   * @returns
   */
  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${environment.chat_endpoint}/${chatId}`);
  }

  /**
   * `POST` method.
   * @param chatId the chat id
   * @param message the message to add
   * @returns
   */
  addMessage(chatId: string, message: Message) {
    const body = { message };
    return this.http.post(
      `${environment.chat_endpoint}/${chatId}/messages`,
      body
    );
  }

  /**
   * `POST` method.
   * @param chatId the chat id
   * @param username the user username
   * @returns
   */
  addUser(chatId: string, username: string): Observable<Chat> {
    const body = { username };
    return this.http.post<Chat>(
      `${environment.chat_endpoint}/${chatId}/users`,
      body
    );
  }

  /**
   * `DELETE` method.
   * @param chatId the chat id
   * @param username the user username
   */
  removeUser(chatId: string, username: string): Observable<void> {
    const params = new HttpParams().set('username', username);
    return this.http.delete<void>(
      `${environment.chat_endpoint}/${chatId}/users`,
      { params }
    );
  }
}
