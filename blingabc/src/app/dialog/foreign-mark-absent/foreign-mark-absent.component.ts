import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseService } from '../../services/base.service';
import { ForeignTeacherService } from '../../services/foreign-teacher.service';
import { Md2Toast } from '../../common/toast/toast';
import * as moment from 'moment';

@Component({
  selector: 'app-foreign-mark-absent',
  templateUrl: './foreign-mark-absent.component.html',
  styleUrls: ['./foreign-mark-absent.component.scss']
})
export class ForeignMarkAbsentComponent implements OnInit {
  reasons: any[] = [];
  teachers: any[] = [];
  teachers_backup: any[] = [];
  teacherId = '';
  reasonCode = '';
  Remark = '';

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForeignMarkAbsentComponent>,
    private _foreignTeacherService: ForeignTeacherService,
    private _baseService: BaseService,
    private _toast: Md2Toast) {
      console.log(data);
    this._baseService.getAllChangeForeignTeacherReasons().subscribe(v => this.reasons = v);
    this._foreignTeacherService.getForeignTeacherOnDutyWithClass().subscribe(v => {
      this.teachers = v.filter(i => i.id !== Number(this.data.foreignTeacherId));
      this.teachers_backup = JSON.parse(JSON.stringify(this.teachers)); // deep copy
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {

    const data = Object.assign({}, {
      classLessonId: this.data.id,
      beforeTeacherId: this.data.foreignTeacherId,
      teacherId: this.teacherId,
      reasonCode: this.reasonCode,
      remark: this.Remark,
    });

    // TODO API
    this._foreignTeacherService.updateTeacherWithLesson(data).subscribe(result => {
      if (result.code === 200) {
        this.dialogRef.close({ code: 200 });
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }

  filterTimes(e: any): void {
    const value = e.target.value;
    const rep = new RegExp(value, 'ig');

    if (value) {
      // Boolean(null) === 'null'; String(undefined) === 'undefined';
      this.teachers = this.teachers_backup.filter(i => i.id !== Number(this.data.foreignTeacherId) && Boolean(String(i.name).match(rep)));
    } else {
      this.teachers = this.teachers_backup;
    }
  }

  formatAt(time): string {
    if (time) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    }
    return '';
  }

  formatAtHm(time): string {
    if (time) {
      return moment(time).format('HH:mm');
    }
    return '';
  }
}
