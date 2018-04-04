import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { tableWidth } from '../../manager/setting';
import * as moment from 'moment';
import { DistributionService } from '../../services/distribution.service';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-distribution-teacher-account-preview',
  templateUrl: './distribution-teacher-account-preview.component.html',
  styleUrls: ['./distribution-teacher-account-preview.component.scss']
})
export class DistributionTeacherAccountPreviewComponent implements OnInit {
  type;
  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'teacherType', label: '类型', width: tableWidth.phone, format: value => (['', '分销教师', '代理商'][+value])},
    {name: 'detailMoney', label: '金额',},
    {name: 'businessCode', label: '账单编号', width: tableWidth.number},
    {name: 'remark', label: '备注 ', width: tableWidth.number},
    {name: 'createDate', label: '提现时间', format: value => formatTime(value)},

  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _distributionService: DistributionService,) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {

    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      type: this.type,
      teacherId: this.data.id
    });

    this._distributionService.getAllTeacherAccount(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

}
