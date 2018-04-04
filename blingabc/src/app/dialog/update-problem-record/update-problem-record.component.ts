import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DeviceService } from '../../services/device.service';
import { verifyMiddleWare } from '../../services';
import { ProblemRecordDetailPreviewComponent } from '../problem-record-detail-preview/problem-record-detail-preview.component';
import { Md2Toast } from '../../common/toast';

@Component({
  selector: 'app-update-problem-record',
  templateUrl: './update-problem-record.component.html',
  styleUrls: ['./update-problem-record.component.scss']
})
export class UpdateProblemRecordComponent implements OnInit {
  status: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _deviceService: DeviceService,
              private _dialog: MatDialog,
              public dialogRef: MatDialogRef<UpdateProblemRecordComponent>,
              private _toast: Md2Toast,) {
    this.status = Boolean(this.data.status);
  }

  ngOnInit() {
  }

  submit() {
    const d = Object.assign({}, {
      id: this.data.task_id,
      telephone: this.data.telephone,
      type: this.data.type,
      remarks: this.data.remarks,
      status: this.data.status,
    });

    this._deviceService.updateDeviceTask(d).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.dialogRef.close(true);
      } else {
        this._toast.show('修改失败', 1800);
      }
    });
  }

  showRecord(): void {
    this._dialog.open(ProblemRecordDetailPreviewComponent, {width: '1110px', data: this.data});
  }
}
