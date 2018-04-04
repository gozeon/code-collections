import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ForeignTeacherService } from '../../services';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-change-foreign-teacher',
  templateUrl: './change-foreign-teacher.component.html',
  styleUrls: ['./change-foreign-teacher.component.scss']
})
export class ChangeForeignTeacherComponent implements OnInit {
  form: FormGroup;
  newClassTeacher;
  teachers: any[] = [];

  constructor(public dialogRef: MatDialogRef<ChangeForeignTeacherComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private _foreignTeacherService: ForeignTeacherService,
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
    this._foreignTeacherService.getForeignTeacherOnDutyWithClass().subscribe(v => {
      this.teachers = v.filter(i => i.id !== Number(this.data.id));
    })
  }

  onSubmit(): void {
    if (!this.newClassTeacher) {
      this._dialogService.openAlert({
        title: 'Warn',
        message: 'Please select the new class teacher',
      });
      return;
    } else {
      this.dialogRef.close({
        selectId: this.newClassTeacher,
        remark: this.form.value.descript
      });
      return;
    }

  }

}
