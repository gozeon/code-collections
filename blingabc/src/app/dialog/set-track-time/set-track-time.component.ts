import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TrackService } from '../../services/track.service';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-set-track-time',
  templateUrl: './set-track-time.component.html',
  styleUrls: ['./set-track-time.component.scss']
})
export class SetTrackTimeComponent implements OnInit {
  trackTime: any = moment().add(1, 'days').format();
  isTrack = true;

  constructor(public dialogRef: MatDialogRef<SetTrackTimeComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private _trackService: TrackService, private _toast: Md2Toast) {
  }

  ngOnInit() {
  }

  addDay(num: number): void {
    this.trackTime = moment().add(num, 'days').format();
  }

  updateTrackState(event: any): void {
    this.trackTime = this.isTrack ? new Date() : null;
  }

  onSubmit() {
    const data = Object.assign({}, {
      stuNums: this.data.map(item => item.stuNum),
      traceDate: this.trackTime ? moment(this.trackTime).format('x') : null
    });

    // TODO API
    this._trackService.updateAllTrackTime(data).subscribe(result => {
      if (result.code === 200) {
        this.dialogRef.close(result);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }
}
