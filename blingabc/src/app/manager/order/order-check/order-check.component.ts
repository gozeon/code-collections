import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent } from '@covalent/core';
import { OrderService } from './../../../services/order.service';
import * as moment from 'moment';
import { MpayStatus, McheckStatus, McouponCode, MChannel } from './../../../models/order';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-order-check',
  templateUrl: './order-check.component.html',
  styleUrls: ['./order-check.component.scss']
})
export class OrderCheckComponent implements OnInit {


  checkStatus = [
    { name: '不限', value: '' },
    { name: '待审核', value: 0 },
    { name: '审核通过', value: 1 },
    // { name: '驳回', value: 2 },
  ];// 审核状态
  minusStatus = McouponCode;// 优惠券状态

  columns = orderColumns;// 表头

  filteredData: any[] = [];// 列表
  page: number = 1;// 页数
  pageSize: number = 10;// 一列条数
  dataTotal: number;// 总数
  parentMobile: any = '';// 家长手机
  // 下拉参数
  // private selected = {checkStatus: '', minusStatus: ''};
  minus: any = '';
  check: any = '';
  selectData: any[] = [];// 选中数据
  params = {};

  constructor(private _orderService: OrderService, private _toast: Md2Toast) { }

  ngOnInit() {
    this.filter()
  }

  // 获取数据 列表 —— 过滤
  filter() {
    this._orderService.getOrderlist(Object.assign({
      page: this.page,
      size: this.pageSize,
      checkStatusStr: 10,
      minusStatus: this.minus,
      orderChannel:11,
      payStatus: 0,
    }, this.params)).subscribe((v: any) => {
      this.filteredData = v.list;
      this.dataTotal = v.total;
    });
  }
  selectCheckStatus(ev) {
    if (ev.value === '') {
      this.filter();
    } else {
      this.params = { checkStatus: this.check };
      this.filter();
    }
  }

  // 关键字搜索 -- 家长电话号码
  search(keyword: any) {
    this.minus = '';
    this.check = '';
    this.params = { parentMobile: keyword };
    this.filter();
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.filter()
  }
  // 全选
  selectAllEvent(v: ITdDataTableSelectAllEvent): void {
    if (v.selected) {
      this.selectData = v.rows;
    } else {
      for (let i = 0; i < v.rows.length; i++) {
        this.selectData = this.selectData.filter(item => {
          return item.orderCode !== v.rows[i].orderCode;
        });
      }
    }
  }
  // 单选
  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData.push(v.row);
    }
    else {
      this.selectData = this.selectData.filter(item => item.orderCode !== v.row.orderCode)
    }
  }

  // 批量通过
  postOrderCheck(ev) {
    this._orderService.postOrderCheck({
      ids: this.selectData.map(item => {
        return item.id;
      }),// 订单ID
      checkStatus: ev,// 审核状态
      checkUserId: 1,// 审核人
    }).subscribe(v => {
      this.selectData = [];
      if (v.code == '10000') {
        this._toast.show(`批量操作成功`, 1800);
        this.filter();
      } else { this._toast.show(v.msg, 1800); }
    })
  }
}
// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  return v ? moment(v).format('YYYY-MM-DD HH:mm') : '';
};
// 审核状态
const CHECK_FORMAT: (v: any) => any = (v: any) => {
  let arr = ['待审核', '审核通过', '驳回', '审核取消'];
  return arr[v];
};
// 支付状态
const ORDER_FORMAT: (v: any) => any = (v: any) => {
  let arr = ['待支付', '已支付', '支付失败', '已退单', '已取消'];
  return arr[v];
};
// 成单渠道
const CHANNEL_FORMAT: (v: any) => any = (v: any) => {
  let arr = ['分销', 'CRM内部', '官网', '续报'];
  return arr[v - 10];
};
// 表头
export const orderColumns: ITdDataTableColumn[] = [
  { name: 'id', label: '操作', width: 80},
  { name: 'orderCode', label: '订单编号', },
  // { name: 'parentMobile', label: '手机号', },
  // { name: 'payStatus', label: '支付状态',format: ORDER_FORMAT },
  { name: 'checkStatus', label: '审核状态', format: CHECK_FORMAT },
  // { name: 'orderChannel', label: '成单渠道', format: CHANNEL_FORMAT },
  { name: 'userCode', label: '提交人', },
  { name: 'orderPrice', label: '原价', },
  { name: 'realPrice', label: '应付价格', },
  { name: 'sendTotalCouponPrice', label: '发放优惠券', },
  { name: 'createDate', label: '创建时间', format: TIME_FORMAT },
  // { name: 'payDate', label: '支付时间', format: TIME_FORMAT},
];
