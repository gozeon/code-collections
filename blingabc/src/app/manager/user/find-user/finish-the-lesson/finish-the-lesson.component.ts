import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import * as moment from 'moment';
import { StudentService } from '../../../../services/student.service';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast/toast';
import { MatDialog } from '@angular/material';
import { ForeignTeacherCommentComponent } from '../../../../dialog/foreign-teacher-comment/foreign-teacher-comment.component';

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-finish-the-lesson',
  templateUrl: './finish-the-lesson.component.html',
  styleUrls: ['./finish-the-lesson.component.scss']
})
export class FinishTheLessonComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 30;

  columns: ITdDataTableColumn[] = [
    {name: 'stuId', label: '操作'},
    {name: 'classCode', label: '班级编码'},
    {name: 'lessonNum', label: '课次'},
    {name: 'lessonName', label: '课时名'},
    {name: 'lessonForeignName', label: '课时外教'},
    {name: 'beginDate', label: '上课时间', format: (value) => formatTime(value)},
    {name: 'validPeriod', label: '出勤时长'},
    {name: 'prep', label: '课前预习'},
    {name: 'homework', label: '课后作业'},
  ];

  constructor(private _studentService: StudentService,
              private _router: Router,
              private _toast: Md2Toast,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    const parentMobile = JSON.parse(localStorage.getItem('userInfo')).mobile;
    if (!parentMobile) {
      return;
    }
    const data = Object.assign({}, {
      isOver: 1,
      page: this.page,
      size: this.pageSize,
      parentMobile: parentMobile
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

  openDialog(row): void {
    this._dialog.open(ForeignTeacherCommentComponent, {
      data: row
    });
  }
}
