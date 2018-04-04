import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, TdDialogService, TdDataTableService,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent
} from '@covalent/core';
import { InteractiveService, appendAll } from './../../../services';
import * as moment from 'moment';
import { tableWidth } from '../../setting';

@Component({
  selector: 'app-learn-record',
  templateUrl: './learn-record.component.html',
  styleUrls: ['./learn-record.component.scss']
})
export class LearnRecordComponent implements OnInit {

  level: any;
  datagramId: any;
  startAt: any;
  endAt: any;
  isShowReset;
  parentMobile;

  infoPkgs: any[] = [];

  filteredData: any[] = [];
  filteredTotal: number;
  fromRow: number = 1;
  initialPage = 1;
  page: number = 1;
  pageSize: number = 30;

  columns: ITdDataTableColumn[] = [
    // { name: 'id', label: 'id', },
    // { name: 'studentName', label: '资料包ID', },
    // { name: 'studentName', label: '学生', },
    { name: 'parentMobile', label: '手机号', },
    { name: 'channel', label: '获客渠道', },
    { name: 'type', label: '适用水平', },
    { name: 'datagramName', label: '课程名称', width: tableWidth.number * 2 },
    { name: 'createAt', label: '创建日期', },
    { name: 'content', label: '学习记录', },
  ];
  constructor(private _interactiveService: InteractiveService, private _dialogService: TdDialogService) { }

  ngOnInit() {
    this._interactiveService.getAllInfoPkgs().subscribe(v => this.infoPkgs = appendAll(v));
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      size: this.pageSize,
      page: this.page,
      type: this.level,
      datagramId: this.datagramId,
      parentMobile: this.parentMobile,
      beginDate: this.startAt ? moment(this.startAt).format('x') : null,
      endDate: this.endAt ? moment(this.endAt).format('x') : null,
    });

    // delete obj key '' | null | undefined
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);

    this._interactiveService.getAllLearnRecord(data).subscribe(v => {
      this.filteredData = v.list.map(i => {
        i.createAt = i.createDate ? moment(i.createDate).format('YYYY-MM-DD') : null;
        i.channel = `${i.channelOneName ? i.channelOneName : ''} ${i.channelTwoName ? i.channelTwoName : ''}`;
        return i;
      });
      this.filteredTotal = v.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  reset(): void {
    this.level = undefined;
    this.datagramId = undefined;
    this.startAt = undefined;
    this.endAt = undefined;
    this.parentMobile = undefined;
    this.isShowReset = false;
    this.filter();
  }

  toFilter(): void {
    if ((this.startAt && this.endAt) || (!this.startAt && !this.endAt)) {
      this.filter();
      this.isShowReset = true;
    } else {
      this.warn('请填写一个时间段');
      return;
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }
}
