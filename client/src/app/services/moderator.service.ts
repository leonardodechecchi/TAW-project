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
   *
   * @param moderatorId
   * @returns
   */
  getUsers(moderatorId: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.moderator_endpoint}/${moderatorId}/users`
    );
  }

  // TODO
  deleteUser(moderatorId: string, userId: string) {}
}
