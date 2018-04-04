import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';
import { ForeignTeacherService } from '../../services/foreign-teacher.service';

@Component({
  selector: 'app-finance-insert',
  templateUrl: './finance-insert.component.html',
  styleUrls: ['./finance-insert.component.scss']
})
export class FinanceInsertComponent implements OnInit {
  req = {
    remark: undefined,
    amount: undefined,
    title: undefined,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<FinanceInsertComponent>,
              private _toast: Md2Toast,
              private _foreignTeacherService: ForeignTeacherService) {

  }

  ngOnInit() {
  }

  onSubmit(): void {
    const data = Object.assign({}, this.req, {
      feeNum: this.data.feeNum,
      operator: JSON.parse(localStorage.getItem('info')).username,
      teacherId: this.data.teacherId
    });

    // TODO API
    this._foreignTeacherService.financeInsert(data).subscribe(result => {
      if (result.code === 200) {
        this.dialogRef.close({code: 200});
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }
}
