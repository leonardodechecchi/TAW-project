import { Injectable } from '@angular/core';
import { Token } from '../models/Token';
import jwt_decode from 'jwt-decode';
import { UserRoles, UserStatus } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private token: Token;

  constructor() {
    this.token = jwt_decode<Token>(
      localStorage.getItem('token') || sessionStorage.getItem('token')
    );
  }

  /**
   *
   * @returns
   */
  getToken(): Token {
    return this.token;
  }

  /**
   *
   * @param token
   */
  updateToken(token: string): void {
    this.token = jwt_decode<Token>(token);
  }

  /**
   *
   * @returns
   */
  getId(): string {
    return this.token.userId;
  }

  /**
   *
   * @returns
   */
  getUsername(): string {
    return this.token.username;
  }

  /**
   *
   * @returns
   */
  getEmail(): string {
    return this.token.email;
  }

  /**
   *
   * @returns
   */
  getStatus(): string {
    return this.token.status;
  }

  /**
   *
   * @returns
   */
  isAdmin(): boolean {
    for (let idx in this.token.roles) {
      if (this.token.roles[idx] === UserRoles.Admin) return true;
    }
    return false;
  }

  /**
   *
   * @returns
   */
  isModerator(): boolean {
    for (let idx in this.token.roles) {
      if (this.token.roles[idx] === UserRoles.Moderator) return true;
    }
    return false;
  }

  isActive(): boolean {
    return this.token.status === UserStatus.Active ? true : false;
  }
}
