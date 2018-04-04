import { TdDialogService } from '@covalent/core';
import { BtnService } from '../service/btn.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SelectOrderClassComponent } from '../../../dialog/select-order-class/select-order-class.component';
import { SendMessageComponent } from '../../../dialog/send-message/send-message.component';
import { UserService } from '../../../services/user.service';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.scss'],
  // host: {
  //   '[class.special]': 'test',
  //   '[attr.aria-label]': 'true'
  // }
})
export class FindUserComponent implements OnInit, OnDestroy {

  isShow = false;
  isShowBtn = false;

  constructor(private _router: Router, private _dialog: MatDialog, _btnService: BtnService,
    private _dialogService: TdDialogService,
    private _userService: UserService,
    private _toast: Md2Toast) {
    _btnService.change.subscribe((value: boolean) => {
      this.isShow = value;
      this.isShowBtn = Boolean(localStorage.getItem('userInfo'));
    });
  }

  ngOnInit() {
    this.isShowBtn = Boolean(localStorage.getItem('userInfo'));
  }

  ngOnDestroy() {
    localStorage.removeItem('userInfo');
  }

  // 选择班级弹窗
  openOrderDialog() {
    this._dialog.open(SelectOrderClassComponent, { width: '80%', height: '80%' }).afterClosed().subscribe(data => {
      window.localStorage.setItem('stulist', JSON.stringify(data));
      if (data) {
        this._router.navigate(['/main/order/add']);
      }
    });
  }

  openResetPasswordDialog(): void {
    this._dialogService.openConfirm({
      title: `提示`,
      message: `确定重置用户密码，并发送短信给用户？`,
      acceptButton: '确定',
      cancelButton: '取消'
    }).afterClosed().subscribe(r => {
      if (r) {
        // TODO API
        this._userService.resetPasswordByParent(JSON.parse(localStorage.getItem('userInfo')).parentNum)
          .subscribe(result => {
            if (result.code === 200) {
              this._toast.show('重置成功', 1800);
            } else {
              this._toast.show(result.msg, 1800);
            }
          });
      }
    });
  }

  openMessageDialog(): void {
    this._dialog.open(SendMessageComponent, {
      width: '80%',
      height: '80%'
    });
  }
}
