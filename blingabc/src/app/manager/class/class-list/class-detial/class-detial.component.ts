import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, TdDialogService, TdLoadingService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import * as moment from 'moment';

import { SelectClassTeacherComponent } from '../../../../dialog/select-class-teacher/select-class-teacher.component';
import { SelectTeacherComponent } from '../../../../dialog/select-teacher/select-teacher.component';
import { formatTimeArrToZh } from './../../class-time/time.utils';
import { BaseService, ClassService } from './../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast/toast';

@Component({
  selector: 'app-class-detial',
  templateUrl: './class-detial.component.html',
  styleUrls: ['./class-detial.component.scss']
})
export class ClassDetialComponent implements OnInit {
  form: FormGroup;

  // classTmp
  id: number;
  state: number;
  templateId: number;
  livePrice: number;
  freeLesson: number;
  liveContain: number;
  sendMaterial: number; // 0 | 1
  classStartDate: string;
  quantity: number;

  // table
  LessonColumns: ITdDataTableColumn[] = [
    { name: 'courseCode', label: '课程编号' },
    { name: 'courseName', label: '课程名' },
    { name: 'courseDescribe', label: '介绍' },
    { name: 'levelName', label: '适用水平' },
    { name: 'termName', label: '适用学季' },
    { name: 'courseTypeName', label: '类型' },
    { name: 'lessonTotal', label: '包含课时数量' },
  ];
  LessonData = [];

  templateLessonList = [];

  // select
  times: any[];
  classLabels: any[];
  stages: any[];
  selected = {
    schoolTimeId: '',
    classLabel: '',
    stage: ''
  };

  // teacher
  teacher: any;
  foreignTeacherId: any;
  teacherName: string;
  classTeacher: any;
  classTeacherName: string;

  // disabled
  classLabelDisabled;

  // 是否助教
  assistant: boolean;

  constructor(private _dialog: MatDialog, private fb: FormBuilder, private _baseService: BaseService,
    private _classService: ClassService, private _router: ActivatedRoute, private _toast: Md2Toast,
    private _dialogService: TdDialogService, private _route: Router, private _loadingService: TdLoadingService) {
    this.form = this.fb.group({
      'livePrice': ['', Validators.required],
      'freeLesson': ['', Validators.required],
      'liveContain': ['', Validators.required],
    });
  }

  ngOnInit() {
    this.createSelections();
    this.getClassInfoById();
  }

  createSelections(): void {
    this._baseService.getAllTime().subscribe(v => {
      this.times = v.map(i => {
        i.schoolTimeTxt = formatTimeArrToZh(i.schoolTime);
        return i;
      });
    });
    this._baseService.getAllClasslabels().subscribe(v => this.classLabels = v);
    this._baseService.getAllStages().subscribe(v => this.stages = v);
  }

  getClassInfoById(): void {
    this._router.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this._classService.getClassById(params['id']).subscribe(c => {
          this.id = c.id;
          this.state = c.state;
          this.LessonData = [c.classCourse];
          this.sendMaterial = c.sendMaterial;
          this.classStartDate = c.classStartDate ? moment(c.classStartDate).format() : null;
          this.templateId = c.templateId;
          this.teacherName = c.foreignTeacherName;
          this.classTeacher = {
            id: c.classTeacherId,
            name: c.classTeacherName
          };
          this.classTeacherName = c.classTeacherName;
          this.assistant = c.assistant;
          this.foreignTeacherId = c.foreignTeacherId;

          if (c.livePrice !== null) {
            this.livePrice = c.livePrice;
            this.form.controls['livePrice'].disable();
          }
          if (c.freeLesson !== null) {
            this.freeLesson = c.freeLesson;
            this.form.controls['freeLesson'].disable();
          }
          if (c.liveContain !== null) {
            this.liveContain = c.liveContain;
            this.form.controls['liveContain'].disable();
          }
          this.classLabelDisabled = c.classLabel ? true : false;

          this.selected = {
            schoolTimeId: c.schoolTimeId,
            classLabel: c.classLabel,
            stage: c.stage
          };
          if (c.classLessonList && c.classLessonList.length > 0) {
            this.templateLessonList = c.classLessonList.map(i => {
              i.startAt = this.checkTime(i.beginDate);
              return i;
            });
          }
        });
      }
    });
  }

  openSelectTeacherDialog(): void {
    if (this.classStartDate && this.selected.schoolTimeId) {
      this._dialog.open(SelectTeacherComponent, { width: '70%', data: { isOnly: true } }).afterClosed().subscribe(data => {

        if (data && data.length === 1) {
          this.teacher = data[0];
          this.teacherName = this.teacher.name;
        }
      });
    } else {
      this._dialogService.openAlert({
        title: `警告`,
        message: `请填写开课日期和上课时间!`,
        closeButton: '确定'
      });
    }
  }

  openSelectClassTeacherDialog(): void {
    this._dialog.open(SelectClassTeacherComponent, {
      width: '70%',
      data: { isOnly: true }
    }).afterClosed().subscribe(data => {
      if (data && data.length === 1) {
        console.log(data[0])
        this.classTeacher = data[0];
        this.classTeacherName = this.classTeacher.name;
      }
    });
  }

  checkTime(t: number): string {
    if (t) {
      return moment(t).format('YYYY-MM-DD HH:mm');
    } else {
      return null;
    }
  }

  onSubmit(formValue: any): void {
    this._loadingService.register();
    const data = Object.assign({}, formValue, this.selected, {
      id: this.id,
      classStartDate: this.classStartDate ? moment(this.classStartDate).format('x') : null,
      sendMaterial: this.sendMaterial ? 1 : 0,
      foreignId: this.teacher ? this.teacher.id : this.foreignTeacherId,
      teacherId: this.classTeacher ? this.classTeacher.id : null,
      templateId: this.templateId,
    });

    if (formValue.livePrice === '' || formValue.freeLesson === '') {
      this._toast.show('价格和课时数不能为空', 1800);
      return;
    }

    // update
    this._classService.updateClassInfo(data).subscribe(v => {
      this._loadingService.resolve();
      if (v.code === 200) {
        this._toast.show(`修改成功!`, 1800);
        this._route.navigate(['/main/class/list']);
      } else {
        this._toast.show(v.msg, 1800);
      }
    });
  }

}
