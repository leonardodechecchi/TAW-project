import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router
  ) {}

  login(
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
            ? localStorage.setItem('token', JSON.stringify(token))
            : sessionStorage.setItem('token', JSON.stringify(token));
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {
    const body = { username, email, password };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<void>(
      `${environment.auth_endpoint}/register`,
      body,
      options
    );
  }

  logout(): void {
    localStorage.setItem('token', '');
    this.accountService.updateToken('');
    this.router.navigate(['/auth']);
  }
}
