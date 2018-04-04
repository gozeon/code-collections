import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, TdDialogService, TdLoadingService } from '@covalent/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SelectTeacherComponent } from '../../../../dialog/select-teacher/select-teacher.component';
import { BaseService, ClassService } from './../../../../services';
import { formatTimeArrToZh } from './../../class-time/time.utils';
import { Md2Toast } from '../../../../common/toast/toast';

@Component({
  selector: 'app-tmp-open-class',
  templateUrl: './tmp-open-class.component.html',
  styleUrls: ['./tmp-open-class.component.scss']
})
export class TmpOpenClassComponent implements OnInit {
  form: FormGroup;

  // classTmp
  id: number;
  state: number;
  // templateName: string;
  livePrice: number;
  freeLesson: number;
  liveContain: number;
  sendMaterial: number; // 0 | 1
  classStartDate: string;
  quantity: number;

  // table
  LessonColumns: ITdDataTableColumn[] = [
    { name: 'courseCode', label: '课程编号', },
    { name: 'courseName', label: '课程名', },
    { name: 'courseDescribe', label: '介绍', },
    { name: 'levelName', label: '适用水平', },
    { name: 'termName', label: '适用学季', },
    { name: 'courseTypeName', label: '类型', },
    { name: 'lessonTotal', label: '包含课时数量', },
  ];
  LessonData = [];

  teacherColumns: ITdDataTableColumn[] = [
    { name: 'id', label: '操作' },
    { name: 'number', label: '外教编号' },
    { name: 'name', label: '外教名' },
    { name: 'nationalityName', label: '国籍' },
    { name: 'sex', label: '性别' },
  ];
  teacherData: any[] = [];

  templateLessonList = [];

  // select
  times: any[];
  classlabels: any[];
  stages: any[];
  selected = {
    schoolTimeId: '',
    classLabel: '',
    stage: ''
  };

  // disabled
  classLabelDisabled;
  classStartDateDisabled;
  schoolTimeDisabled;
  stageDisabled;

  constructor(public _dialog: MatDialog, private _baseService: BaseService, private _classService: ClassService,
    private fb: FormBuilder, private _router: ActivatedRoute, private _toast: Md2Toast, private _route: Router,
    private _dialogService: TdDialogService, private _loadingService: TdLoadingService) {
    this.form = this.fb.group({
      'livePrice': ['', Validators.required],
      'freeLesson': ['', Validators.required],
      'liveContain': [''],
    });
  }

  ngOnInit() {
    this.createSelections();
    this.getClassTMPInfoById();
  }

  getClassTMPInfoById(): void {
    this._router.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        this._classService.getTemplateById(parms['id']).subscribe(c => {
          this.LessonData = [c.course]
          this.id = c.id;
          this.state = c.state;
          if (c.livePrice != null) {
            this.livePrice = c.livePrice;
            this.form.controls['livePrice'].disable();
          }
          if (c.freeLesson != null) {
            this.freeLesson = c.freeLesson;
            this.form.controls['freeLesson'].disable();
          }
          if (c.liveContain != null) {
            this.liveContain = c.liveContain;
            this.form.controls['liveContain'].disable();
          }

          this.classLabelDisabled = c.classLabel ? true : false;
          this.classStartDateDisabled = c.classStartDate ? true : false;
          this.schoolTimeDisabled = c.schoolTimeId ? true : false;
          this.stageDisabled = c.stage ? true : false;

          this.sendMaterial = c.sendMaterial;
          this.classStartDate = c.classStartDate ? moment(c.classStartDate).format() : null;
          this.selected = {
            schoolTimeId: c.schoolTimeId,
            classLabel: c.classLabel,
            stage: c.stage
          };

          if (c.templateLessonList && c.templateLessonList.length > 0) {
            this.templateLessonList = c.templateLessonList.map(i => {
              i.startAt = this.checkTime(i.beginDate);
              return i;
            });
          }
        });
      }
    });
  }

  createSelections(): void {
    this._baseService.getAllTime().subscribe(v => {
      this.times = v.map(i => {
        i.schoolTimeTxt = formatTimeArrToZh(i.schoolTime)
        return i;
      });
    });
    this._baseService.getAllClasslabels().subscribe(v => this.classlabels = v);
    this._baseService.getAllStages().subscribe(v => this.stages = v);
  }

  openSelectTeacherDialog() {
    if (this.classStartDate && this.selected.schoolTimeId) {
      this._dialog.open(SelectTeacherComponent, { width: '70%', data: { isOnly: false } }).afterClosed().subscribe(data => {
        if (data) {
          this.teacherData = data;
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

  checkTime(t: number): string {
    if (t) {
      return moment(t).format('YYYY-MM-DD HH:mm');
    } else {
      return '无';
    }
  }

  delete(id: number): void {
    this.teacherData = this.teacherData.filter(i => i.id !== id);
  }

  onSubmit(formValue: any): void {
    if (formValue.livePrice === '' || formValue.freeLesson === '') {
      this._toast.show('价格和课时数不能为空', 1800);
      return;
    }

    const data = Object.assign({}, formValue, this.selected, {
      templateId: this.id,
      sendMaterial: this.sendMaterial ? 1 : 0,
      classStartDate: this.classStartDate ? moment(this.classStartDate).format('x') : null
    });

    if (this.quantity) {
      data.quantity = this.quantity;
    }

    if (this.teacherData.length > 0) {
      data.foreignIds = this.teacherData.map(i => i.id);
    }

    this._loadingService.register();
    this._classService.createClassByTMP(data).subscribe(v => {
      this._loadingService.resolve();
      if (v.code === 200) {
        this.success('开班');
      } else {
        this._toast.show(v.msg, 1800);
      }
    });

  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/class/list']);
  }
}
