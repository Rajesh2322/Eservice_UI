import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');
    if (req.url.endsWith('/user/login')) {
      return next.handle(req);
    }

    // if (req.url.endsWith('/user/login')) {
    //   return next.handle(req);
    // }

    let jwtToken = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
    return next.handle(jwtToken);
  }
}
