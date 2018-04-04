import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { ClassService } from '../../services';

@Component({
  selector: 'app-view-course-time',
  templateUrl: './view-course-time.component.html',
  styleUrls: ['./view-course-time.component.scss']
})
export class ViewCourseTimeComponent implements OnInit {
  templateLessonList: any[] = []

  constructor(public dialogRef: MatDialogRef<ViewCourseTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _classService: ClassService, ) {
    if (data && data.id) {
      this._classService.getTemplateLessonListById(data.id).subscribe(result => {
        if (result && result.code === '10000' && result.msg === 'ok') {
          this.templateLessonList = result.data.map(i => {
            i.startAt = this.checkTime(i.beginDate);
            return i;
          });
        }
      });
    }
  }
  ngOnInit() {
  }

  checkTime(t: number): string {
    if (t) {
      return moment(t).format('YYYY-MM-DD HH:mm');
    } else {
      return '无';
    }
  }
}
