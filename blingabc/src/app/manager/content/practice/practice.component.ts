import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { appendAll } from '../../../services/index';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent
} from '@covalent/core';
import { tableWidth } from '../../setting';
import * as moment from 'moment';
import { PracticeService } from '../../../services/practice.service';
import { Md2Toast } from '../../../common/toast/toast';
import { HomeworkService } from '../../../services/homework.service';

export function formatState(value: string | number): string {
  const data = ['未发布', '已发布', '已冻结'];

  return data[+value];
}

export function formatType(value: string | number): string {
  const data = ['', '学故事', '听歌曲', '学制作', '看影片', '互动练习', '学童谣'];

  return data[+value];
}

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  seasons: any[];
  levels: any[];
  selected = {
    tearmCode: undefined,
    level: undefined,
    pubStatus: undefined,
    bookType: undefined
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
              private _toast: Md2Toast,
              private _homeworkService: HomeworkService) {
    this.initSelect();
  }


  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(v));
  }

  ngOnInit() {
    this.filter();
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

  publishAll(): void {
    if (this.checkState(this.selectData)) {
      this._toast.show('存在已发布数据, 请重新选择', 1800);
      return;
    }

    // TODO API
    this._homeworkService.publishAll(this.selectData.map(i => i.homeworkId)).subscribe(result => {
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
      this._practiceService.updatePubStatus(id, pubStatus).subscribe(result => {
        if (result.code === 200) {
          this.filter();
          this._toast.show('修改成功', 1800);
        }
      });
    }
  }

  preview(row): void {
    const parser = document.createElement('a');
    parser.href = row.contentUrl;
    const assetHost = parser.protocol + '//' + parser.host;
    const uri = `${row.contentUrl}?endpoint=${assetHost}/data/xAPI&actor={%22mbox%22:[%22mailto:ricardo.allen@1on1ts.com%22],%22name%22:[%22Ricardo%22]}&auth=Basic%20YmM5NDgxYjVhOTIwYzVkMGRiOThlNjI4OWI1MGUyZTg0Y2I4NzhiMzowYjI0OGFhNTAzZDcxM2ViMTJlZDgzZjQxMjgxZTM0NjIxM`;
    window.open(uri, '_blank');
  }
}
