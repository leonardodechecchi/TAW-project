import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(
    email: string,
    password: string,
    remember: boolean
  ): Observable<string> {}

  register(
    username: string,
    email: string,
    password: string
  ): Observable<void> {}

  logout(): void {
    localStorage.setItem('token', '');
    this.router.navigate(['/login']);
  }
}
