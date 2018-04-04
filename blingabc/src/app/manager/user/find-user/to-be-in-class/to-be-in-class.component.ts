import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { StudentService } from '../../../../services/student.service';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast/toast';
import * as moment from 'moment';

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-to-be-in-class',
  templateUrl: './to-be-in-class.component.html',
  styleUrls: ['./to-be-in-class.component.scss']
})
export class ToBeInClassComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 30;

  columns: ITdDataTableColumn[] = [
    {name: 'classCode', label: '班级编码'},
    {name: 'lessonNum', label: '课次'},
    {name: 'lessonName', label: '课时名'},
    {name: 'lessonForeignName', label: '课时外教'},
    {name: 'beginDate', label: '上课时间', format: (value) => formatTime(value)},
    {name: 'prep', label: '课前预习'},
  ];

  constructor(private _studentService: StudentService,
              private _router: Router,
              private _toast: Md2Toast) {
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
      isOver: 0,
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
}
