import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdLoadingService } from '@covalent/core';
import * as moment from 'moment';
import { DistributionService } from '../../../services/distribution.service';
import { tableWidth } from '../../setting';
import { Md2Toast } from '../../../common/toast/toast';
import { verifyMiddleWare } from '../../../services';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-distribution-withdraw',
  templateUrl: './distribution-withdraw.component.html',
  styleUrls: ['./distribution-withdraw.component.scss']
})
export class DistributionWithdrawComponent implements OnInit {
  type;
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
    {name: 'email', label: '邮箱', width: tableWidth.phone * 2},
    {name: 'provinceName', label: '省', width: tableWidth.phone},
    {name: 'cityName', label: '市', width: tableWidth.phone},
    {name: 'areaName', label: '区', width: tableWidth.phone},
    {name: 'teacherName', label: '姓名',},
    {name: 'authCard', label: '身份证号', width: tableWidth.phone * 2},

    {name: 'businessCode', label: '账单编号', width: tableWidth.number},
    {name: 'payoutMoney', label: '发放金额',},
    {name: 'taxMoney', label: '扣除税金',},
    {name: 'realMoney', label: '税后到账',},
    {name: 'type', label: '类型', format: value => ['订单收入', '奖金收入', '提现到微信', '转账到银行'][+value % 10]},
    {name: 'remark', label: '备注 ', width: tableWidth.number},
    {name: 'createDate', label: '提现时间', format: value => formatTime(value)},
  ];

  constructor(private _distributionService: DistributionService,
              private _toast: Md2Toast,
              private _loadingService: TdLoadingService,) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {

    const data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize,
      type: this.type,
      selectDate: this.time ? moment(this.time).format('YYYY-MM') : null,
      moneyType: 2
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

    this.search = {
      businessCode: undefined,
      teacherName: undefined,
      teacherEmail: undefined,
    };

    this.filter();
  }

  importFile(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].name.slice(-4) !== 'xlsx') {
        event.target.value = '';
        this._toast.show('只支持xlsx格式', 1800);
        return;
      }
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      formData.append('createUsername', JSON.parse(localStorage.getItem('info')).username);
      // TODO API
      this._loadingService.register();
      this._distributionService.importWithdraw(formData).subscribe(result => {
        this._loadingService.resolve();
        if (verifyMiddleWare(result)) {
          this._toast.show('导入成功');
          this.filter();
        }
      });
    }
  }

  export() {
    if (!this.time) {
      this._toast.show('请填写时间', 1800);
      return;
    }

    this._distributionService.exportWithdraw(moment(this.time).format('YYYY-MM'));
  }
}
