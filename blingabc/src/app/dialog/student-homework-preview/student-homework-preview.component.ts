import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';
import { ITdDataTableColumn } from '@covalent/core';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-homework-preview',
  templateUrl: './student-homework-preview.component.html',
  styleUrls: ['./student-homework-preview.component.scss']
})
export class StudentHomeworkPreviewComponent implements OnInit {
  filteredData: any[] = [];
  columns: ITdDataTableColumn[] = [
    {name: 'seq', label: '序号'},
    {name: 'voiceUrl', label: '原始音频'},
    {name: 'myanswer', label: '学生配音'},
    {name: 'imgUrl', label: '图片'},
    {name: 'textInfo', label: '文字'},
    {name: 'grade', label: '配音评分'},
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<StudentHomeworkPreviewComponent>,
              private _toast: Md2Toast,
              private _studentService: StudentService) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this._studentService.getVoiceRecording({
      homeworkId: this.data.homeworkId,
      timenum: this.data.timenum,
      studentNum: this.data.studentNum
    }).subscribe(result => {
      this.filteredData = result;
    });
  }
}
