import { Component, OnInit } from '@angular/core';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent
} from '@covalent/core';
import { PrepService } from '../../../services/prep.service';
import { tableWidth } from '../../setting';
import { appendAll, BaseService, keyCodetoValue } from '../../../services/index';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../common/toast/index';
import { PrepPreviewComponent } from '../../../dialog/prep-preview/prep-preview.component';
import { MatDialog } from '@angular/material';
import { PeriodComponent } from '../../../dialog/period/period.component';

function formatState(value: string | number): string {
  const data = ['未发布', '已发布', '已冻结'];

  return data[+value];
}

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-prep',
  templateUrl: './prep.component.html',
  styleUrls: ['./prep.component.scss']
})
export class PrepComponent implements OnInit {
  seasons: any[];
  levels: any[];
  selected = {
    tearmCode: undefined,
    level: undefined,
    pubStatus: undefined
  };
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作', width: tableWidth.time},
    {name: 'name', label: '预习名称', width: tableWidth.number * 2},
    {name: 'remark', label: '备注', width: tableWidth.number},
    {name: 'levelName', label: '适用水平'},
    {name: 'tearmName', label: '适用学季'},
    {name: 'pubStatus', label: '状态', format: (value) => formatState(value)},
    {name: 'pubDate', label: '发布时间', format: (value) => formatTime(value)},
    {name: 'pubUsername', label: '发布人'},
  ];

  constructor(private _prepService: PrepService,
              private _baseService: BaseService,
              private _toast: Md2Toast,
              private router: Router,
              private _dialog: MatDialog) {
    this.initSelect();
  }

  ngOnInit() {
    this.filter();
  }

  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(v));
  }

  filter(): void {
    this.selectData = [];

    const data = Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
      name: this.searchTerm
    });

    this._prepService.getAllPreviews(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

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
      this.selectData.push(v.row);
    } else {
      this.selectData = this.selectData.filter(item => item.id !== v.row.id);
    }
  }

  reset(): void {
    this.selected = {
      tearmCode: undefined,
      level: undefined,
      pubStatus: undefined
    };

    this.searchTerm = '';

    this.filter();
  }

  updateState(type: string, id): void {
    let pubStatus;
    switch (type) {
      case 'free':
      case 'publish':
        pubStatus = 1;
        break;
      case 'freeze':
        pubStatus = 2;
        break;
      default:
        break;
    }
    if (pubStatus) {
      this._prepService.updatePubStatus(id, pubStatus).subscribe(result => {
        if (result.code === 200) {
          this.filter();
          this._toast.show('修改成功', 1800);
        }
      });
    }
  }

  goDetail(row): void {
    localStorage.setItem('prep', JSON.stringify(row));
    this.router.navigate(['/main/content/prep/detail/', row.id]);
  }

  publishAll(): void {
    if (this.checkState(this.selectData)) {
      this._toast.show('存在已发布数据, 请重新选择', 1800);
      return;
    }

    this._prepService.publishAll(this.selectData.map(i => i.id)).subscribe(result => {
      if (result.code === 200) {
        this.filter();
        this._toast.show('修改成功', 1800);
      }
    });
  }

  checkState(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].pubStatus !== 0)) {
        return true;
      }
    }
  }

  preview(row: any): void {
    this._dialog.open(PrepPreviewComponent, {width: '960px', height: '500px', data: row}).afterClosed().subscribe();
  }

  openPeriodDialog(): void {
    this._dialog.open(PeriodComponent).afterClosed().subscribe(period => {
      if (period) {
        this._prepService.export(period.startAt, period.endAt);
      }
    });
  }
}
