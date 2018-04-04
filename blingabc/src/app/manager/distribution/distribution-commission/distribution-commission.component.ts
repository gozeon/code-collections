import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { tableWidth } from '../../setting';
import { formatTime } from '../distribution-withdraw/distribution-withdraw.component';
import { DistributionService } from '../../../services/distribution.service';

@Component({
  selector: 'app-distribution-commission',
  templateUrl: './distribution-commission.component.html',
  styleUrls: ['./distribution-commission.component.scss']
})
export class DistributionCommissionComponent implements OnInit {
  type;
  teacherType;
  time;

  search = {
    businessCode: undefined,
    teacherName: undefined,
    teacherEmail: undefined,
  };

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    // {name: 'id', label: '操作'},

    {name: 'teacherType', label: '用户类型', width: tableWidth.phone, format: value => (['', '分销教师', '代理商'][+value])},
    {name: 'email', label: '邮箱', width: tableWidth.number},
    {name: 'provinceName', label: '省', width: tableWidth.phone},
    {name: 'cityName', label: '市', width: tableWidth.phone},
    {name: 'areaName', label: '区', width: tableWidth.phone},
    {name: 'teacherName', label: '姓名',},
    // {name: 'no', label: '身份证号',},

    {name: 'payStatus', label: '订单状态', format: value => (value ? (['待支付', '已支付', '支付失败', '已退单', '已取消', '部分退单'][+value]) : '')},
    {name: 'businessCode', label: '订单编码', width: tableWidth.number},
    {name: 'realPrice', label: '订单金额',},
    {name: 'detailMoney', label: '佣金金额',},
    {name: 'type', label: '佣金类型', format: value => ['订单收入', '奖金收入', '提现到微信', '转账到银行'][+value % 10]},
    {name: 'remark', label: '备注 ', width: tableWidth.number},
    {name: 'createDate', label: '创建时间', format: value => formatTime(value)},
    {name: 'createUsername', label: '操作人'},
  ];

  constructor(private _distributionService: DistributionService,) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {

    const data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize,
      type: this.type,
      teacherType: this.teacherType,
      selectDate: this.time ? moment(this.time).format('YYYY-MM') : null,
      moneyType: 1
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

  reset() {
    this.time = undefined;
    this.type = undefined;
    this.teacherType = undefined;

    this.search = {
      businessCode: undefined,
      teacherName: undefined,
      teacherEmail: undefined,
    };

    this.filter();
  }

}
