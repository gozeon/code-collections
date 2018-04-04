import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-foreign-teacher-comment',
  templateUrl: './foreign-teacher-comment.component.html',
  styleUrls: ['./foreign-teacher-comment.component.scss']
})
export class ForeignTeacherCommentComponent implements OnInit {
  comment = '暂无评价';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private _studentService: StudentService) {
  }

  ngOnInit() {
    this._studentService.getComments({
      classLessonId: this.data.lessonId,
      studentNum: this.data.stuNum
    }).subscribe(result => {
      if (result && result.comment) {
       this.comment = result.comment;
      }
    });
  }

}
