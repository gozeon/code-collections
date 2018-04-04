import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { StudentService } from '../../../../services/student.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { StudentHomeworkPreviewComponent } from '../../../../dialog/student-homework-preview/student-homework-preview.component';

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-homework-record',
  templateUrl: './homework-record.component.html',
  styleUrls: ['./homework-record.component.scss']
})
export class HomeworkRecordComponent implements OnInit {
  filteredData: any[] = [];

  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'homeworkName', label: '作业名称'},
    {name: 'grade', label: '等分'},
    {name: 'finishDate', label: '作答时间', format: (value) => formatTime(value)},
  ];

  constructor(private _studentService: StudentService,
              private _dialog: MatDialog) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    this._studentService.getStudentHomeWorkRecord({
      studentNum: JSON.parse(localStorage.getItem('userInfo')).studentList[0].stuNum,
      type: 1,
      finish: 1
    }).subscribe(result => {
      this.filteredData = result;
    });
  }

  showDialog(row): void {
    this._dialog.open(StudentHomeworkPreviewComponent, {width: '960px', height: '500px', data: row});
  }
}
