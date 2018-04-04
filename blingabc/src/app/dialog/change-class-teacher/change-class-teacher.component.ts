import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClassTeacherService } from '../../services';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-change-class-teacher',
  templateUrl: './change-class-teacher.component.html',
  styleUrls: ['./change-class-teacher.component.scss']
})
export class ChangeClassTeacherComponent implements OnInit {
  form: FormGroup;
  newClassTeacher;
  teachers: any[] = [];

  constructor(public dialogRef: MatDialogRef<ChangeClassTeacherComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private _classTeacherService: ClassTeacherService,
    private _dialogService: TdDialogService, ) {
    this.form = this.fb.group({
      'name': [data.name],
      'descript': [''],
    });
    this.form.controls['name'].disable();
  }

  ngOnInit() {
    this.createSelect();
  }

  createSelect(): void {
    this._classTeacherService.getTeacherOnDutyWithClass().subscribe(v => {
      this.teachers = v.filter(i => i.id !== Number(this.data.id));
    });
  }

  onSubmit(): void {
    if (!this.newClassTeacher) {
      this._dialogService.openAlert({
        title: '警告',
        message: '请选择新班主任',
      });
      return;
    } else {
      this.dialogRef.close({
        headmasterIdTo: this.newClassTeacher,
        remark: this.form.value.descript
      });
      return;
    }

  }
}
