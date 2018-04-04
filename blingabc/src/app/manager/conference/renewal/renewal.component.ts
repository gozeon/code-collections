import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { ConferenceService } from '../../../services/conference.service';
import * as moment from 'moment';
import { tableWidth } from '../../setting';
import { Md2Toast } from '../../../common/toast/toast';
import { verifyMiddleWare } from '../../../services/base.service';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作', width: tableWidth.number},
    {name: 'originalYear', label: '原班学季'},
    {name: 'resubmitYear', label: '续班学季'},
    {name: 'originalBeginDate', label: '原班续报时间', width: tableWidth.number * 2},
    {name: 'newBeginDate', label: '非原班续报时间', width: tableWidth.number * 2},
    {name: 'remark', label: '备注', width: tableWidth.number * 2},
    {name: 'state', label: '状态', format: (value => ['未发布', '已发布'][value])},
    {name: 'people', label: '操作人'},
    {name: 'time', label: '操作时间', format: value => this.formatTime(value), width: tableWidth.number},
  ];

  constructor(private _conferenceService: ConferenceService,
              private _toast: Md2Toast) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize
    });

    this._conferenceService.getAllRenewal(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        if (item.updateUserName) {
          item.people = item.updateUserName;
          item.time = item.updateDate;
        } else {
          item.people = item.creatorName;
          item.time = item.createDate;
        }
        return item;
      });
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  formatTime(time): string {
    if (!time) {
      return '';
    }
    return moment(time).format('YYYY-MM-DD: HH:mm');
  }

  delete(id): void {
    this._conferenceService.deleteRenewalById(id).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('删除成功', 1800);
        this.filter();
      }
    });
  }

  publish(id): void {
    this._conferenceService.changeRenewalState(id, 1).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('发布成功', 1800);
        this.filter();
      }
    });
  }
}
