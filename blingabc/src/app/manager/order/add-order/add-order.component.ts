import { AddAddressComponent } from '../../../dialog/add-address/add-address.component';
import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Params, ParamMap, Router } from '@angular/router';
import { OrderService, BaseService, UserService } from './../../../services';
import { MatSelectChange } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { formatTimeArrToZh } from '../../class/class-time/time.utils';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  checked1 = false;
  checked2 = false;
  ischecked: boolean; // 单选
  isPost = false;

  // private logistics: any = {};//地址
  // 省市区
  provinces: any[];
  citys: any[];
  areas: any[];
  // private isdAddress: boolean = false;

  userinfo: any = {}; // local 用户信息

  stuName: any; // 学生名字 中文-英文
  isSeed: any; // 是否是种子 0不是,(1-n)类种子用户
  isXdf: any; // 是否新东方学员 1是0不是

  channel: any[] = [
    {name: '分销', value: 10},
    {name: 'CRM内部', value: 11},
    {name: '官网', value: 12},
    {name: '续报', value: 13},
  ]; // 成单渠道

  useCouponCode: any[] = [{couponCode: '', couponName: '无', couponPrice: 0}]; // 学生优惠券
  useCou: any = '';
  couponPrice: any = 0;
  sendCouponCodes: any[] = [{code: '', name: '无'}]; // 待发放优惠券
  sendCou: any = '';
  totalPrice: number; // 原价
  favorablePrice: number; // 优惠课程价格
  minusPrice: number; // 手填价格
  price = 0; // 计算价格
  radioPrice = 0;

  stuList: any[]; // 已选课程列表
  classMoney: any[]; // 算钱的班级
  order = {
    orderChannel: 11,
    classList: [],
    createId: '',
    stuNum: '',
    userCode: '',
    useCouponCode: [],
    sendCouponCodes: [],
    // logistics: this.logistics,
    courseFavorableState: 0,
    minusPrice: 0,
    remark: '',
  }
  columns = orderClassColumns; // 表头

  constructor(private fb: FormBuilder, private _dialog: MatDialog, private _toast: Md2Toast,
              private route: ActivatedRoute, private _orderService: OrderService, private _router: Router,
              private _baseService: BaseService, private _userService: UserService) {
    this.order.createId = JSON.parse(localStorage.getItem('info')).id;
    this.order.userCode = JSON.parse(localStorage.getItem('info')).username;
    this.ischecked = true;

  }

  ngOnInit() {

    // 请求省份
    this._baseService.getAllProvinces().subscribe(v => this.provinces = v);

    if (window.localStorage.getItem('userinfo')) {
      this.userinfo = <any>JSON.parse(window.localStorage.getItem('userinfo'));
      // this.stuName = this.userinfo.studentList[0].enName ? this.userinfo.studentList[0].enName + '-' + this.userinfo.studentList[0].name : this.userinfo.studentList[0].name
      if (this.userinfo.studentList[0].enName && this.userinfo.studentList[0].name) {
        this.stuName = this.userinfo.studentList[0].enName + '-' + this.userinfo.studentList[0].name;
      } else if (this.userinfo.studentList[0].enName) {
        this.stuName = this.userinfo.studentList[0].enName;
      } else if (this.userinfo.studentList[0].name) {
        this.stuName = this.userinfo.studentList[0].name;
      } else {
        this.stuName = '';
      }
      this.isSeed = this.userinfo.seedStatus ? `${this.userinfo.seedStatus}类种子学员` : '不是';
      this.isXdf = this.userinfo.xdfStatus ? '是' : '不是';
      this.order.stuNum = this.userinfo.studentList[0].stuNum;
    }

    // 获取学生优惠券
    this._userService.getStudentCouponList(this.order.stuNum).subscribe(v => {
      this.useCouponCode = this.useCouponCode.concat(v);
    });
    if (window.localStorage.getItem('stulist')) {
      this.stuList = <any>JSON.parse(window.localStorage.getItem('stulist'));
      this.classMoney = this.stuList.map(item => {
        return item.classCode;
      });
      this.stuList.forEach(item => {
        item.courseTypeName = item.classCourse.courseTypeName;
        item.lessonTotal = item.classCourse.lessonTotal;
        let o = {id: '', classCode: ''};
        o.id = item.id;
        o.classCode = item.classCode;
        this.order.classList.push(o);

      });
    }
    
    this.CalculateMoneyByClassCode();
  }

  CalculateMoneyByClassCode(): void {
    // 算钱 根据班级code
    this._orderService.caleCourseFavourablePrice({
      classList: this.classMoney,
      orderChannel: this.order.orderChannel
    }).subscribe(v => {

      this.totalPrice = v.totalPrice ? v.totalPrice : 0;
      if (v.coupon) {
        this.sendCouponCodes = this.sendCouponCodes.concat(v.coupon);
      }
      this.favorablePrice = v.favorablePrice ? v.favorablePrice : 0;
      this.price = this.totalPrice;
    });
  }

  // 清楚local
  clear(): void {
    window.localStorage.removeItem('userinfo');
    window.localStorage.removeItem('stulist');
  }

  // 提交订单
  post() {
    this.isPost = true;
    if (this.price - this.radioPrice < 0) {
      this._toast.show('实际价格不正确，请重新选择', 1800);
      return;
    }
    this.order.courseFavorableState = this.checked1 ? 1 : 0;
    this.order.minusPrice = this.checked2 ? this.minusPrice : 0;
    if (this.sendCou) {
      this.order.sendCouponCodes[0] = this.sendCou;
    }
    if (this.useCou) {
      this.order.useCouponCode[0] = this.useCou;
    }
    this._orderService.createOrder(this.order).subscribe(v => {
      if (v.code == '10000') {
        this.clear();
        this._router.navigate(['/main/order/order-verify']);
      } else {
        this.isPost = false;
        this._toast.show(v.msg, 1800);
      }
    });
  }

  // 金额选择切换
  checkedOne(ev) {
    this.checked1 = ev.checked;
    this.checked2 = false;
    this.ischecked = true;
    if (this.checked1) {
      this.radioPrice = this.favorablePrice;
    } else {
      this.radioPrice = 0;
    }
  }

  checkedTwo(ev) {
    this.checked2 = ev.checked;
    this.checked1 = false;
    if (this.checked2) {
      this.ischecked = false;
      this.radioPrice = this.minusPrice == undefined ? 0 : this.minusPrice;
    } else {
      this.ischecked = true;
      this.radioPrice = 0;
    }
  }

  // 手填金额
  handPrice() {
    this.radioPrice = this.minusPrice;
  }

  // 选择优惠券金额
  selectUse(ev: any) {
    if (ev.value) {
      this.useCouponCode.forEach(item => {
        if (item.couponCode == ev.value) {
          this.couponPrice = item.couponPrice;
          return;
        }
      });
    } else {
      this.couponPrice = 0;
    }
  }
}

// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  // return v ? moment(v).format('YYYY-MM-DD HH:mm') : '';
  return v ? formatTimeArrToZh(v) : '';
};

export const orderClassColumns: ITdDataTableColumn[] = [
  {name: 'courseTypeName', label: '类型', width: 80},
  {name: 'classCode', label: '班级编号 '},
  {name: 'className', label: '班级名称'},
  {name: 'foreignTeacherName', label: '外教姓名'},
  {name: 'schoolTime', label: '上课时间', format: TIME_FORMAT},
  {name: 'liveCurrentContain', label: '已报人数'},
  {name: 'lessonTotal', label: '已选课时'},
];
