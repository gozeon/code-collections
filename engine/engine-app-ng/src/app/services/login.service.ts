import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

export class LoginData {
  usename: string;
  password: string;
}

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(data: LoginData): Promise<void> {
    return this.http.post('http://engine.gagogroup.cn/api/v1/login', JSON.stringify(data))
    .toPromise()
    .then(res => res.json().data)
    .then(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
