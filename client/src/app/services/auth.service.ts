import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
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
            ? this.localStorageService.setLocal('token', token)
            : this.localStorageService.setSession('token', token);
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
    this.localStorageService.removeLocal('token');
    this.localStorageService.removeSession('token');
    this.router.navigate(['/auth']);
  }
}
