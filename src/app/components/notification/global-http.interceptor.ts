import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable() // ok because provided via HTTP_INTERCEPTORS in AppModule
export class GlobalHttpInterceptor implements HttpInterceptor {
  constructor(/* inject only services that are provided (HttpClient, Router, AuthService, etc.) */) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // minimal pass-through implementation
    return next.handle(req);
  }
}
