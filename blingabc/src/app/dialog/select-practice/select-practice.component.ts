import { Component, Inject, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { appendAll } from '../../services/index';
import { PracticeService } from '../../services/practice.service';
import { IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { tableWidth } from '../../manager/setting';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export function formatState(value: string | number): string {
  const data = ['未发布', '已发布', '已冻结'];

  return data[+value];
}

export function formatType(value: string | number): string {
  const data = ['', '学故事', '听歌曲', '学制作', '看影片', '互动练习'];

  return data[+value];
}

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-select-practice',
  templateUrl: './select-practice.component.html',
  styleUrls: ['./select-practice.component.scss']
})
export class SelectPracticeComponent implements OnInit {
  seasons: any[];
  levels: any[];
  selected = {
    tearmCode: undefined,
    level: undefined,
    pubStatus: 1,
    bookType: undefined
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
    {name: 'id', label: '操作', width: tableWidth.time},
    {name: 'name', label: '名称', width: tableWidth.number * 2},
    {name: 'remark', label: '备注', width: tableWidth.number},
    {name: 'levelName', label: '适用水平'},
    {name: 'tearmName', label: '适用学季'},
    {name: 'bookType', label: '类型', format: value => formatType(value)},
    {name: 'pubStatus', label: '状态', format: (value) => formatState(value)},
    {name: 'pubDate', label: '发布时间', format: (value) => formatTime(value)},
    {name: 'pubUsername', label: '发布人'},
  ];

  constructor(private _baseService: BaseService,
              private _practiceService: PracticeService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SelectPracticeComponent>) {
    this.initSelect();
  }

  ngOnInit() {
    this.filter();
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectData[0]);
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
      name: this.searchTerm,
      type: 2
    });

    this._practiceService.getAllPractices(data).subscribe(result => {
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
}
