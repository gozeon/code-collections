import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { appendAll, BaseService } from '../../../services';
import { DeviceService } from '../../../services/device.service';
import * as moment from 'moment';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.scss']
})
export class NewStudentComponent implements OnInit {
  years = [2018, 2019, 2020];
  seasons: any[];
  stages: any[];

  search = {
    term: undefined,
    stage: undefined,
    absent: undefined,
    signUp: undefined,
    classCode: undefined,
    telephone: undefined,
  };

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'classCode', label: '班级编码'},
    {name: 'className', label: '班级名称',},
    {name: 'classStartDate', label: '班级报名时间', format: value => formatTime(value)},
    {name: 'telephone', label: '手机号',},
    {name: 'stuEnName', label: '英文名'},
    {name: 'name', label: '家长姓名'},
    {name: 'signUp', label: '技术服务课', format: value => (['未报名', '已报名'][value])},
    {name: 'absent', label: '出勤', format: value => (['未开课', '正常', '缺勤'][value])},
    // {name: 'time', label: '第一次主课时间'},
  ];

  constructor(private _baseService: BaseService,
              private _deviceService: DeviceService) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(v));
    this._baseService.getAllStages().subscribe(v => this.stages = appendAll(v));
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    const data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize
    });

    this._deviceService.getAllNewStudents(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  reset() {
    this.search = {
      term: undefined,
      stage: undefined,
      absent: undefined,
      signUp: undefined,
      classCode: undefined,
      telephone: undefined,
    };

    this.filter();
  }
}
