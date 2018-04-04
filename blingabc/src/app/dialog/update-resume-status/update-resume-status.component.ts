import { Component, OnInit, Inject } from '@angular/core';
import { BaseService, ForeignTeacherService } from '../../services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/map';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-update-resume-status',
  templateUrl: './update-resume-status.component.html',
  styleUrls: ['./update-resume-status.component.scss']
})
export class UpdateResumeStatusComponent implements OnInit {
  form: FormGroup;

  reasons: any[];
  scores: number[];

  interviewStatus = undefined;
  interviewFailReason = undefined;
  interviewScore = undefined;

  constructor(private _baseService: BaseService, public dialogRef: MatDialogRef<UpdateResumeStatusComponent>, private _toast: Md2Toast,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private _foreignTeacherService: ForeignTeacherService) {
    this.form = this.fb.group({});

    this.scores = this.createNumScoreArray();
    this._baseService.getAllCauseOfFailure().subscribe(v => this.reasons = v);
  }

  ngOnInit() {
  }

  doChange() {
    this.interviewFailReason = undefined;
    this.interviewScore = undefined;
  }

  createNumScoreArray(): number[] {
    let r = [];
    for (let i = 70; i <= 100; i++) {
      r.push(i);
    }
    return r;
  }

  onSubmit(): void {
    let data;
    if (this.interviewStatus === 1) {
      data = Object.assign({}, this.data, {
        interviewStatus: this.interviewStatus,
        interviewScore: this.interviewScore,
      });
    } else {
      data = Object.assign({}, this.data, {
        interviewStatus: this.interviewStatus,
        interviewFailReason: this.interviewFailReason,
      });
    }

    if (!data.interviewStatus) {
      this._toast.show('Please Select Interview Status', 1800);
      return;
    }

    if (data.interviewStatus === 1 && !data.interviewScore) {
      this._toast.show('Interview Score Not Null', 1800);
      return;
    }

    if (data.interviewStatus === 2 && !data.interviewFailReason) {
      this._toast.show('Interview Fail Reason Not Null', 1800);
      return;
    }

    this._foreignTeacherService.updateForeignTecher(data.id, data).subscribe(r => {
      if (r.code === 200) {
        this.dialogRef.close({ code: 200 });
      } else {
        this._toast.show(`${r.msg}`, 1800);
        return;
      }
    });
  }
}
