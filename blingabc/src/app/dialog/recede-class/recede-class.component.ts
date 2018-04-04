import { Md2Toast } from '../../common/toast/toast';
import { Component, Inject, OnInit } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClassService } from '../../services/class.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recede-class',
  templateUrl: './recede-class.component.html',
  styleUrls: ['./recede-class.component.scss']
})
export class RecedeClassComponent implements OnInit {
  classCode;
  className;
  shouldNumber;
  realPrice;
  complete = true;
  remark;
  realNumber: any;  // 实退课时数
  refundAmount: any;

  classinfo: any;

  completedLessons: any[] = [];
  completedLessons_backup: any[] = [];
  unCompletedLessons: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<RecedeClassComponent>,
              private _classService: ClassService, private _toast: Md2Toast, private _dialogService: TdDialogService,) {
    this.initPage();
  }

  ngOnInit() {

  }

  initPage(): void {
    this._classService.getClassWithQuiting({orderDetailCode: this.data.orderDetailCode, classCode: this.data.classCode})
    // this._classService.getClassWithQuiting({ orderDetailCode: '11201711153712870511001', classCode: '18W1010L4036' })
      .subscribe(result => {
        if (result.code === 500) {
          this._toast.show('请求数据错误', 1800);
          return;
        }
        this.classCode = result.classCode;
        this.className = result.className;
        this.realPrice = result.realPrice;
        this.shouldNumber = result.shouldNumber;
        this.realNumber = result.realNumber;
        this.refundAmount = result.refundAmount;

        this.completedLessons = result.completedLessons;
        this.completedLessons_backup = JSON.parse(JSON.stringify(result.completedLessons)); // deep copy
        this.unCompletedLessons = result.unCompletedLessons;

        this.classinfo = result;
      });
  }

  calculatePrice(): void {

    this.refundAmount = '计算中...';

    const data = Object.assign({}, {
      orderDetailCode: this.data.orderDetailCode,
      // orderDetailCode: '11201711153712870511001',
      orderLessonIds: (this.completedLessons_backup.map(i => {
        if (i.ifQuit === 10) {
          return i.orderLessonId;
        }
      }).concat(this.unCompletedLessons.map(i => i.orderLessonId))).filter(i => i)
    });

    this._classService.calculatePriceWithQuit(data).subscribe(result => {
      this.refundAmount = result.data;
    });
  }

  onSubmit(): void {

    const data = Object.assign({}, this.classinfo, {
      realNumber: this.realNumber,
      refundAmount: this.refundAmount,
      completedLessons: this.completedLessons_backup,
      remark: this.remark
    });

    this._classService.quiteClass(data).subscribe(result => {
      if (result.code === 200) {
        this.dialogRef.close({code: 200});
      } else {
        this._toast.show(result.msg, 1800);
      }
    });

    // if (+this.shouldNumber === +this.realNumber) {
    //   this._dialogService.openConfirm({
    //     message: '确认退班',
    //     cancelButton: '取消',
    //     acceptButton: '确定'
    //   }).afterClosed().subscribe(r => {
    //     if (r) {
    //       this._classService.quiteClass(data).subscribe(result => {
    //         if (result.code === 200) {
    //           this.dialogRef.close({ code: 200 });
    //         } else {
    //           this._toast.show(result.msg, 1800);
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   this._dialogService.openConfirm({
    //     message: `应退课时数：${this.shouldNumber}, 实退课时数：${this.realNumber}`,
    //     cancelButton: '取消',
    //     acceptButton: '确定'
    //   }).afterClosed().subscribe(r => {
    //     if (r) {
    //       this._classService.quiteClass(data).subscribe(result => {
    //         if (result.code === 200) {
    //           this.dialogRef.close({ code: 200 });
    //         } else {
    //           this._toast.show(result.msg, 1800);
    //         }
    //       });
    //     }
    //   });
    // }
  }

  formatAt(time): string {
    if (time) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    }
    return '';
  }

  onChange(item: any): void {
    this.completedLessons_backup = this.completedLessons_backup.map(i => {
      if (i.lessonId === item.lessonId) {
        i.ifQuit = i.ifQuit === 20 ? i.ifQuit = 10 : i.ifQuit = 20;
      }
      return i;
    });

    this.realNumber = ((this.completedLessons_backup.map(i => {
      if (i.ifQuit === 10) {
        return i.orderLessonId;
      }
    }).concat(this.unCompletedLessons.map(i => i.orderLessonId))).filter(i => i)).length;

    this.calculatePrice();
  }
}
