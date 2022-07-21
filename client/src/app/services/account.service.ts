import { Injectable } from '@angular/core';
import { Token } from '../models/Token';
import jwt_decode from 'jwt-decode';
import { UserRoles, UserStatus } from '../models/User';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private tokenSubject: BehaviorSubject<string>;
  public token: Observable<string>;

  constructor() {
    const local =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    this.tokenSubject = new BehaviorSubject<string>(local || '');
    this.token = this.tokenSubject as Observable<string>;
  }

  get tokenValue() {
    return jwt_decode<Token>(this.tokenSubject.value);
  }

  updateToken(token: string): void {
    this.tokenSubject.next(token);
  }

  isAdmin(): boolean {
    for (let idx in this.tokenValue.roles) {
      if (this.tokenValue.roles[idx] === UserRoles.Admin) return true;
    }
    return false;
  }

  isModerator(): boolean {
    for (let idx in this.tokenValue.roles) {
      if (this.tokenValue.roles[idx] === UserRoles.Moderator) return true;
    }
    return false;
  }

  isActive(): boolean {
    return this.tokenValue.status === UserStatus.Active ? true : false;
  }
}