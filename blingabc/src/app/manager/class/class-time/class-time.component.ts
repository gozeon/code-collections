import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, TdDialogService } from '@covalent/core';

import { BaseService, keyCodetoValue } from './../../../services';
import { formatTimeToZh, formatTimeToNumber, formatTimeArrToZh } from './time.utils';
import { Md2Toast } from '../../../common/toast/toast';

@Component({
  selector: 'app-class-time',
  templateUrl: './class-time.component.html',
  styleUrls: ['./class-time.component.scss']
})
export class ClassTimeComponent implements OnInit {
  selected = { week: '', time: '' };
  times = [];
  weeks = [
    { name: '周一', value: '1' },
    { name: '周二', value: '2' },
    { name: '周三', value: '3' },
    { name: '周四', value: '4' },
    { name: '周五', value: '5' },
    { name: '周六', value: '6' },
    { name: '周日', value: '7' },
  ];
  columns: ITdDataTableColumn[] = [
    { name: 'time', label: '时间', },
    { name: 'id', label: '操作', },
  ];
  data = [];
  id;

  timeslots = [];

  constructor(private _baseService: BaseService, private _toast: Md2Toast, private _dialogService: TdDialogService, ) {
    this._baseService.getAllTimeslots().subscribe(v => this.times = keyCodetoValue(v));
  }

  ngOnInit() {
    this.getAll();
  }

  add(): void {
    if (!this.selected.week || !this.selected.time) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `信息不完整!`,
        closeButton: '确定'
      })
      return;
    }
    this.timeslots = [...new Set(this.timeslots.concat([formatTimeToZh(`${this.selected.week}_${this.selected.time}`)]))];
  }

  submit(): void {
    const data = this.timeslots.map(i => formatTimeToNumber(i)).join(',')
    if (this.id) {
      // update
      this._baseService.updateSchoolTime(this.id, data).subscribe(i => {
        if (i) {
          this._toast.show("修改成功", 1800);
          this.reset();
        } else {
          this._toast.show("修改失败", 1800);
        }
      })
    } else {
      // add
      this._baseService.createSchoolTime(data).subscribe(i => {
        if (i) {
          this._toast.show("添加成功", 1800);
          this.reset();
        } else {
          this._toast.show("添加失败", 1800);
        }
      })
    }
  }

  update(time: any): void {
    this.id = time.id;
    this.timeslots = time.time.split(',');
  }

  getAll(): void {
    this._baseService.getAllTime().subscribe((v: any[]) => {
      this.data = v.map(i => {
        i.time = formatTimeArrToZh(i.schoolTime);
        return i;
      });
    });
  }

  reset(): void {
    this.id = null;
    this.selected = { week: '', time: '' };
    this.timeslots = [];
    this.getAll();
  }
}
