import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassTeacherService, BaseService } from './../../../../services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {
  TdDialogService
} from '@covalent/core';

import { validatorEmail, validatorPhoneNumber } from './../../teacher-utils';
import * as moment from 'moment';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
  form: FormGroup;

  // radio button
  radio = {
    sex: 1,
    jobStatus: 1,
    dutyStatus: 1,
    contractStatus: 1
  };

  // date
  date = {
    birth: '',
    entryAt: ''
  };

  constructor(private _classTeacherService: ClassTeacherService, private _dialogService: TdDialogService,
    private _baseService: BaseService, private fb: FormBuilder, private _route: Router, private _toast: Md2Toast, ) {
    this.form = this.fb.group({
      'name': ['', [Validators.required]],
      'englishName': ['', [Validators.required]],
      'email': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  onSubmit(formValue: any): void {
    const data = Object.assign({}, formValue, this.radio, {
      birthday: this.date.birth ? moment(this.date.birth).format('x') : null,
      entryTime: this.date.entryAt ? moment(this.date.entryAt).format('x') : null,
    });

    if (data.name && data.englishName && data.email && data.sex && data.phone
      && data.jobStatus && data.contractStatus && data.dutyStatus) {
      if (!validatorEmail(formValue.email)) {
        this.warn('邮箱格式不正确!');
        return;
      }

      if (!validatorPhoneNumber(formValue.phone)) {
        this.warn('手机号格式不正确!');
        return;
      }

      // TODO API
      this._classTeacherService.createClassTecher(data).subscribe((v: any) => {
        if (v.code === 200) {
          this.success('添加');
        } else {
          this._toast.show(`${v.msg}`, 1800);
          return;
        }
      });
    } else {
      this.warn('信息不全，请核实!');
      return;
    }
  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/teacher/class']);
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }
}
