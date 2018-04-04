import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';
import { TrackService } from '../../services/track.service';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-create-track-record',
  templateUrl: './create-track-record.component.html',
  styleUrls: ['./create-track-record.component.scss']
})
export class CreateTrackRecordComponent implements OnInit {
  trackTime: any = moment().add(1, 'days').format();
  listeningStatus;
  mainStatus;
  content;
  isTrack = true;

  listeningStatusDisabled = false;
  mainStatusDisabled = false;

  constructor(public dialogRef: MatDialogRef<CreateTrackRecordComponent>, private _trackService: TrackService,
    private _toast: Md2Toast) {
  }

  ngOnInit() {
    this.listeningStatus = '' + JSON.parse(localStorage.getItem('userInfo')).studentList[0].listeningStatus;
    this.mainStatus = '' + JSON.parse(localStorage.getItem('userInfo')).studentList[0].mainStatus;
    if (this.listeningStatus === '4') {
      this.listeningStatusDisabled = true;
    }
    if (this.mainStatus === '4') {
      this.mainStatusDisabled = true;
    }
  }

  addDay(num: number): void {
    this.trackTime = moment().add(num, 'days').format();
  }

  updateTrackState(event: any): void {
    this.trackTime = this.isTrack ? new Date() : null;
  }

  onSubmit(): void {
    if (this.content && this.content.length > 200) {
      this._toast.show('内容超过200', 1800);
      return;
    }
    const data = Object.assign({}, {
      studentNum: JSON.parse(localStorage.getItem('userinfo')).studentList[0].stuNum,
      createCode: JSON.parse(localStorage.getItem('info')).username,
      content: this.content,
      traceDate: moment(this.trackTime).format('x'),
      listeningStatus: this.listeningStatus,
      mainStatus: this.mainStatus,
    });
    if (!this.isTrack) {
      delete data.traceDate;
    }
    // TODO API
    this._trackService.createTrackRecord(data).subscribe(result => {
      if (result.code === 200) {
        this.dialogRef.close({ code: 200 });
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }
}
