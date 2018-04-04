import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITdDataTableColumn, TdDialogService, TdLoadingService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import { SelectLessonComponent } from '../../../../dialog/select-lesson/select-lesson.component';
import { BaseService, ClassService } from './../../../../services';
import { formatTimeArrToZh } from './../../class-time/time.utils';

import * as moment from 'moment';
import { Md2Toast } from '../../../../common/toast/toast';

@Component({
  selector: 'app-class-msg-tpl-detial',
  templateUrl: './class-msg-tpl-detial.component.html',
  styleUrls: ['./class-msg-tpl-detial.component.scss']
})
export class ClassMsgTplDetialComponent implements OnInit {
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

  // select
  times: any[];
  classlabels: any[];
  stages: any[];
  selected = {
    schoolTimeId: '',
    classLabel: '',
    stage: ''
  };

  // lesson table
  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '操作', },
    { name: 'courseCode', label: '课程编号', },
    { name: 'courseName', label: '课程名', },
    { name: 'levelName', label: '适用水平', },
    { name: 'termName', label: '适用学季', },
    { name: 'courseTypeName', label: '类型', },
    { name: 'lessonTotal', label: '包含课时数', },
  ];
  data: any[] = []; // 长度限制为 1


  constructor(private _router: ActivatedRoute, public _dialog: MatDialog, private fb: FormBuilder,
    private _baseService: BaseService, private _classService: ClassService, private _toast: Md2Toast,
    private _route: Router, private _dialogService: TdDialogService, private _loadingService: TdLoadingService) {
    this.form = this.fb.group({
      'livePrice': [''],
      'freeLesson': [''],
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
          this.id = c.id;
          this.state = c.state;
          this.livePrice = c.livePrice;
          this.freeLesson = c.freeLesson;
          this.liveContain = c.liveContain;
          this.sendMaterial = c.sendMaterial;
          this.classStartDate = c.classStartDate ? moment(c.classStartDate).format() : null;
          this.selected = {
            schoolTimeId: c.schoolTimeId,
            classLabel: c.classLabel,
            stage: c.stage
          };
          this.data = [c.course];
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

  openAddLessonDialog() {
    this._dialog.open(SelectLessonComponent, { width: '50%' }).afterClosed().subscribe(data => {
      if (data) {
        // data --> any[]
        this._classService.getAllTemplateDefault(data[0].courseType).subscribe(v => {
          this.livePrice = v.livePrice;
          this.freeLesson = v.freeLesson;
          this.liveContain = v.liveContain;
          this.sendMaterial = v.sendMaterial;
        });
        this.data = data;
      }
    });
  }

  delete(row: any): void {
    this.data = [];
  }

  onSubmit(formValue: any): void {
    if (this.data.length === 0) {
      this._toast.show('课程不能为空!', 2000);
      return;
    }

    const data = Object.assign(formValue, this.selected, {
      sendMaterial: this.sendMaterial ? 1 : 0,
      courseId: this.data[0].id,
      classStartDate: this.classStartDate ? moment(this.classStartDate).format('x') : null
    });

    if (this.id && this.state == 20) {
      // 发布不能修改
      this._dialogService.openAlert({
        title: `警告`,
        message: `已发布的模版不能修改!`,
        closeButton: '确定'
      });
      return;
    } else if (this.id && this.state == 10) {
      // update
      this._loadingService.register();
      this._classService.updateClassTemplateByid(this.id, data).subscribe(v => {
        this._loadingService.resolve();
        if (v.code === 200) {
          this.success('修改');
        } else {
          this._toast.show(v.msg, 1800);
        }
      });
      return;
    } else {
      // 增加
      this._loadingService.register();
      this._classService.createClassTemplate(data).subscribe(v => {
        this._loadingService.resolve();
        if (v.code === 200) {
          this.success('添加');
        } else {
          this._toast.show(v.msg, 1800);
        }
      });
      return;
    }
  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/class/template']);
  }
}
