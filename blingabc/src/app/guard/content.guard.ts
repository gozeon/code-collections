import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ENV } from '../services/api.config';
import { Md2Toast } from '../common/toast/toast';

@Injectable()
export class ContentGuard implements CanActivate {
  constructor(private _toast: Md2Toast) {
  }

  canActivate(): boolean {
    // const name = JSON.parse(localStorage.getItem('info')).username;
    // if (ENV === 'dev') {
    //   return true;
    // }
    // if (name === 'crmadmin' || name === 'dujuan' || name === 'zhaoying') {
    //   return true;
    // } else {
    //   this._toast.show('无权限访问!', 1800);
    //   return false;
    // }
    return true;
  }
}
