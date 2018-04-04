import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { FileService } from '../../../../services/file.service';
import { courseAuth } from '../auth';
import { MatDialog } from '@angular/material';
import { SelectPrepComponent } from '../../../../dialog/select-prep/select-prep.component';
import { SelectHomeworkComponent } from '../../../../dialog/select-homework/select-homework.component';
import { checkFileSize, checkFileType, createResource, Resources } from '../utils';
import { LessonService } from '../../../../services/lesson.service';
import { TdLoadingService } from '@covalent/core';
import { Md2Toast } from '../../../../common/toast/index';
import { Router } from '@angular/router';
import { SelectPracticeComponent } from '../../../../dialog/select-practice/select-practice.component';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  // select
  seasons: any[];
  types: any[];
  levels: any[];

  // course
  course = {
    name: '',
    lessonNum: undefined,
    isTestCourse: false,
    whenLong: undefined,
    vocabulary: '',
    mouseId: undefined,
    term: '',
    level: '',
    courseType: '',
  };

  cover = {
    name: '',
    url: ''
  };

  loading = {
    cover: false,
    courseWareForClass: false,
    lessonPreparationCourseWare: false
  };

  prep = {
    state: undefined,
    id: undefined,
    name: undefined,
  };

  homework = {
    state: undefined,
    id: undefined,
    name: undefined,
  };

  practice = {
    state: undefined,
    id: undefined,
    name: undefined,
  };

  courseWareForClass = {
    name: undefined,
    url: undefined,
  };

  lessonPreparationCourseWare = {
    name: undefined,
    url: undefined,
  };

  auth = courseAuth();

  constructor(private _baseService: BaseService,
              private _fileService: FileService,
              private _dialog: MatDialog,
              private _lessonService: LessonService,
              private _loadingService: TdLoadingService,
              private _toast: Md2Toast,
              private _router: Router) {
    this.createSelections();
  }

  onSubmit(): void {
    const data = Object.assign(
      {},
      this.course,
      {
        isTestCourse: this.course.isTestCourse ? 1 : 0,
        coveUrl: this.cover.url,
        resources: [
          createResource(Resources.PREVIEW, this.prep),
          createResource(Resources.PICTURE_BOOK, this.homework),
          createResource(Resources.COURSE_WARE_FOR_CLASS, this.courseWareForClass),
          createResource(Resources.COURSE_WARE_FOR_PREPARATION, this.lessonPreparationCourseWare),
          createResource(Resources.EXERCISES, this.practice),
        ]
      }
    );

    // TODO API
    this._loadingService.register();
    this._lessonService.createLesson(data).subscribe(v => {
      this._loadingService.resolve();
      if (v.code === 200) {
        this._toast.show('添加成功', 1800);
        this._router.navigate(['/main/content/course']);
      }
    });

  }

  createSelections(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
    this._baseService.getAllCourseType().subscribe(v => this.types = (v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = (v));
  }

  uploadCoverImage(e: any): void {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      this.loading.cover = true;
      this._fileService.uploadPublicRead(formData).subscribe(result => {
        if (verifyMiddleWare(result)) {
          this.loading.cover = false;
          this.cover = {
            name: result.data.fileName,
            url: result.data.url,
          };
        }
      });

    }
  }

  uploadClassCourseWare(e: any): void {
    if (e.target.files && e.target.files[0]) {
      if (checkFileSize(+e.target.files[0].size, 100)) {
        this._toast.show('文件大于100M', 1800);
        e.target.value = '';
        return;
      }

      if (!checkFileType(e.target.files[0].name, ['ppt', 'pptx', 'pdf'])) {
        this._toast.show('不支持该文件类型', 1800);
        e.target.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      this.loading.courseWareForClass = true;
      this._fileService.uploadPublicRead(formData).subscribe(result => {
        if (verifyMiddleWare(result)) {
          this.loading.courseWareForClass = false;
          this.courseWareForClass = {
            name: result.data.fileName,
            url: result.data.url,
          };
        }
      });

    }
  }

  uploadLessonPreparationCourseWare(e: any): void {
    if (e.target.files && e.target.files[0]) {
      if (checkFileSize(+e.target.files[0].size, 100)) {
        this._toast.show('文件大于100M', 1800);
        e.target.value = '';
        return;
      }

      if (!checkFileType(e.target.files[0].name, ['ppt', 'pptx', 'pdf'])) {
        this._toast.show('不支持该文件类型', 1800);
        e.target.value = '';
        return;
      }

      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      this.loading.lessonPreparationCourseWare = true;
      this._fileService.uploadPublicRead(formData).subscribe(result => {
        if (verifyMiddleWare(result)) {
          this.loading.lessonPreparationCourseWare = false;
          this.lessonPreparationCourseWare = {
            name: result.data.fileName,
            url: result.data.url,
          };
        }
      });

    }
  }

  needPreviewChange(): void {
    if (!this.prep.state) {
      this.prep = {
        state: this.prep.state,
        id: undefined,
        name: undefined,
      };
    }
  }

  needHomeworkChange(): void {
    if (!this.homework.state) {
      this.homework = {
        state: this.homework.state,
        id: undefined,
        name: undefined,
      };
    }
  }

  needPracticeChange(): void {
    if (!this.practice.state) {
      this.practice = {
        state: this.practice.state,
        id: undefined,
        name: undefined,
      };
    }
  }

  openDialogSelectHomework(): void {
    this._dialog.open(SelectHomeworkComponent, {width: '80%', height: '500px'})
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.homework = {
            state: this.homework.state,
            id: data.id,
            name: data.name,
          };
        }
      });
  }

  openDialogSelectPrep(): void {
    this._dialog.open(SelectPrepComponent, {width: '80%', height: '500px'})
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.prep = {
            state: this.prep.state,
            id: data.id,
            name: data.name,
          };
        }
      });
  }

  openDialogSelectPractice(): void {
    this._dialog.open(SelectPracticeComponent, {width: '80%', height: '500px'})
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.practice = {
            state: this.practice.state,
            id: data.homeworkId,
            name: data.name,
          };
        }
      });
  }
}
