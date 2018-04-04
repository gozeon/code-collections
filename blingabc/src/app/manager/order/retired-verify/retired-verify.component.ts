import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn,
  IPageChangeEvent,
} from '@covalent/core';
import { MatDialog } from '@angular/material';
import { ClassService } from '../../../services/class.service';
import * as moment from 'moment';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-retired-verify',
  templateUrl: './retired-verify.component.html',
  styleUrls: ['./retired-verify.component.scss']
})
export class RetiredVerifyComponent implements OnInit {
  ifSpecial;
  classCode;
  telephone;

  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'ifSpecialName', label: '是否特殊退班'},
    {name: 'telephone', label: '手机号'},
    {name: 'classCode', label: '班级编号'},
    {name: 'className', label: '班级名称'},
    {name: 'shouldNumber', label: '应退课时数'},
    {name: 'realNumber', label: '实退课时数'},
    {name: 'refundAmount', label: '退款金额'},
    {name: 'submitterName', label: '提交人'},
    {name: 'createAt', label: '提交时间'},
    {name: 'nextStartAt', label: '下次上课时间'},
  ];

  constructor(private _classService: ClassService, private _toast: Md2Toast, private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.filter();
  }

  // 获取数据 列表 —— 过滤
  filter() {
    const data = Object.assign({}, {
      size: this.pageSize,
      page: this.page,
      ifSpecial: this.ifSpecial,
      telephone: this.telephone,
      classCode: this.classCode,
    });

    // TODO API
    this._classService.getQuiteClassWithVerifing(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list.filter(item => {
        item.createAt = item.createDate ? moment(item.createDate).format('YYYY-MM-DD HH:mm') : null;
        item.nextStartAt = item.nextBeginDate ? moment(item.nextBeginDate).format('YYYY-MM-DD HH:mm') : null;
        return item;
      });
    });
  }

// 关键字搜索 -- 家长电话号码
  searchNum(num: string): void {
    this.telephone = num;
    this.filter();
  }

  searchCode(code: string): void {
    this.classCode = code;
    this.filter();
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.filter();
  }
}
