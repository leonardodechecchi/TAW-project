import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  /**
   * Logs in the user.
   * @param email the user email
   * @param password the user password
   * @param remember remember me
   * @returns an Observable of `string`, i.e. the JWT token
   */
  public login(
    email: string,
    password: string,
    remember: boolean
  ): Observable<string> {
    const body = { email, password };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .post<string>(`${environment.auth_endpoint}/login`, body, options)
      .pipe(
        tap((token) => {
          remember
            ? this.localStorageService.setLocal('token', token)
            : this.localStorageService.setSession('token', token);
        })
      );
  }

  /**
   * Create a new user account.
   * @param name the user name
   * @param surname the user surname
   * @param username the user username
   * @param email the user email
   * @param password the user password
   * @returns an empty Observable
   */
  public register(
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    const body = { name, surname, username, email, password };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<void>(
      `${environment.auth_endpoint}/register`,
      body,
      options
    );
  }

  /**
   * Logs out the user deleting the JWT token from local storage.
   */
  public logout(): void {
    this.localStorageService.removeLocal('token');
    this.localStorageService.removeSession('token');
    this.router.navigate(['/auth']);
  }
}
