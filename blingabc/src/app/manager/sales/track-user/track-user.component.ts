import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn,
  IPageChangeEvent, ITdDataTableSelectEvent, ITdDataTableSelectAllEvent,
} from '@covalent/core';
import { UserService } from './../../../services/user.service';
import { Mlistening, Mmain, Mxdf, Mseed } from './../../../models/order';
import { MatDialog } from '@angular/material';
import { SetTrackTimeComponent } from '../../../dialog/set-track-time/set-track-time.component';
import * as moment from 'moment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-track-user',
  templateUrl: './track-user.component.html',
  styleUrls: ['./track-user.component.scss']
})
export class TrackUserComponent implements OnInit {

  listeningStatus = Mlistening; // 试听
  mainStatus = Mmain; // 主课
  xdfStatus = Mxdf; // 新东方学员
  channelCodeOnes: any[] = [{ name: '不限', code: '' }]; // 渠道一
  channelCodeTwos: any[] = [{ name: '不限', code: '' }]; // 渠道二
  pid: number = -1; // 渠道
  seedStatus = Mseed; // 种子学员
  columns = orderColumns; // 表头

  filteredData: any[] = []; // 列表
  page = 1; // 页数
  pageSize = 10; // 一列条数
  dataTotal: number; // 总数
  // parentMobile: any = '';// 家长手机
  // wechatName:any = '';// 微信名称
  // 下拉参数
  selected = {
    listeningStatus: '',
    mainStatus: '',
    seedStatus: '',
    xdfStatus: '',
    channelCodeOne: '',
    channelCodeTwo: ''
  };
  selectData: any[] = []; // 选中数据

  constructor(private _userService: UserService, private _toast: Md2Toast, private _dialog: MatDialog,
    private _router: Router) {
  }

  ngOnInit() {
    // 一级渠道
    this._userService.getchanneList(this.pid).subscribe(v => {
      this.channelCodeOnes = this.channelCodeOnes.concat(v);
    });
    this.filter();
  }

  // 获取数据 列表 —— 过滤
  filter(parm: any = this.selected) {
    this.selectData = [];
    this._userService.getstudentList(Object.assign({
      page: this.page,
      size: this.pageSize,
    }, parm)).subscribe((v: any) => {

      if (v.code === '10000') {
        this.filteredData = v.data.list;
        this.dataTotal = v.data.total;
        this.filteredData.forEach(function (item) {
          if (item.enName && item.name) {
            item.studentName = item.enName + '-' + item.name;
          } else if (item.enName) {
            item.studentName = item.enName;
          } else if (item.name) {
            item.studentName = item.name;
          } else {
            item.studentName = '';
          }
          if (item.channelCodeOneName && item.channelCodeTwoName) {
            item.channel = item.channelCodeOneName + '-' + item.channelCodeTwoName;
          } else if (item.channelCodeOneName) {
            item.channel = item.channelCodeOneName;
          } else if (item.channelCodeTwoName) {
            item.channel = item.channelCodeTwoName;
          } else {
            item.channel = '';
          }

          item.trackAt = item.traceDate ? moment(item.traceDate).format('YYYY-MM-DD HH:mm') : null;
        });
      }
    });
  }

  // 选择一级渠道
  filterchannel(ev: any) {
    let id = '';
    this.channelCodeOnes.forEach(function (item) {
      if (item.code === ev.value && item.code) {
        id = item.id;
        return;
      }
    });
    this._userService.getchanneList(id).subscribe(v => {
      this.channelCodeTwos = [{ name: '不限', code: '' }].concat(v);
    });
    this.filter();
  }

  // 关键字搜索 -- 家长电话号码
  searchNum(num: string): void {
    this.selected = {
      listeningStatus: '',
      mainStatus: '',
      seedStatus: '',
      xdfStatus: '',
      channelCodeOne: '',
      channelCodeTwo: ''
    };
    this.filter({ parentMobile: num });
  }

  searchName(name: string): void {
    this.selected = {
      listeningStatus: '',
      mainStatus: '',
      seedStatus: '',
      xdfStatus: '',
      channelCodeOne: '',
      channelCodeTwo: ''
    };
    this.filter({ wechatName: name });
  }

  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.filter();
  }

  showSetTrackTimeDialog(): void {
    this._dialog.open(SetTrackTimeComponent, { data: this.selectData }).afterClosed().subscribe(result => {
      if (result.code === 200) {
        this._toast.show('修改成功', 1800);
        this.filter();
      }
    });
  }

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData.push(v.row);
    } else {
      this.selectData = this.selectData.filter(item => item.id !== v.row.id);
    }
  }

  selectAllEvent(v: ITdDataTableSelectAllEvent): void {
    if (v.selected) {
      this.selectData = [...new Set(this.selectData.concat(v.rows))];
    } else {
      for (let i = 0; i < v.rows.length; i++) {
        this.selectData = this.selectData.filter(item => {
          return item.id !== v.rows[i].id;
        });
      }
    }
  }

  saveMobile(row): void {
    row.mobile = row.parentMobile;
    localStorage.setItem('userInfo', JSON.stringify(row));
    this._router.navigate(['/main/sales/tracking/user/user-info']);
  }
}

// 主课意愿
const MAIN_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['新分配', '强意愿', '无意愿', '已购买'];
  return arr[v - 1];
};
// 试听意愿
const LISTENING_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['新分配', '强意愿', '无意愿', '已购买'];
  return arr[v - 1];
};
// 新东方学员
const XDF_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['否', '是'];
  return arr[v];
};
// 种子用户
const SEED_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['不是', '1类种子用户'];
  return arr[v];
};
// 种子用户
const PARENT_FORMAT: (v: any) => any = (v: any) => {
  const arr = ['父亲', '母亲'];
  return arr[v - 1];
};
// 表头
export const orderColumns: ITdDataTableColumn[] = [
  { name: 'id', label: '操作', width: 50 },
  { name: 'parentMobile', label: '手机号' },
  { name: 'parentType', label: '家长身份', format: PARENT_FORMAT },
  { name: 'studentName', label: '学生姓名' },
  { name: 'wechatName', label: '微信号' },
  { name: 'channel', label: '获客渠道', width: 200 },
  { name: 'xdfStatus', label: '新东方学员', format: XDF_FORMAT },
  { name: 'seedStatus', label: '种子用户', format: SEED_FORMAT },
  // { name: 'realPrice', label: '测试水平', },
  { name: 'listeningStatus', label: '试听意愿', format: LISTENING_FORMAT },
  { name: 'mainStatus', label: '主课意愿', format: MAIN_FORMAT },
  { name: 'trackAt', label: '下次跟进时间' },
  { name: 'traceUsername', label: '最近跟踪人' },
  // { name: 'payDate', label: '支付时间', format: TIME_FORMAT },
];
