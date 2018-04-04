import { OrderService } from './../../../../services/order.service';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BtnService } from '../../service/btn.service';
import {
  MparentType,
  Msex,
  MlisteningStatus,
  MmainStatus,
  MxdfStatus,
  MseedStatus,
  MisLogin,
  Mages
} from '../../../../models/order';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { CreateUserComponent } from '../../../../dialog/create-user/create-user.component';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  parentNum: any;  // 家长编号
  stuNum: any;  // 学生编号

  parentType = MparentType;  // 与孩子关系
  sex = Msex;  // 性别
  listeningStatus = MlisteningStatus;  // 试听
  mainStatus = MmainStatus;  // 主课
  xdfStatus = MxdfStatus;  // 新东方学员
  seedStatus = MseedStatus;  // 种子学员
  age = Mages;  // 年龄
  pid: number = -1;  // 渠道
  channelCodeOnes: any[];  // 渠道一
  channelCodeTwos: any[];  // 渠道二
  userinfo: any = {};  // 全部信息

  studentList: any = {};  // 学生信息
  myForm: FormGroup;  // 表单
  mobile: any;  // 手机号
  formList: boolean = false;  // 检索按钮是否出现
  isSucess: boolean = false;
  back: any;  // 返回到那个页面
  isSave: boolean = false;  // 是否可以点保存
  // public i:number = 0;

  searchItem: any;

  constructor(private _userService: UserService, private fb: FormBuilder, private route: ActivatedRoute, private _router: Router,
    private _toast: Md2Toast, private _orderService: OrderService, public _btnService: BtnService, private _dialog: MatDialog, ) {
    // this._btnService.change.emit(2);
  }

  ngOnInit() {
    // 路由传过来的参数
    // this.route.params.subscribe((params) => {

    //   if (params.hasOwnProperty('id')) {
    //     this.formList = true;
    //     this.mobile = params.id;
    //     this.searchMobile();
    //   }
    // });
    if (localStorage.getItem('userInfo')) {
      this.formList = true;
      // tslint:disable-next-line:no-bitwise
      this.mobile = JSON.parse(localStorage.getItem('userInfo')).mobile;
      // tslint:disable-next-line:no-bitwise
      this.searchItem = JSON.parse(localStorage.getItem('userInfo')).mobile;
      this.searchMobile();
    }
    this.back = this.route.data['value']['back'];
    // debugger;
    // 一级渠道
    this._userService.getchanneList(this.pid).subscribe(v => {
      this.channelCodeOnes = v;
    });

    this.myForm = this.fb.group({
      parent: this.fb.group({
        parentNum: [this.parentNum],  // 家长编号
        type: [''],  // 类型1父亲2母亲
        name: [''],  // 名称
        // mobile: [''],
        wechatName: [''],  // 微信号
        channelCodeOne: [{ value: '', disabled: true }],  // 渠道一
        channelCodeTwo: [{ value: '', disabled: true }],  // 渠道二
        xdfStatus: [''],  // 是否新东方学员1是0不是
        seedStatus: [''],  // 种子学员0不是,(1-n)类种子用户
      }),
      student: this.fb.group({
        stuNum: [this.stuNum],  // 学生编号
        enName: [''],  // 英文姓名
        name: [''],  // 中文姓名
        sex: [''], // 性别1男2女
        birthday: [''],  // 生日
        listeningStatus: [''],  // 试听状态1新分配2强意愿3无意愿4已购买未听5已听
        mainStatus: [''], // 主课状态1新分配2强意愿3无意愿
        age: [''], // 学生编号
      }),
    });
  }

  // 保存 提交家长、学生信息
  post(val) {
    if (!this.isSucess) {
      this._toast.show(`请根据手机号检索用户`, 1800);
      return;
    }
    val.parent.parentNum = this.parentNum;
    val.student.stuNum = this.stuNum;
    val.student.birthday = val.student.birthday ? moment(val.student.birthday).format('x') : null;
    for (let key in val.parent) {
      val.parent[key] = val.parent[key] === '' ? null : val.parent[key];
    }
    for (let key in val.student) {
      val.student[key] = val.student[key] === '' ? null : val.student[key];
    }
    // 修改家长信息
    this._userService.updateParent(val.parent).subscribe(v => {
      if (v.code == '10000') {
        this._toast.show(`保存家长信息成功`, 1800);
        if (this.back == 'sales') {
          this._router.navigate(['/main/sales/tracking']);
        }
      } else {
        this._toast.show('保存家长信息失败', 1800)
      }
    });

    // 修改学生信息
    this._userService.updateStudent(val.student).subscribe(v => {
      v ? this._toast.show(`保存学生信息成功`, 1800) : this._toast.show('保存学生信息失败', 1800)
    });
  }


  reset() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('userInfo');
    this.searchItem = '';
    this.formList = false;
    this.isSave = false;
    this.userinfo = {};
    this.studentList = {};
    this._btnService.change.emit(false);
    this.isSucess = false;
  }

  // 手机号检索
  searchMobile() {
    if (!this.searchItem) {
      this._toast.show(`请输入手机号后再检索`, 1800);
      return;
    }
    this.searchItem = this.searchItem.replace(/(^\s*)|(\s*$)/g, '');
    this.mobile = this.searchItem;
    this.userinfo = {};
    this.studentList = {};
    if (!(/^0?(13[0-9]|15[012356789]|17[01235678]|18[0-9]|14[579])[0-9]{8}$/.test(this.searchItem))) {
      this._toast.show(`请输入正确的手机号`, 1800);
      return;
    }
    this._userService.getParentInfo(this.searchItem).subscribe((v: any) => {
      if (v) {
        this.isSucess = true;
        this.isSave = true;
        this.formList = true;
        this.userinfo = this.objProTo(v);
        this.parentNum = v.parentNum;
        this.studentList = v.studentList[0];
        this.stuNum = v.studentList[0].stuNum;
        this.studentList.birthday = this.studentList.birthday ? moment(+this.studentList.birthday).format() : null;
        this.studentList.level = this.studentList.level ? 'level-' + this.studentList.level : '未检测';
        window.localStorage.setItem('userinfo', JSON.stringify(this.userinfo));
        window.localStorage.setItem('userInfo', JSON.stringify(this.userinfo));
        const channelId = this.channelCodeOnes.filter(i => i.code == v.channelCodeOne);
        // 二级渠道
        this._userService.getchanneList(channelId[0].id).subscribe(v => {
          this.channelCodeTwos = v;
        });
        this._btnService.change.emit(true);
      } else {
        this.isSave = false;
        this._btnService.change.emit(false);
        this.openDialog();
      }
    });
  }

  select(ev: any) {
    const channelId = this.channelCodeOnes.filter(i => i.code == ev.value);
    // 二级渠道
    this._userService.getchanneList(channelId[0].id).subscribe(v => {
      this.channelCodeTwos = v;
    });
  }

  openDialog() {
    this._dialog.open(CreateUserComponent, {
      width: '50%',
      data: this.mobile,
    }).afterClosed().subscribe(data => {
      if (data) {
        data.smsStatus = 0;
        this._userService.createParent(data).subscribe(v => {
          if (v.code == '10000') {
            this.isSave = true;
            this.isSucess = true;
            this.parentNum = v.data.parentNum;
            this.userinfo.channelCodeOne = v.data.channelCodeOne;
            this.userinfo.channelCodeTwo = v.data.channelCodeTwo;
            const channelId = this.channelCodeOnes.filter(i => i.code == this.userinfo.channelCodeOne);
            // 二级渠道
            this._userService.getchanneList(channelId[0].id).subscribe(v => {
              this.channelCodeTwos = v;
            });
            this.searchMobile();
          } else {
            this.isSave = false;
            this._toast.show(`创建用户失败`, 1800);
          }

        })
      }

    });
  }

  objProTo(obj) {
    if (obj) {
      obj.isLogin = obj.isLogin ? '已登录' : '未登录';
      // for (let key in obj) {
      //   if (obj[key] == null) {
      //     obj[key] = '无';
      //   }
      // }
    }
    return obj;
  }

}
