import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DeviceService } from '../../services/device.service';
import { verifyMiddleWare } from '../../services';
import * as moment from 'moment';

@Component({
  selector: 'app-problem-record-detail-preview',
  templateUrl: './problem-record-detail-preview.component.html',
  styleUrls: ['./problem-record-detail-preview.component.scss']
})
export class ProblemRecordDetailPreviewComponent implements OnInit {
  detail = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _deviceService: DeviceService,) {
    this._deviceService.getDeviceTaskDeatilByPhone(this.data.telephone).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.detail = Object.assign({}, result.data);
      }
    });
  }

  ngOnInit() {
  }

  formatTime(value: string | number): string {
    if (value) {
      return moment(value).format('YYYY-MM-DD');
    }
    return null;
  }

  formatStatus(n): string {
    if (n) {
      return ['', '正常', '不正常'][n];
    }
    return '';
  }

  /**
   * "[\"FaceTime 高清摄像头（内建）\"]"
   * @param str
   * @returns {string}
   */
  formatArrToStr(str): string {
    const arr = JSON.parse(str);
    return <any>arr.join(',');
  }
}
