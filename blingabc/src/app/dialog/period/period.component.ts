import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';
import * as moment from 'moment';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {
  date = {
    startAt: undefined,
    endAt: undefined
  };


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<PeriodComponent>,
              private _toast: Md2Toast) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (!this.date.startAt) {
      this._toast.show('请输入开始时间', 1800);
      return;
    }

    if (!this.date.endAt) {
      this._toast.show('请输入结束时间', 1800);
      return;
    }

    if (!moment(this.date.startAt).isBefore(moment(this.date.endAt))) {
      this._toast.show('请输入合理的时间段', 1800);
      return;
    }

    this.dialogRef.close({
      startAt: moment(this.date.startAt).format('x'),
      endAt: moment(this.date.endAt).format('x'),
    });
  }
}
