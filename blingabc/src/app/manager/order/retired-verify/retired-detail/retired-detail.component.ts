import { TdLoadingService, TdDialogService } from '@covalent/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ClassService } from '../../../../services/class.service';
import { Md2Toast } from '../../../../common/toast/index';
import { verifyMiddleWare } from '../../../../services';
import { CheckQuiteClassAccountComponent } from '../../../../dialog/check-quite-class-account/check-quite-class-account.component';

@Component({
  selector: 'app-retired-detail',
  templateUrl: './retired-detail.component.html',
  styleUrls: ['./retired-detail.component.scss']
})
export class RetiredDetailComponent implements OnInit {
  id;
  stuName;
  parentName;
  telephone;
  createDate;
  submitterName;

  classCode; // 班级编号
  className; // 班级名
  shouldNumber; // 应退课时数
  realPrice;  // 实付金额
  complete = true;
  remark;
  realNumber: any;  // 实退课时数
  refundAmount: any; // 退班金额
  reviewState;

  completedLessons: any[] = [];
  unCompletedLessons: any[] = [];

  selectDisabled = false;
  r: any = {
    url: '',
    text: ''
  };

  constructor(private _dialog: MatDialog,
              private _route: ActivatedRoute,
              private _router: Router,
              private _classService: ClassService,
              private _toast: Md2Toast,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {
    if (this._route.snapshot.data['type'] === 'retired-class') {
      this.r = {
        url: '/main/order/retired-class',
        text: '退班列表'
      };
    } else {
      this.r = {
        url: '/main/order/retired-verify',
        text: '退班审核列表'
      };
    }
  }

  ngOnInit() {
    this.initPage();
  }

  initPage(): void {
    this._route.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        this._classService.getQuiteClassWithVerifingById(parms['id']).subscribe(result => {
          this.id = result.id;
          this.classCode = result.classCode;
          this.className = result.className;
          this.realPrice = result.realPrice;
          this.shouldNumber = result.shouldNumber;
          this.realNumber = result.realNumber;
          this.refundAmount = result.refundAmount;
          this.remark = result.remark;
          this.completedLessons = result.completedLessons;
          this.unCompletedLessons = result.unCompletedLessons;

          this.stuName = result.stuName;
          this.parentName = result.parentName;
          this.telephone = result.telephone;
          this.createDate = result.createDate;
          this.submitterName = result.submitterName;

          this.reviewState = '' + result.reviewState;

          if (this._route.snapshot.data['type'] === 'retired-class') {
            if (+result.reviewState !== 10) {
              this.selectDisabled = true;
            }
          }
        });
      }
    });
  }

  formatAt(time): string {
    if (time) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    }
    return '';
  }

  onSubmit(): void {
    const data = Object.assign({}, {
      id: this.id,
      reviewState: this.reviewState
    });

    if (+this.reviewState === 20) {
      if (+this.shouldNumber === +this.realNumber) {
        this._dialogService.openConfirm({
          message: '确认退班',
          cancelButton: '取消',
          acceptButton: '确定'
        }).afterClosed().subscribe(r => {
          if (r) {
            this._loadingService.register();
            this._classService.reviewQuiteClass(data).subscribe(result => {
              this._loadingService.resolve();
              if (verifyMiddleWare(result)) {
                if (result.data && result.data.hasOwnProperty('classQuitId')) {
                  this._dialog.open(CheckQuiteClassAccountComponent, {data: result.data}).afterClosed().subscribe(dialogR => {
                    if (dialogR) {
                      this._toast.show('修改成功', 1800);
                      if (this._route.snapshot.data['type'] === 'retired-class') {
                        this._router.navigate(['/main/order/retired-class']);
                      } else {
                        this._router.navigate(['/main/order/retired-verify']);
                      }
                    }
                  });
                } else {
                  this._toast.show('修改成功', 1800);
                  if (this._route.snapshot.data['type'] === 'retired-class') {
                    this._router.navigate(['/main/order/retired-class']);
                  } else {
                    this._router.navigate(['/main/order/retired-verify']);
                  }
                }
              }
            });
          }
        });
      } else {
        this._dialogService.openConfirm({
          message: `应退课时数：${this.shouldNumber}, 实退课时数：${this.realNumber}`,
          cancelButton: '取消',
          acceptButton: '确定'
        }).afterClosed().subscribe(r => {
          if (r) {
            this._loadingService.register();
            this._classService.reviewQuiteClass(data).subscribe(result => {
              this._loadingService.resolve();
              if (verifyMiddleWare(result)) {
                if (result.data && result.data.hasOwnProperty('classQuitId')) {
                  this._dialog.open(CheckQuiteClassAccountComponent, {data: result.data}).afterClosed().subscribe(dialogR => {
                    if (dialogR) {
                      this._toast.show('修改成功', 1800);
                      if (this._route.snapshot.data['type'] === 'retired-class') {
                        this._router.navigate(['/main/order/retired-class']);
                      } else {
                        this._router.navigate(['/main/order/retired-verify']);
                      }
                    }
                  });
                } else {
                  this._toast.show('修改成功', 1800);
                  if (this._route.snapshot.data['type'] === 'retired-class') {
                    this._router.navigate(['/main/order/retired-class']);
                  } else {
                    this._router.navigate(['/main/order/retired-verify']);
                  }
                }
              }
            });
          }
        });
      }
    } else {
      // TODO API
      this._loadingService.register();
      this._classService.reviewQuiteClass(data).subscribe(result => {
        this._loadingService.resolve();
        if (verifyMiddleWare(result)) {
          if (result.data && result.data.hasOwnProperty('classQuitId')) {
            this._dialog.open(CheckQuiteClassAccountComponent, {data: result.data}).afterClosed().subscribe(dialogR => {
              if (dialogR) {
                this._toast.show('修改成功', 1800);
                if (this._route.snapshot.data['type'] === 'retired-class') {
                  this._router.navigate(['/main/order/retired-class']);
                } else {
                  this._router.navigate(['/main/order/retired-verify']);
                }
              }
            });
          } else {
            this._toast.show('修改成功', 1800);
            if (this._route.snapshot.data['type'] === 'retired-class') {
              this._router.navigate(['/main/order/retired-class']);
            } else {
              this._router.navigate(['/main/order/retired-verify']);
            }
          }
        }
      });
    }
  }
}
