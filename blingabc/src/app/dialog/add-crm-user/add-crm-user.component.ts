import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';
import { BaseService, CRMUserService } from '../../services';
import { validatorPhoneNumber } from '../../manager/teacher/teacher-utils';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-add-crm-user',
  templateUrl: './add-crm-user.component.html',
  styleUrls: ['./add-crm-user.component.scss']
})
export class AddCrmUserComponent implements OnInit {
  form: FormGroup;

  status = 1;
  constructor(private _toast: Md2Toast, private fb: FormBuilder, public dialogRef: MatDialogRef<AddCrmUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _dialogService: TdDialogService, private _cRMUserService: CRMUserService, ) {
    this.form = this.fb.group({
      'name': ['', [Validators.required]],
      'username': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
    });

    if (data) {
      this.form.setValue({
        name: data.name,
        username: data.username,
        phone: data.phone
      });
      this.status = data.status;
    }
  }

  ngOnInit() {
  }

  onSubmit(): void {
    const data = Object.assign({}, this.form.value, {
      status: this.status ? 1 : 0
    });

    if (!this.form.valid) {
      this.warn('信息不完整!');
      return;
    }
    if (!validatorPhoneNumber(this.form.value.phone)) {
      this.warn('手机号格式不正确!');
      return;
    }

    if (!this.data) {
      // add
      this._cRMUserService.createCRMUser(data).subscribe(r => {
        if (r.code === 200) {
          this.dialogRef.close({
            code: 200,
            type: 'add'
          });
        } else {
          this._toast.show(r.msg, 1800);
        }
      });
    } else {
      // updte
      this._cRMUserService.updateCRMUserById(Object.assign({}, data, {
        id: this.data.id
      })).subscribe(r => {
        if (r) {
          this.dialogRef.close({
            code: 200,
            type: 'update'
          });
        } else {
          this._toast.show('修改失败', 1800);
        }
      });
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }
}
