import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

import {TdLoadingService} from '@covalent/core';
import {CRMUserService} from '../services';
import { Md2Toast } from '../common/toast/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  username: string;
  password: string;

  // 维护状态
  isMaintain = false;

  constructor(private _router: Router, private _cRMUserService: CRMUserService,
              private _loadingService: TdLoadingService, private _toast: Md2Toast,
              private _titleService: Title, private fb: FormBuilder) {
    this.form = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    localStorage.clear();
  }

  onSubmit(): void {
    // TODO API
    this._loadingService.register();
    if (this.isMaintain) {
      if (this.form.value.username === 'test' && this.form.value.password === 'test') {
        localStorage.setItem('info', JSON.stringify({
          id: 8,
          username: 'test',
          name: 'test',
          email: 'test@test.com',
          phone: '18611854731'
        }));
        this.success();
      } else {
        this.error('系统正在维护');
      }
    } else {
      this._cRMUserService.login(this.form.value).subscribe(data => {
        if (data.code === '10000' && data.msg === 'ok') {
          localStorage.setItem('info', JSON.stringify(data.data));
          this.success();
        } else {
          this.error(data.msg);
        }
      });
    }
  }

  success(): void {
    this._loadingService.resolve();
    this._router.navigate(['/']);
  }

  error(msg: string): void {
    this._loadingService.resolve();
    this._toast.show(msg, 1800);
  }
}
