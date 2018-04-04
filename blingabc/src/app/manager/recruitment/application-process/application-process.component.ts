import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent, IPageChangeEvent, TdDialogService
} from '@covalent/core';
import { ClassTeacherService, BaseService, ForeignTeacherService } from './../../../services';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UpdateResumeStatusComponent } from '../../../dialog/update-resume-status/update-resume-status.component';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-application-process',
  templateUrl: './application-process.component.html',
  styleUrls: ['./application-process.component.scss']
})
export class ApplicationProcessComponent implements OnInit {
  form: FormGroup;

  // select
  select = {
    jobStatus: '',
    dutyStatus: '',
    interviewStatus: '',
  }
  selectData: any[] = [];
  interviewStatus: any[] = [];

  // date
  date = {
    startAt: '',
    endAt: '',
  }

  // table
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'number', label: `Teacher's ID`, },
    { name: 'firstName', label: `Teacher's Name`, },
    { name: 'email', label: 'Email', },
    { name: 'skypeId', label: 'Skpye ID', },
    { name: 'applyDate', label: 'Apply Date', },
    { name: 'phone', label: 'Mobile', },
    { name: 'interviewStatusName', label: 'Interview Status', },
    { name: 'id', label: '', },
  ];

  // reset
  isShowReset: boolean;

  constructor(private _dialog: MatDialog, private fb: FormBuilder, private _toast: Md2Toast,
    private _classTeacherService: ClassTeacherService, private _dialogService: TdDialogService,
    private _baseService: BaseService, private _foreignTeacherService: ForeignTeacherService) {
    this.form = this.fb.group({
      'name': [''],
      'email': [''],
      'phone': ['',],
      'skypeId': ['',],
    });
  }

  ngOnInit() {
    this.filter();

    this._baseService.getAllInterviewStatus().subscribe(v => this.interviewStatus = v);
  }

  filter(): void {
    this.selectData = [];

    const data = Object.assign({}, this.form.value, this.select, {
      page: this.page,
      size: this.pageSize,
      appStartDate: this.date.startAt ? moment(this.date.startAt).format('x') : null,
      appEndDate: this.date.endAt ? moment(this.date.endAt).format('x') : null,
      teacherStatus: 2,
    });

    // delete obj key '' | null | undefined
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);

    this._foreignTeacherService.getAllProcessTeachers(data).subscribe(v => {
      this.filteredData = v.list.map(i => {
        if (i) {
          i.applyDate = i.applicationDate ? moment(i.applicationDate).format('YYYY-MM-DD HH:mm:ss') : null;
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

  query(): void {
    // 没有筛选条件
    const data = Object.assign({}, this.form.value, this.select, {
      appStartDate: this.date.startAt ? moment(this.date.startAt).format('x') : null,
      appEndDate: this.date.endAt ? moment(this.date.endAt).format('x') : null,
    });
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);
    if (Object.keys(data).length === 0) {
      return;
    }

    // 时间缺少一个
    if ((!this.date.startAt && this.date.endAt) || (this.date.startAt && !this.date.endAt)) {
      this.warn('Time conditions are incomplete');
      return;
    }


    // show reset button
    this.isShowReset = true;

    this.filter();
  }

  reset(): void {
    this.resetDate();
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
      interviewStatus: '',
    }
  }

  resetDate(): void {
    this.date = {
      startAt: '',
      endAt: '',
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: `Warn`,
      message: msg,
    })
  }

  openResultDialog(row): void {
    this._dialog.open(UpdateResumeStatusComponent, { width: '50%', data: { id: row.id, foreignId: row.foreignId } }).afterClosed().subscribe(v => {
      if (v && v.code === 200) {
        this._toast.show('update success', 1800);
        this.filter();
      }
    })
  }
}

