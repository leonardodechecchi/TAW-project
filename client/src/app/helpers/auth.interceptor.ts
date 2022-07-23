import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next.handle(req);
  }
}
