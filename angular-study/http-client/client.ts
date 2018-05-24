import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import { _throw } from 'rxjs/observable/throw';
import 'rxjs/add/observable/of';

/**
 * how to use httpClient
 * @link https://angular.io/guide/http
 */

@Injectable()
export class Client {

  constructor(private  http: HttpClient) {
  }

  getStages(): Observable<any> {
    return this.http.get('*url*');
  }
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({headers: req.headers.set('authorization', '**')});
    return next.handle(authReq);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .catch(err => {
        let errMsg: string;
        if (err instanceof HttpErrorResponse) {
          const msg = err.message || JSON.stringify(err.error);
          errMsg = `${err.status} - ${err.statusText || ''} Details: ${msg}`;
        } else {
          errMsg = err.message ? err.message : err.toString();
        }
        console.log(errMsg);
        return _throw(errMsg);
        // return next.handle(req);
      });
  }
}

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .do(
        event => {
          if (event instanceof HttpResponse) {
            console.log(event);
          }
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            console.log(err);
          }
        }
      );
  }
}
