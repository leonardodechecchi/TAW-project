import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Token } from '../models/Token';
import { UserRoles, UserStatus } from '../models/User';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  /**
   * The decoded token
   */
  private token: Token | null;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    const local: string | null = this.localStorageService.get('token');
    local ? this.setToken(local) : null;
  }

  /**
   * Reuturn the token saved in the local storage.
   * @returns the token
   */
  public getToken(): string {
    return this.localStorageService.get('token');
  }

  /**
   * Set and decode the given token.
   * If the given token is invalid, the user must log in again.
   * @param token the token to set
   */
  public setToken(token: string): void {
    try {
      this.token = jwt_decode<Token>(token);
    } catch (err) {
      this.authService.logout();
    }
  }

  /**
   * Get the user id.
   * @returns the user id or undefined if no token found
   */
  public getId(): string | undefined {
    if (!this.token) return;
    return this.token.userId;
  }

  /**
   * Get the user name.
   * @returns the user name or undefined if no token found
   */
  public getName(): string | undefined {
    if (!this.token) return;
    return this.token.name;
  }

  /**
   * Get the user surname.
   * @returns the user surname or undefined if no token found
   */
  public getSurname(): string | undefined {
    if (!this.token) return;
    return this.token.surname;
  }

  /**
   * Get the user username.
   * @returns the user username or undefined if no token found
   */
  public getUsername(): string | undefined {
    if (!this.token) return;
    return this.token.username;
  }

  /**
   * Get the user email.
   * @returns the user email
   */
  public getEmail(): string | undefined {
    if (!this.token) return;
    return this.token.email;
  }

  /**
   * Tell if the user has the admin role.
   * @returns true if the user is an admin, false otherwise
   */
  public isAdmin(): boolean | undefined {
    if (!this.token) return;
    for (let idx in this.token.roles) {
      if (this.token.roles[idx] === UserRoles.Admin) return true;
    }
    return false;
  }

  /**
   * Tell if the user has the moderator role.
   * @returns true if the user is a moderator, false otherwise
   */
  public isModerator(): boolean | undefined {
    if (!this.token) return;
    for (let idx in this.token.roles) {
      if (this.token.roles[idx] === UserRoles.Moderator) return true;
    }
    return false;
  }

  /**
   * Tell if the user has an active account.
   * @returns true if the the user account is active, false otherwise
   */
  public isActive(): boolean | undefined {
    if (!this.token) return;
    return this.token.status === UserStatus.Active ? true : false;
  }

  /**
   * Tell if the token is valid.
   * @returns true if the token is valid or false if it does not exists
   * or if it has expired
   */
  public isTokenValid(): boolean {
    if (!this.token) return false;
    return Date.now() < this.token.exp * 1000 ? true : false;
  }
}
