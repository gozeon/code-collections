
import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent, IPageChangeEvent, TdDialogService
} from '@covalent/core';
import { ClassTeacherService, BaseService } from './../../../services';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-class-teacher',
  templateUrl: './class-teacher.component.html',
  styleUrls: ['./class-teacher.component.scss']
})
export class ClassTeacherComponent implements OnInit {
  form: FormGroup;

  // select
  select = {
    jobStatus: '',
    dutyStatus: '',
  }
  selectData: any[] = [];

  // table
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow: number = 1;
  initialPage = 1;
  page: number = 1;
  pageSize: number = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'number', label: '老师编号', },
    { name: 'name', label: '老师姓名', },
    { name: 'jobStatus', label: '在职状态', },
    { name: 'contractStatus', label: '合同性质', },
    { name: 'dutyStatus', label: '带班状态', },
    { name: 'entryAy', label: '入职时间', },
    { name: 'phone', label: '手机', },
    { name: 'id', label: '', },
  ];

  // reset
  isShowReset: boolean;

  constructor(private _dialog: MatDialog, private fb: FormBuilder, private _toast: Md2Toast,
    private _classTeacherService: ClassTeacherService, private _dialogService: TdDialogService,
    private _baseService: BaseService) {
    this.form = this.fb.group({
      'name': [''],
      'number': [''],
      'phone': ['',],
    });
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];

    const data = Object.assign({}, this.form.value, this.select, {
      page: this.page,
      size: this.pageSize
    });

    // delete obj key '' | null | undefined
    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);

    this._classTeacherService.getALlClassTeacher(data).subscribe(v => {
      this.filteredData = v.list.map(i => {
        if (i) {
          i.entryAy = i.entryTime ? moment(i.entryTime).format('YYYY-MM-DD') : null;
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
    }
    else {
      this.selectData = this.selectData.filter(item => item.id !== v.row.id)
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
    }
  }

  // 批量恢复代班
  restoreAll(): void {
    if (this.checkJobState(this.selectData, 0)) {
      this.warn('存在已离职的老师!');
      return;
    }
    if (this.checkDutyState(this.selectData, 1)) {
      this.warn('存在正常代班的老师!')
    } else {
      this.commonUpdateDutyStatus('恢复带班之后，班主任可以立即接收新的班级，确定要恢复带班吗？', this.selectData.map(i => i.id), 1);
    }
  }

  // 批量暂停代班
  pauseAll(): void {
    if (this.checkJobState(this.selectData, 0)) {
      this.warn('存在已离职的老师!');
      return;
    }
    if (this.checkDutyState(this.selectData, 0)) {
      this.warn('存在已暂停代班的老师!')
    } else {
      this.commonUpdateDutyStatus('暂停带班之后，班主任立即不再接收新的班级，确定暂停带班吗？', this.selectData.map(i => i.id), 0);
    }
  }

  commonUpdateDutyStatus(msg: string, ids: number[], status: number): void {
    this._dialogService.openConfirm({
      title: `提示`,
      message: msg,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._classTeacherService.updateDutyStatusAll(ids, status).subscribe((v: boolean) => {
          if (v) {
            this._toast.show("修改成功", 1800);
            this.filter();
          } else {
            this._toast.show("修改失败", 1800)
          }
        })
      }
    })
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
      this.warn('老师已离职!');
      return;
    }
    if (status === 1) {
      this.commonUpdateDutyStatus('恢复带班之后，班主任可以立即接收新的班级，确定要恢复带班吗？', [id], 1);
    } else if (status === 0) {
      this.commonUpdateDutyStatus('暂停带班之后，班主任立即不再接收新的班级，确定暂停带班吗？', [id], 0);
    } else {
      return;
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: `警告`,
      message: msg,
      closeButton: '确定'
    })
  }
}
