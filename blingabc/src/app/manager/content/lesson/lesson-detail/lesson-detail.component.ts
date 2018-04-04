import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TdDialogService, TdDataTableService,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent, TdLoadingService
} from '@covalent/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { CourseService, BaseService, keyCodetoValue, FileService } from './../../../../services';
import { SelectCourseComponent } from '../../../../dialog/select-course/select-course.component';
import { ViewImageComponent } from '../../../../dialog/view-image/view-image.component';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.scss']
})
export class CTMLessonDetailComponent implements OnInit {
  form: FormGroup;

  // lesson
  id: number;
  courseName: string;
  courseDescribe: string;
  state: number;
  courseLessonList: any[] = [];

  // select
  seasons: any[];
  types: any[];
  levels: any[];
  selected = {
    term: '',
    level: '',
    courseType: '',
  }

  // file
  file = {
    coveUrl: null
  }

  constructor(private _router: ActivatedRoute, private _baseService: BaseService,
              private _courseService: CourseService, private _toast: Md2Toast, public _dialog: MatDialog,
              private _dialogService: TdDialogService, private fb: FormBuilder, private _route: Router,
              private _fileService: FileService, private _loadingService: TdLoadingService) {
    this.form = this.fb.group({
      'courseName': ['', [Validators.required]],
      'courseDescribe': [''],
    });
  }

  ngOnInit() {
    this.createSelections();
    this.getCourseInfoById();
  }

  getCourseInfoById(): void {
    this._router.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        this._courseService.getCourseById(parms['id']).subscribe(c => {
          this.id = c.id;
          this.courseName = c.courseName;
          this.courseDescribe = c.courseDescribe;
          this.state = c.state;
          this.courseLessonList = c.courseLessonList.map(i => {
            return {
              lessonName: i.lessonName,
              lessonId: i.lessonId,
            }
          });
          this.selected = {
            term: c.term,
            level: c.level,
            courseType: c.courseType,
          }

          this.file = {
            coveUrl: c.coveUrl
          }
        })
      }
    })
  }

  createSelections(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = keyCodetoValue(v));
    this._baseService.getAllCourseType().subscribe(v => this.types = keyCodetoValue(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = keyCodetoValue(v));
    // NOTE
    if (window.localStorage.getItem('courseLessonList')) {
      this.courseLessonList = <any>JSON.parse(window.localStorage.getItem('courseLessonList'))
        .sort((a, b) => a.lessonNum - b.lessonNum)
        .map(i => {
          return {
            lessonName: i.name,
            lessonId: i.id,
          }
        });
      this.clear();
    }
  }

  delete(id: number): void {
    this.courseLessonList = this.courseLessonList.filter(i => i.lessonId !== id);

  }

  openSelectCourseDialog() {
    this._dialog.open(SelectCourseComponent, {width: '50%'}).afterClosed().subscribe(data => {
      if (data) {
        this.courseLessonList = this.deduplication(this.courseLessonList, data.map(i => {
          return {
            lessonName: i.name,
            lessonId: i.id,
          }
        }));
      }
    });
  }

  onSubmit(formValue: any): void {
    // name不能为空 & 都不能为空 2017/9/21
    if (!formValue.courseName || !formValue.courseDescribe || !this.selected.courseType ||
      !this.selected.level || !this.selected.term || this.courseLessonList.length === 0) {
      this._toast.show('信息不全!', 2000);
      return;
    }

    const data = Object.assign(formValue, this.file, this.selected,
      {
        courseLessonList: this.courseLessonList
      });

    if (this.id && this.state == 20) {
      // 发布不能修改
      this._dialogService.openAlert({
        title: `警告`,
        message: `已发布的课程不能修改!`,
        closeButton: '确定'
      });
      return;
    } else if (this.id && this.state == 10) {
      // update
      this._loadingService.register();
      this._courseService.updateCourseByid(this.id, data).subscribe((v: boolean) => {
        this._loadingService.resolve();
        if (v) {
          this.success('修改');
        } else {
          this._toast.show('修改失败', 1800);
        }
      });
      return;
    } else {
      // 增加
      this._loadingService.register();
      this._courseService.createCourse(data).subscribe((v: boolean) => {
        this._loadingService.resolve();
        if (v) {
          this.success('添加');
        } else {
          this._toast.show('添加失败', 1800);
        }
      });

      return;
    }
  }

  clear(): void {
    // NOTE localStorage remove --> courseLessonList
    window.localStorage.removeItem('courseLessonList');
  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/content/lesson']);
  }

  /**
   * 对象数组去重
   */
  deduplication(arr1: any[], arr2: any[]): any[] {
    return [...new Set(arr1.map(i => JSON.stringify(i)).concat(arr2.map(i => JSON.stringify(i))))].map(i => JSON.parse(i));
  }

  showImageExampleDialog(e: any): void {
    this._dialog.open(ViewImageComponent, {width: '50%', data: e.target.src})
  }

  uploadfile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      this._fileService.uploadPublicRead(formData).subscribe(r => {
        if (r.code == '10000' && r.msg === 'ok') {
          this.file.coveUrl = r.data.url;
        } else {
          this._toast.show(r.msg, 1800);
        }
      })
    }
  }
}
