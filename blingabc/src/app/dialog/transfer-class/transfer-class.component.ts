import { Md2Toast } from '../../common/toast/toast';
import { Component, Inject, OnInit } from '@angular/core';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent, TdDialogService, TdLoadingService
} from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { appendAll, keyCodetoValue } from '../../services/index';
import { BaseService } from '../../services/base.service';
import { formatTimeArrToZh, formatTimeToZh } from '../../manager/class/class-time/time.utils';
import { ClassService } from '../../services/class.service';
import * as moment from 'moment';

@Component({
  selector: 'app-transfer-class',
  templateUrl: './transfer-class.component.html',
  styleUrls: ['./transfer-class.component.scss']
})
export class TransferClassComponent implements OnInit {
  levels: any[];
  times: any[] = [];
  selected = {level: undefined, classCode: undefined, schoolTimeId: undefined, distribution: undefined};
  columns: ITdDataTableColumn[] = [
    {name: 'classCode', label: '班级编号'},
    {name: 'className', label: '班级名称'},
    {name: 'foreighTeacherName', label: '外教姓名'},
    {name: 'stageName', label: '期'},
    {name: 'schoolTimeFormat', label: '上课时间'},
    {name: 'startAt', label: '最近待上时间'},
    {name: 'lessonNum', label: '最近待上课节'},
    {name: 'liveCurrentContain', label: '已报人数'},
  ];
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  selectData: any[] = [];
  distributions: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TransferClassComponent>,
              private _baseService: BaseService, private _classService: ClassService, private _dialogService: TdDialogService,
              private _toast: Md2Toast, private _loadingService: TdLoadingService) {
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(keyCodetoValue(v)));
    this._baseService.getAllTime().subscribe(v => {
      this.times = appendAll(v.map(i => {
        i.name = formatTimeArrToZh(i.schoolTime);
        return i;
      }));
    });
    this._baseService.getAllDistributions().subscribe(v => this.distributions = appendAll(v));
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
      fromClassCode: this.data.classCode,
      lessonNum: this.data.lessonNum,
    });

    this._classService.getClassWithPending(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        item.startAt = item.beginDate ? moment(item.beginDate).format('YYYY-MM-DD HH:mm') : null;
        item.schoolTimeFormat = item.schoolTime ? formatTimeArrToZh(item.schoolTime) : null;
        return item;
      });
      this.filteredTotal = result.total;
    });

  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  searchClassCode(value): void {
    this.selected.classCode = value;
    this.filter();
  }

  selectAllEvent(v: ITdDataTableSelectAllEvent): void {
    if (v.selected) {
      this.selectData = [...new Set(this.selectData.concat(v.rows))];
    } else {
      for (let i = 0; i < v.rows.length; i++) {
        this.selectData = this.selectData.filter(item => {
          return item.id !== v.rows[i].id;
        });
      }
    }
  }

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData = [].concat(v.row);
    } else {
      this.selectData = [];
    }
  }

  onSubmit(): void {
    const data = Object.assign({}, {
      stuNum: this.data.stuNum,
      fromClassCode: this.data.classCode,
      toClassCode: this.selectData[0].classCode,
      toLessonNum: this.data.lessonNum,
      orderCode: this.data.orderCode,
      orderDetailCode: this.data.orderDetailCode
    });

    this._loadingService.register();
    if (this.data.ifSpecialTransfer && this.data.clickType === 'special') {
      data.toLessonNum = 1;
      this._classService.transferClassWithSpecial(data).subscribe(r => {
        this._loadingService.resolve();
        if (r.code === 200) {
          this.dialogRef.close(r);
        } else {
          this._toast.show(r.msg, 1800);
        }
      });
    } else {
      this._classService.transferClass(data).subscribe(r => {
        this._loadingService.resolve();
        if (r.code === 200) {
          this.dialogRef.close(r);
        } else {
          this._toast.show(r.msg, 1800);
        }
      });
    }
  }
}
