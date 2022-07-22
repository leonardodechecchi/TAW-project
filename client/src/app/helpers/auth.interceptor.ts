import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') || '';
    req = req.clone({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
    });
    console.log(req);
    return next.handle(req);
  }
}
