import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent, IPageChangeEvent, TdDialogService
} from '@covalent/core';
import { ClassTeacherService, BaseService, ForeignTeacherService } from './../../../services';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-foreign-teacher',
  templateUrl: './foreign-teacher.component.html',
  styleUrls: ['./foreign-teacher.component.scss']
})
export class ForeignTeacherComponent implements OnInit {
  form: FormGroup;

  // select
  select = {
    jobStatus: '',
    dutyStatus: '',
  };
  selectData: any[] = [];

  // table
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'number', label: `Teacher's ID`},
    {name: 'name', label: `Teacher's Name`},
    {name: 'jobStatus', label: 'Status'},
    {name: 'dutyStatus', label: 'Duty'},
    {name: 'launchDateAt', label: 'Launch Date'},
    {name: 'phone', label: 'Mobile'},
    {name: 'id', label: ''},
  ];

  // reset
  isShowReset: boolean;

  constructor(private _dialog: MatDialog, private fb: FormBuilder, private _toast: Md2Toast,
              private _classTeacherService: ClassTeacherService, private _dialogService: TdDialogService,
              private _baseService: BaseService, private _foreignTeacherService: ForeignTeacherService) {
    this.form = this.fb.group({
      'name': [''],
      'number': [''],
      'phone': [''],
    });
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];

    const data = Object.assign({}, this.form.value, this.select, {
      page: this.page,
      size: this.pageSize,
      teacherStatus: 1
    });

    // delete obj key '' | null | undefined
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);

    this._foreignTeacherService.getAllForeignTeacher(data).subscribe(v => {
      this.filteredData = v.list.map(i => {
        if (i) {
          i.launchDateAt = i.launchDate ? moment(i.launchDate).format('YYYY-MM-DD') : null;
        }
        return i;
      });
      this.filteredTotal = v.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
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

  query(): void {
    // 没有筛选条件
    const data = Object.assign({}, this.form.value, this.select);
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);
    if (Object.keys(data).length === 0) {
      return;
    }

    // show reset button
    this.isShowReset = true;

    this.filter();
  }

  reset(): void {
    this.resetForm();
    this.resetTable();
    this.resetSelect();
    this.filter();

    // hide reset button
    this.isShowReset = false;
  }

  resetTable(): void {
    this.fromRow = 1;
    this.initialPage = 1;
    this.page = 1;
    this.pageSize = 30;
  }

  resetForm(): void {
    this.form.reset();
  }

  resetSelect(): void {
    this.select = {
      jobStatus: '',
      dutyStatus: '',
    };
  }

  // 批量恢复代班
  restoreAll(): void {
    if (this.checkJobState(this.selectData, 0)) {
      this.warn('There are teachers who have left!');
      return;
    }
    if (this.checkDutyState(this.selectData, 1)) {
      this.warn('A teacher who has a normal class!');
    } else {
      this.commonUpdateDutyStatus('This teacher will get new lessons after you done this operation.Are you sure to proceed?',
        this.selectData.map(i => i.id), 1);
    }
  }

  // 批量暂停代班
  pauseAll(): void {
    if (this.checkJobState(this.selectData, 0)) {
      this.warn('There are teachers who have left!');
      return;
    }
    if (this.checkDutyState(this.selectData, 0)) {
      this.warn('There are teachers who have suspended classes!');
    } else {
      this.commonUpdateDutyStatus('This teacher will not get new lessons after you done this operation.Are you sure to proceed?',
        this.selectData.map(i => i.id), 0);
    }
  }

  commonUpdateDutyStatus(msg: string, ids: number[], status: number): void {
    this._dialogService.openConfirm({
      title: `Attention`,
      message: msg,
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._classTeacherService.updateDutyStatusAll(ids, status).subscribe((v: boolean) => {
          if (v) {
            this._toast.show('sucess', 1800);
            this.filter();
          } else {
            this._toast.show('failed', 1800);
          }
        });
      }
    });
  }

  checkDutyState(items: any[], code: number): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].dutyStatus === code)) {
        return Boolean(items[i].dutyStatus === code);
      }
    }
  }

  checkJobState(items: any[], code: number): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].jobStatus === code)) {
        return Boolean(items[i].jobStatus === code);
      }
    }
  }

  updateDutyStateById(id: number, status: number, jobStatus: number): void {
    if (!jobStatus) {
      this.warn('The teacher has left!');
      return;
    }
    if (status === 1) {
      this.commonUpdateDutyStatus('This teacher will get new lessons after you done this operation.Are you sure to proceed?', [id], 1);
    } else if (status === 0) {
      this.commonUpdateDutyStatus('This teacher will not get new lessons after you done this operation.Are you sure to proceed?', [id], 0);
    } else {
      return;
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: `Attention`,
      message: msg,
    });
  }
}
