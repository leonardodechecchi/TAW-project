import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(userId: string) {}

  getUsers(userIds: string[]) {}

  modifiyPassword(password: string) {}

  updateUserStats(stats: {}) {}
}
