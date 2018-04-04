import { UpdateLogComponent } from '../../../dialog/update-log/update-log.component';
import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent } from '@covalent/core';
import { OrderService } from './../../../services/order.service';
import * as moment from 'moment';
import { MSendStatus } from './../../../models/order';
import { MatDialog } from '@angular/material';
import { tableWidth } from './../../setting';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-order-log',
  templateUrl: './order-log.component.html',
  styleUrls: ['./order-log.component.scss']
})
export class OrderLogComponent implements OnInit {

  sendStatus = MSendStatus; // 物流状态
  columns = orderColumns; // 表头

  filteredData: any[] = []; // 列表
  page = 1; // 页数
  pageSize = 10; // 一列条数
  dataTotal: number; // 总数
  parentMobile: any = ''; // 家长手机
  // 下拉参数
  send: any = ''; //  mobile: '', orderCode:''
  selectData: any[] = []; // 选中数据
  params = {};
  payStatus = '';

  constructor(private _orderService: OrderService, private _toast: Md2Toast, private _dialog: MatDialog) { }

  ngOnInit() {
    this.filter();
  }

  // 获取数据 列表 —— 过滤
  filter() {
    this._orderService.getOrderLogistics(Object.assign({
      page: this.page,
      size: this.pageSize,
      sendStatus: this.send,
      payStatus: this.payStatus
    }, this.params)).subscribe((v: any) => {
      this.filteredData = v.list;
      this.dataTotal = v.total;
    });

  }

  // 关键字搜索 -- 家长电话号码
  searchNum(num: string): void {
    this.send = '';
    this.params = { mobile: num };
    this.filter();
  }

  searchCode(code: string): void {
    this.send = '';
    this.params = { orderCode: code };
    this.filter();
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.filter();
  }
  // 物流
  openDialog(row) {
    this._dialog.open(UpdateLogComponent, {
      width: '50%',
      data: row,
    }).afterClosed().subscribe(data => {
      if (data) {
        this._orderService.postupdatelog(data).subscribe(v => {
          v.code === '10000' ? this._toast.show(`修改成功`, 1800) : this._toast.show('修改失败', 1800);
        });
      }

    });
  }

}
// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  return v ? moment(v).format('YYYY-MM-DD HH:mm') : '';
};
// 物流状态
const SEND_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['未发货', '已发货', '现场发货'];
  return arr[v];
};
// 成单渠道
const CHANNEL_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['分销', 'CRM内部', '官网', '续报'];
  return arr[v - 10];
};
// 支付状态
const PAYSTATUS_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['待支付', '已支付', '支付失败', '已退单', '已取消', '部分退', '待转账', '手动退款'];
  return arr[v];
};
// 表头
export const orderColumns: ITdDataTableColumn[] = [
  { name: 'id', label: '操作', width: 80 },
  { name: 'orderCode', label: '订单编号', },
  { name: 'orderChannel', label: '成单渠道', format: CHANNEL_FORMAT },
  { name: 'orderPrice', label: '原价' },
  { name: 'realPrice', label: '实付价格', },
  { name: 'payDate', label: '支付时间', format: TIME_FORMAT },
  { name: 'payStatus', label: '支付状态', format: PAYSTATUS_FORMAT },
  { name: 'sendStatus', label: '物流状态', format: SEND_FORMAT },
  { name: 'logisticsCode', label: '物流编号', },
];
