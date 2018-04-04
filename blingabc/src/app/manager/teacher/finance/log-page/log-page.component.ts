import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import * as moment from 'moment';
import { ForeignTeacherService } from '../../../../services/foreign-teacher.service';
import { tableWidth } from '../../../setting';

const timeFormat = (value): string => {
  if (value) {
    return moment(value).format('YYYY-MM-DD HH:mm');
  }
  return '';
};

@Component({
  selector: 'app-log-page',
  templateUrl: './log-page.component.html',
  styleUrls: ['./log-page.component.scss']
})
export class LogPageComponent implements OnInit {

  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: `No`},
    {name: 'title', label: `Title`, width: tableWidth.number * 2},
    {name: 'amount', label: 'Amount'},
    {name: 'remark', label: 'Remark', width: tableWidth.number * 2},
    {name: 'operator', label: 'Operator'},
    {name: 'createDate', label: 'Operation Date', format: (value) => timeFormat(value)},
  ];

  feeNum;

  constructor(private _foreignTeacherService: ForeignTeacherService, private _router: ActivatedRoute,) {
    this._router.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this.feeNum = params['id'];
      }});
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      feeNum: this.feeNum
    });

    // TODO API
    this._foreignTeacherService.getAllInsertLog(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }
}
