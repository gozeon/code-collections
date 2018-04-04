import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn,
  IPageChangeEvent,
  ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent
} from '@covalent/core';
import { OrderService } from './../../../services/order.service';
import * as moment from 'moment';
import { MpayStatus, McheckStatus, McouponCode, MChannel } from './../../../models/order';
import { tableWidth } from './../../setting';
import { ClassService } from '../../../services/class.service';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-change-class',
  templateUrl: './change-class.component.html',
  styleUrls: ['./change-class.component.scss']
})
export class ChangeClassComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  classCode: string;
  telephone: string;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'telephone', label: '手机号' },
    { name: 'transferNum', label: '该学季转班次数' },
    { name: 'fromClassCode', label: '转出班级编号' },
    { name: 'toClassCode', label: '转入班级编号' },
    { name: 'toLessonNum', label: '转入课节数' },
    { name: 'transferTypeName', label: '转班类型' },
    { name: 'creatorName', label: '操作人' },
    { name: 'createAt', label: '转班时间' },
  ];

  constructor(private _classService: ClassService, private _toast: Md2Toast) {
  }

  ngOnInit() {
    this.filter();
  }

  // 获取数据 列表 —— 过滤
  filter() {
    const data = Object.assign({}, {
      classCode: this.classCode,
      telephone: this.telephone,
      page: this.page,
      size: this.pageSize,
    });

    this._classService.getAllClassTransferRecords(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        item.createAt = item.createDate ? moment(item.createDate).format('YYYY-MM-DD HH:mm') : null;
        return item;
      });
      this.filteredTotal = result.total;
    });
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  searchNum(telephone: string): void {
    this.telephone = telephone;
    this.filter();
  }

  searchCode(classCode: string): void {
    this.classCode = classCode;
    this.filter();
  }
}
