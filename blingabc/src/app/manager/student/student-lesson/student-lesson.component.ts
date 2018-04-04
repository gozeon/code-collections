import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import * as moment from 'moment';
import { StudentService } from '../../../services/student.service';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../common/toast/toast';
import { tableWidth } from '../../setting';
import { EeoService } from '../../../services/eeo.service';
import { MatDialog } from '@angular/material';
import { QrcodeComponent } from '../../../dialog/qrcode/qrcode.component';
import { ENV } from '../../../services/api.config';

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-student-lesson',
  templateUrl: './student-lesson.component.html',
  styleUrls: ['./student-lesson.component.scss']
})
export class StudentLessonComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 30;

  searchOptions = {
    classCode: undefined,
    parentMobile: undefined,
    lessonForeignName: undefined,
    beginDate: moment().format('YYYY-MM-DD'),
    isOver: false
  };

  columns: ITdDataTableColumn[] = [
    {name: 'stuId', label: '操作', width: tableWidth.number},
    {name: 'classCode', label: '班级编码'},
    {name: 'parentMobile', label: '手机号'},
    {name: 'enName', label: '英文名'},
    {name: 'beginDate', label: '课时上课时间', format: (value) => formatTime(value)},
    {name: 'lessonNum', label: '课次'},
    {name: 'lessonName', label: '课程名称'},
    {name: 'lessonForeignName', label: '课时外教'},
    {name: 'validPeriod', label: '出勤时长'},
    {name: 'prep', label: '课前'},
    {name: 'homework', label: '课后'},
    {name: 'classTeacherName', label: '班主任'},
  ];

  constructor(private _studentService: StudentService,
              private _router: Router,
              private _toast: Md2Toast,
              private _eeoService: EeoService,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    const data = Object.assign({},
      this.searchOptions,
      {
        page: this.page,
        size: this.pageSize,
        beginDate: this.searchOptions.beginDate ? moment(this.searchOptions.beginDate).format('x') : undefined,
        isOver: this.searchOptions.isOver ? 1 : undefined
      });

    this._studentService.getAllLesson(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        if (item.previewId) {
          if (item.previewFinish === 0) {
            item.prep = '未完成';
          } else if (item.previewFinish === 1) {
            item.prep = '已完成';
          }
        } else {
          item.prep = '无预习';
        }

        if (item.homeworkId) {
          if (item.homeworkFimish === 0) {
            item.homework = '未完成';
          } else if (item.homeworkFimish === 1) {
            item.homework = item.grade + '分';
          }
        } else {
          item.homework = '无作业';
        }

        return item;
      });
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  goToDetail(row): void {
    row.mobile = row.parentMobile;
    localStorage.setItem('userInfo', JSON.stringify(row));
    this._router.navigate(['/main/student/user/user-info']);
  }

  setDay(num): void {
    this.searchOptions.beginDate = moment().add(num, 'day').format('YYYY-MM-DD');
    this.filter();
  }

  showMessage(msg: string): void {
    this._toast.show(msg, 1800);
  }

  playback(row): void {
    this._eeoService.getPlayback({
      courseId: row.classId,
      classId: row.lessonId
    }).subscribe(result => {
      console.log(JSON.stringify(result));
    });
  }

  showQrcodeDialog(row: any): void {
    let uri: string;
    if (ENV === 'dev') {
      uri = `https://i.t.blingabc.com/home/readbook-share?sNum=${row.stuNum}&workId=${row.homeworkId}` +
        `&lessonId=${row.lessonId}&grade=${row.grade}&name=${row.enName}&title=${row.lessonName}&num=${row.timeNum}`;
    } else {
      uri = `https://i.blingabc.com/home/readbook-share?sNum=${row.stuNum}&workId=${row.homeworkId}` +
        `&lessonId=${row.lessonId}&grade=${row.grade}&name=${row.enName}&title=${row.lessonName}&num=${row.timeNum}`;

    }
    this._dialog.open(QrcodeComponent, {data: {uri: uri}});
  }
}
