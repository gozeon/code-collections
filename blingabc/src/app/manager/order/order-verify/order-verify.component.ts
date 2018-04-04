import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent } from '@covalent/core';
import { OrderService } from './../../../services/order.service';
import * as moment from 'moment';
import { MpayStatus, McheckStatus, McouponCode, MChannel } from './../../../models/order';
import { tableWidth } from './../../setting';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-order-verify',
  templateUrl: './order-verify.component.html',
  styleUrls: ['./order-verify.component.scss']
})
export class OrderVerifyComponent implements OnInit {


  payStatus = MpayStatus; // 支付状态
  checkStatus = McheckStatus; // 审核状态
  minusStatus = McouponCode; // 优惠券状态
  orderChannel = MChannel; // 成单渠道

  columns = orderColumns; // 表头

  filteredData: any[] = []; // 列表
  page = 1; // 页数
  pageSize = 10; // 一列条数
  dataTotal: number; // 总数
  // parentMobile: any = '';// 家长手机
  // 下拉参数
  selected = { payStatus: '', checkStatus: '', minusStatus: '', orderChannel: '' };
  selectData: any[] = []; // 选中数据
  params = {};

  constructor(private _orderService: OrderService, private _toast: Md2Toast) { }

  ngOnInit() {
    this.params = this.selected;
    this.filter();
  }

  // 获取数据 列表 —— 过滤
  filter() {
    this._orderService.getOrderlist(Object.assign({
      page: this.page,
      size: this.pageSize,
    }, this.selected, this.params)).subscribe((v: any) => {
      this.filteredData = v.list;
      this.dataTotal = v.total;
    });
  }
  select() {
    // this.params = this.selected;
    this.filter();
  }
  // 关键字搜索 -- 家长电话号码
  search(keyword: any) {
    this.selected = { payStatus: '', checkStatus: '', minusStatus: '', orderChannel: '' };
    this.params = { parentMobile: keyword };
    this.filter();
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.filter();
  }

}
// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  return v ? moment(v).format('YYYY-MM-DD HH:mm') : '';
};
// 审核状态
const CHECK_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['待审核', '审核通过', '驳回', '审核取消'];
  return arr[v];
};
// 支付状态
const ORDER_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['待支付', '已支付', '支付失败', '已退单', '已取消', '部分退', '待转账', '手动退款'];
  return arr[v];
};
// 成单渠道
const CHANNEL_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['分销', 'CRM内部', '官网', '续报'];
  return arr[v - 10];
};
// 表头
export const orderColumns: ITdDataTableColumn[] = [
  { name: 'id', label: '操作', width: 80 },
  { name: 'orderCode', label: '订单编号', width: tableWidth.number },
  { name: 'payStatus', label: '支付状态', format: ORDER_FORMAT },
  { name: 'parentMobile', label: '手机号', width: tableWidth.phone },
  { name: 'checkStatus', label: '审核状态', format: CHECK_FORMAT },
  { name: 'orderChannel', label: '成单渠道', format: CHANNEL_FORMAT },
  { name: 'userCode', label: '提交人', },
  { name: 'orderPrice', label: '原价', },
  { name: 'realPrice', label: '应付价格', },
  { name: 'sendTotalCouponPrice', label: '发放优惠券', },
  { name: 'createDate', label: '创建时间', format: TIME_FORMAT, width: tableWidth.time },
  { name: 'payDate', label: '支付时间', format: TIME_FORMAT, width: tableWidth.time },
];
