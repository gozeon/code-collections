import { Component, OnInit } from '@angular/core';
import { appendAll, BaseService, verifyMiddleWare } from '../../../services';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { tableWidth } from '../../setting';
import * as moment from 'moment';
import { FreshmanGuidanceService } from '../../../services/freshman-guidance.service';
import { Md2Toast } from '../../../common/toast';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-freshman-guidance-config',
  templateUrl: './freshman-guidance-config.component.html',
  styleUrls: ['./freshman-guidance-config.component.scss']
})
export class FreshmanGuidanceConfigComponent implements OnInit {
  seasons: any[];
  stages: any[];
  selected = {
    term: undefined,
    stage: undefined,
  };

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作', width: tableWidth.time},
    {name: 'year', label: '年份',},
    {name: 'term', label: '学季',},
    {name: 'stage', label: '期'},
    {name: 'time', label: '通知时间'},
  ];

  constructor(private _baseService: BaseService,
              private _FreshmanGuidanceService: FreshmanGuidanceService,
              private _toast: Md2Toast,) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(v));
    this._baseService.getAllStages().subscribe(v => this.stages = appendAll(v));
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize
    });

    this._FreshmanGuidanceService.getAllFreshmanGuidances(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        item.time = `${formatTime(item.startDate)}至${formatTime(item.endDate)}`;
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

  delete(id):void {
    this._FreshmanGuidanceService.deleteFreshmanGuidanceById(id).subscribe(result => {
      if(verifyMiddleWare(result)) {
        this._toast.show('删除成功');
      }
      this.filter();
    });
  }
}
