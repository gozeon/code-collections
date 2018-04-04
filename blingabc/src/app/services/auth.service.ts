import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  logout(): any {
    localStorage.removeItem('info');
  }

  getUser(): any {
    return localStorage.getItem('info');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
