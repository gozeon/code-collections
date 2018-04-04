import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { tableWidth } from '../../setting';
import * as moment from 'moment';
import { ConferenceService } from '../../../services/conference.service';
import { Md2Toast } from '../../../common/toast/toast';
import { verifyMiddleWare } from '../../../services/base.service';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作', width: tableWidth.number},
    {name: 'year', label: '开售学季'},
    {name: 'beginDate', label: '售卖时间', width: tableWidth.number * 2},
    {name: 'remark', label: '备注', width: tableWidth.number * 2},
    {name: 'state', label: '状态', format: (value => ['未发布', '已发布'][value])},
    {name: 'creatorName', label: '操作人'},
    {name: 'createDate', label: '操作时间', format: value => this.formatTime(value), width: tableWidth.number},
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

    this._conferenceService.getAllDistribution(data).subscribe(result => {
      this.filteredData = result.list;
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

  publish(id): void {
    this._conferenceService.changeDistributionState(id).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('发布成功', 1800);
        this.filter();
      }
    });
  }

  delete(id): void {
    this._conferenceService.deleteDistributionById(id).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('删除成功', 1800);
        this.filter();
      }
    });
  }
}
