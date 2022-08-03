import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from 'src/environments/environment';

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
  getUsers(moderatorId: string): Observable<User[]> {
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
  deleteUser(moderatorId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.moderator_endpoint}/${moderatorId}/users/${userId}`
    );
  }
}
