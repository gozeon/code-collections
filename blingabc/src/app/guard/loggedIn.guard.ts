import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private _router: Router, ) { }

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this._router.navigate(['/login']);
    }
    return this.authService.isLoggedIn();
  }
}
