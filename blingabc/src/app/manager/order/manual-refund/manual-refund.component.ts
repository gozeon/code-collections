import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { ClassService, verifyMiddleWare } from '../../../services';
import { tableWidth } from '../../setting';
import * as moment from 'moment';
import { Md2Toast } from '../../../common/toast';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
  return null;
}

@Component({
  selector: 'app-manual-refund',
  templateUrl: './manual-refund.component.html',
  styleUrls: ['./manual-refund.component.scss']
})
export class ManualRefundComponent implements OnInit {
  search = {
    account: undefined,
    orderCode: undefined,
  };

  state;
  reviewer;

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '状态变更'},
    {name: 'account', label: '转账账号'},
    {name: 'parentName', label: '家长姓名'},
    {name: 'refundChannel', label: '退款途径', format: value => (['', '微信', '支付宝'][+value])},
    {name: 'refundAmount', label: '金额'},
    {name: 'orderCode', label: '订单编号', width: tableWidth.number},
    {name: 'reviewerName', label: '提交人'},
    {name: 'reviewTime', label: '审核通过时间', format: value => formatTime(value)},
  ];

  constructor(private _classService: ClassService,
              private _toast: Md2Toast) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize,
      state: this.state ? 0 : null,
      reviewer: this.reviewer ? JSON.parse(localStorage.getItem('info')).id : null
    });

    this._classService.getAllManualRefund(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  changeState(row: any): void {
    const data = Object.assign({}, {
      id: row.id,
      state: row.state ? 0 : 1
    });
    this._classService.changeManualRefundState(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('修改成功', 1800);
        this.filter();
      }
    });
  }

}
