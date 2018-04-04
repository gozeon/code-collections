import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-update-log',
  templateUrl: './update-log.component.html',
  styleUrls: ['./update-log.component.scss']
})
export class UpdateLogComponent implements OnInit {

  logObj: any; // 传过来的数据

  plac = '物流编号';
  isSubmit = true;

  isSelect = false;
  sendStatus: any = [
    { name: '未发货', value: 0 },
    { name: '已发货', value: 1 },
    { name: '现场发货', value: 2 },
  ];
  // 选择的数据
  selectData: any = { orderCode: '', sendStatus: '', logisticsInfo: '', logisticsCode: '' };

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
    this.logObj = data;
    this.logObj.payDate = this.logObj.payDate ? moment(this.logObj.payDate).format('YYYY-MM-DD HH:mm') : '';
    this.selectData.orderCode = data.orderCode;
    this.selectData.sendStatus = data.sendStatus;
    this.selectData.logisticsInfo = data.logisticsInfo;
    this.selectData.logisticsCode = data.logisticsCode ? data.logisticsCode : '';
    this.plac = this.selectData.sendStatus == 1 ? '物流编号(*必填)' : '物流编号';
    if (this.selectData.sendStatus == 1 && this.selectData.logisticsCode.length == 0) {
      this.isSubmit = false;
    } else {
      this.isSubmit = true;
    }
  }

  ngOnInit() { }

  changeSend(ev: any) {
    if (ev.value == 1) {
      this.plac = '物流编号(*必填)';
      this.isSubmit = false;
    } else {
      this.plac = '物流编号';
      this.isSubmit = true;
    }
  }
  changeLog() {
    if (this.selectData.sendStatus == 1 && this.selectData.logisticsCode.length == 0) {
      this.isSubmit = false;
    } else {
      this.isSubmit = true;
    }
  }
}
