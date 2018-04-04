import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseService } from '../../services/base.service';
import { appendAll } from '../../services/index';
import { PrepService } from '../../services/prep.service';
import { IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { tableWidth } from '../../manager/setting';
import * as moment from 'moment';

function formatState(value: string | number): string {
  const data = ['未发布', '已发布', '已冻结'];

  return data[+value];
}

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-select-prep',
  templateUrl: './select-prep.component.html',
  styleUrls: ['./select-prep.component.scss']
})
export class SelectPrepComponent implements OnInit {
  seasons: any[] = [];
  levels: any[] = [];
  selected = {
    tearmCode: '',
    level: ''
  };
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 5;
  columns: ITdDataTableColumn[] = [
    // {name: 'id', label: '操作', width: tableWidth.time},
    {name: 'name', label: '预习名称', width: tableWidth.number * 2},
    {name: 'remark', label: '备注', width: tableWidth.number},
    {name: 'levelName', label: '适用水平'},
    {name: 'tearmName', label: '适用学季'},
    // {name: 'pubStatus', label: '状态', format: (value) => formatState(value)},
    {name: 'pubDate', label: '发布时间', format: (value) => formatTime(value)},
    {name: 'pubUsername', label: '发布人'},
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SelectPrepComponent>,
              private _baseService: BaseService,
              private _prepService: PrepService) {
    // console.log(data);
  }

  ngOnInit() {
    this.initSelect();
    this.filter();
  }

  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(v));
  }

  filter(): void {
    const data = Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
      pubStatus: 1,
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

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData = [v.row];
    } else {
      this.selectData = [];
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectData[0]);
  }
}
