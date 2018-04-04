import { Component, OnInit } from '@angular/core';
import { ClassTeacherService, BaseService, ClassService } from './../../../../services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ITdDataTableColumn, ITdDataTableSelectAllEvent, TdDataTableService,
  ITdDataTableSelectEvent, IPageChangeEvent, TdDialogService
} from '@covalent/core';

import { validatorEmail, validatorPhoneNumber } from './../../teacher-utils';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { ChangeClassTeacherComponent } from '../../../../dialog/change-class-teacher/change-class-teacher.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-update-teacher',
  templateUrl: './update-teacher.component.html',
  styleUrls: ['./update-teacher.component.scss']
})
export class UpdateTeacherComponent implements OnInit {
  form: FormGroup;
  id: number;
  name: string;

  // radio button
  radio = {
    sex: 1,
    jobStatus: 1,
    dutyStatus: 1,
    contractStatus: 1
  }

  // date
  date = {
    birth: undefined,
    entryAt: undefined,
    endAt: undefined,
  }

  // table
  columns: ITdDataTableColumn[] = [
    { name: 'cycle', label: '班级周期', },
    { name: 'classCode', label: '班级编号', },
    { name: 'className', label: '班级名称', },
    { name: 'liveCurrentContain', label: '学员人数', },
    { name: 'lessonTotal', label: '课时总数', },
    { name: 'completedLessonNum', label: '已完成课时', },
    { name: 'id', label: '', },
  ];
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow: number = 1;
  page: number = 1;
  pageSize: number = 5;

  constructor(private _classTeacherService: ClassTeacherService, private _dialogService: TdDialogService,
    private _baseService: BaseService, private fb: FormBuilder, private _router: ActivatedRoute, private _dialog: MatDialog,
    private _classService: ClassService, private _toast: Md2Toast, private _dataTableService: TdDataTableService) {
    this.form = this.fb.group({
      'name': ['', [Validators.required]],
      'englishName': [''],
      'email': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.initPages();
  }

  initPages(): void {
    this._router.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        this.id = parms['id'];
        this._classTeacherService.getALlClassTeacher({ page: 1, size: 1, id: parms['id'] }).subscribe(i => {
          this.initDefaultForm(i.list[0]);
        });
        this.filter();
      }
    })
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.page = pagingEvent.page
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    this._classTeacherService.getTeacherClassInfo({
      id: this.id,
      page: this.page,
      size: this.pageSize
    }).subscribe(data => {
      this.filteredData = data.list.map(i => {
        i.cycle = `${moment(i.classStartDate).format('YYYY/MM/DD')}-${moment(i.classEndDate).format('YYYY/MM/DD')}`;
        return i;
      });
      this.filteredTotal = data.total;
    });
  }

  initDefaultForm(o: any): void {
    this.name = o.name;

    this.form.setValue({
      name: o.name,
      englishName: o.englishName,
      email: o.email,
      phone: o.phone,
    });

    this.date = {
      birth: o.birthday !== null ? moment(o.birthday) : null,
      entryAt: o.entryTime !== null ? moment(o.entryTime) : null,
      endAt: o.quitTime !== null ? moment(o.quitTime).format('YYYY-MM-DD') : null,
    };

    this.radio = {
      sex: +o.sex,
      jobStatus: +o.jobStatus,
      dutyStatus: +o.dutyStatus,
      contractStatus: +o.contractStatus
    }
  }

  openChangeTeacher(row: any): void {
    this._dialog.open(ChangeClassTeacherComponent, { width: '50%', data: { id: this.id, name: this.name } })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this._classTeacherService.updateClassInfoWithClassTeacher(Object.assign({}, data, {
            classInfoId: row.id,
            headmasterIdFrom: this.id,
          })).subscribe(v => v ? this.success('修改成功') : this._toast.show('修改失败', 1800));
        }
      });
  }

  onSubmit(formValue: any): void {
    const data = Object.assign({}, formValue, this.radio, {
      id: this.id,
      birthday: this.date.birth ? moment(this.date.birth).format('x') : null,
      entryTime: this.date.entryAt ? moment(this.date.entryAt).format('x') : null,
    });

    if (data.name && data.englishName && data.phone && data.email) {
      if (data.email !== "") {
        if (!validatorEmail(formValue.email)) {
          this.warn('邮箱格式不正确!')
          return;
        }
      }

      if (!validatorPhoneNumber(formValue.phone)) {
        this.warn('手机号格式不正确!');
        return;
      }
      // TODO API
      this._classTeacherService.updateClassTecher(data).subscribe((v: any) => {
        if (v.code === 200) {
          this._toast.show('修改成功', 1800);
          this.initPages();
        } else {
          this._toast.show(`${v.msg}`, 1800);
        }
      })
    } else {
      this.warn('信息不全，请核实!');
      return;
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }

  success(msg: string): void {
    this._toast.show(msg, 1800);
    this.filter();
  }
}
