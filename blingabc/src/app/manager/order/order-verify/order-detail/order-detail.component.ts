import { OrderCheckedComponent } from '../../../../dialog/order-checked/order-checked.component';

import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService, BaseService } from './../../../../services';
import * as moment from 'moment';
import { formatTimeArrToZh } from '../../../class/class-time/time.utils';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  orderdetail: any; // 详情 {}
  columns = orderClassColumns; // 已选班级表头
  list: any; // 已选班级列表
  id: any; // 订单编号
  checkedTypes: any = ['待审核', '审核通过', '驳回', '取消'];
  payStatus: any = ['待支付', '已支付', '支付失败', '已退单', '已取消'];
  checkName = '';
  channel: any[] = ['分销', 'CRM内部', '官网', '续报']; // 成单渠道
  back: any; // 返回上一页
  isCheck = true; // 是否驳回

  constructor(private _dialog: MatDialog, private route: ActivatedRoute,
    private _orderService: OrderService, private _toast: Md2Toast) { }

  ngOnInit() {
    // 路由传过来的参数
    this.route.params.subscribe((params) => {
      // 根据路由参数 发起请求 获取订单详情
      this._orderService.getOrderdetail(params.id).subscribe((v: any) => {
        this.id = v.id;
        this.orderdetail = this.objProTo(v);
        this.list = v.orderDetailCustoms;
      });
    });
    this.back = this.route.data['value']['back'];
  }

  objProTo(obj) {
    if (obj) {

      if (obj.orderChannel == 11 && obj.payStatus == 0 && (obj.checkStatus == 1 || obj.checkStatus == 0)) {
        this.isCheck = false;
      }
      this.checkName = this.checkedTypes[obj.checkStatus];
      obj.channelName = this.channel[obj.orderChannel - 10];

      obj.xdfStatus = obj.xdfStatus ? '是' : '不是';
      obj.seedStatus = obj.seedStatus ? `${obj.seedStatus}类种子用户` : '不是';
      obj.expiryDate = obj.expiryDate ? moment(obj.expiryDate).format('YYYY-MM-DD HH:mm') : null;
      obj.checkExpiryDate = obj.checkExpiryDate ? moment(obj.checkExpiryDate).format('YYYY-MM-DD HH:mm') : null;
      // obj.studentName = obj.studentEnName ? obj.studentEnName +'-'+ obj.studentName : obj.studentName;
      if (obj.studentEnName && obj.studentName) {
        obj.studentName = obj.studentEnName + '-' + obj.studentName;
      } else if (obj.studentEnName) {
        obj.studentName = obj.studentEnName;
      } else if (obj.studentName) {
        obj.studentName = obj.studentName;
      } else {
        obj.studentName = '';
      }
      for (let key in obj) {
        if (obj[key] == null) {
          obj[key] = '无';
        }
      }
    }
    return obj;
  }
  // 修改订单审核状态
  openOrderCheckedDialog() {
    this._dialog.open(OrderCheckedComponent, {
      width: '50%',
      data: this.orderdetail.checkStatus,
    }).afterClosed().subscribe(data => {
      if (data) {
        this._orderService.postOrderCheck({
          ids: [this.id],// 订单ID
          checkStatus: data.checkStatus,// 审核状态
          checkUserId: JSON.parse(localStorage.getItem('info')).id,// 审核人
          checkRemark: data.content,// 原因
        }).subscribe(v => {
          if (v.code == '10000') {
            this._toast.show(`修改成功`, 1800)
            this.checkName = this.checkedTypes[data.checkStatus];
            if (data.checkStatus == 2) { this.isCheck = true; }
          } else { this._toast.show('修改失败', 1800); }
        });
      }
    });
  }
}
// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  return v ? moment(v).format('MM-DD') : '';
};
const WEEK_FORMAT: (v: any) => any = (v: any) => {
  return v ? formatTimeArrToZh(v) : '';
};
export const orderClassColumns: ITdDataTableColumn[] = [
  { name: 'courseTypeName', label: '类型', width: 80},
  { name: 'classCode', label: '班级编号', },
  { name: 'className', label: '班级名称', },
  { name: 'schoolTime', label: '上课时间', format: WEEK_FORMAT },
  { name: 'classStartDate', label: '开课日期', format: TIME_FORMAT },
  { name: 'lessonCount', label: '已选课时', },
];
