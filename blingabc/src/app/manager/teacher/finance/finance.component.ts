import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {
  IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent, TdDialogService, TdPagingBarComponent
} from '@covalent/core';
import { ForeignTeacherService } from '../../../services/foreign-teacher.service';
import { MatDialog } from '@angular/material';
import { FinanceInsertComponent } from '../../../dialog/finance-insert/finance-insert.component';
import { tableWidth } from '../../setting';
import { Md2Toast } from '../../../common/toast/index';

const statusFormat = (value: number): string => {
  const arr = ['Pending', 'In progress', 'Completed'];

  return arr[value / 10 - 1];
};

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  @ViewChild('pagingBar') pagerBar: TdPagingBarComponent;
  date: any;
  showDate = moment().subtract(1, 'month').format('MM/YYYY');
  name: any;
  isShowReset: any;

  // table
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'teacherNum', label: `Teacher‘s ID`},
    {name: 'teacherName', label: `Teacher's Name`},
    {name: 'paypal', label: 'paypal'},
    {name: 'bankNumber', label: 'Bank Number'},
    {name: 'lessonFeeAmmount', label: 'Lesson Fee Amount'},
    {name: 'absencePenalty', label: 'Absence Penalty'},
    {name: 'others', label: 'Others'},
    {name: 'total', label: 'Total'},
    {name: 'status', label: 'Status', format: (value) => statusFormat(value)},
    {name: 'id', label: 'Operation', width: tableWidth.number},
  ];

  constructor(private _foreignTeacherService: ForeignTeacherService, private _dialog: MatDialog,
              private _toast: Md2Toast, private _dialogService: TdDialogService) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      teacherName: this.name,
      feeDate: moment(this.showDate, 'MM/YYYY').format('x')
    });

    // TODO API
    this._foreignTeacherService.getAllFinance(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list;
    });
  }

  query(): void {
    this.showDate = moment(this.date).format('MM/YYYY');
    this.isShowReset = true;
    this.filter();
  }

  reset(): void {
    this.isShowReset = false;
    this.name = '';
    this.date = '';
    this.showDate = moment().subtract(1, 'month').format('MM/YYYY');
    this.filter();
  }

  updateMonth(type: string): void {
    this.page = 1;
    if (this.pagerBar.page !== 1) {
      this.pagerBar.firstPage();
    }

    switch (type) {
      case 'pre':
        this.showDate = moment(this.showDate, 'MM/YYYY').subtract(1, 'month').format('MM/YYYY');
        this.filter();
        break;
      case 'next':
        this.showDate = moment(this.showDate, 'MM/YYYY').add(1, 'month').format('MM/YYYY');
        this.filter();
        break;
      default:
        break;
    }
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  openInsertDialog(data: any): void {
    this._dialog.open(FinanceInsertComponent, {
      width: '50%',
      height: '300px',
      data: data
    }).afterClosed().subscribe(r => {
      if (r && r.code === 200) {
        this.filter();
        this._toast.show('修改成功', 1800);
      }
    });
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

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData.push(v.row);
    } else {
      this.selectData = this.selectData.filter(item => item.id !== v.row.id);
    }
  }

  completeAll(): void {
    if (this.checkState(this.selectData)) {
      this._dialogService.openAlert({
        title: `Warn`,
        message: `There are completed records!`
      });
      return;
    }

    if (this.checkStatee(this.selectData)) {
      this._dialogService.openAlert({
        title: `Warn`,
        message: `There are pending records!`
      });
      return;
    }

    const data = Object.assign({}, {
      operator: JSON.parse(localStorage.getItem('info')).name,
      completeIds: this.selectData.map(i => i.feeNum).join(',')
    });
    // TODO API
    this._foreignTeacherService.updateFinanceStatus(data).subscribe(result => {
      if (result.code === 200) {
        this.filter();
        this._toast.show('update success', 1800);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }

  checkState(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].status === 30)) {
        return Boolean(items[i].status === 30);
      }
    }
  }

  checkStatee(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].status === 10)) {
        return Boolean(items[i].status === 10);
      }
    }
  }

  complete(row: any): void {
    const data = Object.assign({}, {
      operator: JSON.parse(localStorage.getItem('info')).name,
      completeIds: row.feeNum
    });
    this._foreignTeacherService.updateFinanceStatus(data).subscribe(result => {
      if (result.code === 200) {
        this.filter();
        this._toast.show('update success', 1800);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }

  export(): void {
    // TODO API
    this._foreignTeacherService.exportExcel(moment(this.showDate, 'MM/YYYY').format('x'));
  }
}
