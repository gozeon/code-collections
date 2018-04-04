import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseService, ConferenceService } from '../../services';
import * as moment from 'moment';
import { TdDialogService } from '@covalent/core';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html',
  styleUrls: ['./add-conference.component.scss']
})
export class AddConferenceComponent implements OnInit {
  form: FormGroup;

  date = {
    startAt: new Date(),
    endAt: new Date()
  }

  distribution: number;
  distributions: any[] = [];

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddConferenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _baseService: BaseService,
    private _conferenceService: ConferenceService, private _dialogService: TdDialogService, private _toast: Md2Toast, ) {
    this.form = this.fb.group({
      'name': ['', [Validators.required]],
      'multiple': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this._baseService.getAllDistributions().subscribe(v => this.distributions = v);
  }

  onSubmit(): void {
    const data: any = Object.assign({}, this.form.value, {
      distribution: this.distribution,
      startDate: moment(this.date.startAt).format('x'),
      endDate: moment(this.date.endAt).format('x')
    });

    if (!this.form.valid || !this.distribution) {
      this._dialogService.openAlert({
        title: '警告',
        message: '信息不完整',
      });
      return;
    } else {
      // TODO API
      this._conferenceService.createConferences(data).subscribe(r => {
        if (r.code === 200) {
          this.dialogRef.close({
            code: 200
          });
        } else {
          this._toast.show(r.msg, 1800);
        }
      })
    }
  }
}
