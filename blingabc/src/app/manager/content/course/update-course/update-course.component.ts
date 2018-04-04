import { Component, OnInit } from '@angular/core';
import { BaseService, verifyMiddleWare } from '../../../../services/base.service';
import { FileService } from '../../../../services/file.service';
import { courseAuth } from '../auth';
import { MatDialog } from '@angular/material';
import { SelectPrepComponent } from '../../../../dialog/select-prep/select-prep.component';
import { SelectHomeworkComponent } from '../../../../dialog/select-homework/select-homework.component';
import { checkFileSize, checkFileType, createResource, formatState, getResource, Resources } from '../utils';
import { LessonService } from '../../../../services/lesson.service';
import { TdLoadingService } from '@covalent/core';
import { Md2Toast } from '../../../../common/toast/index';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectPracticeComponent } from '../../../../dialog/select-practice/select-practice.component';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent {
  // select
  seasons: any[];
  types: any[];
  levels: any[];

  // course
  course = {
    id: undefined,
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
  disabled = {
    prep: false,
    prepCanChange: false,
    homework: false,
    homeworkCanChange: false,
    practice: false,
    practiceCanChange: false,
  };

  constructor(private _baseService: BaseService,
              private _fileService: FileService,
              private _dialog: MatDialog,
              private _lessonService: LessonService,
              private _loadingService: TdLoadingService,
              private _toast: Md2Toast,
              private _activatedRoute: ActivatedRoute,
              private _router: Router) {
    this.createSelections();
    this.getCourseInfoById();
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
    this._lessonService.updateLessonById(data).subscribe(v => {
      this._loadingService.resolve();
      if (v.code === 200) {
        this._toast.show('修改成功', 1800);
        this._router.navigate(['/main/content/course']);
      }
    });

  }

  createSelections(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = (v));
    this._baseService.getAllCourseType().subscribe(v => this.types = (v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = (v));
  }

  getCourseInfoById(): void {
    this._activatedRoute.params.subscribe(params => {
      if (Boolean(params['id'])) {
        this._lessonService.getLessonById(params['id']).subscribe(result => {
          this.course = {
            id: result.id,
            name: result.name,
            lessonNum: result.lessonNum,
            isTestCourse: Boolean(result.isTestCourse),
            whenLong: result.whenLong,
            vocabulary: result.vocabulary,
            mouseId: result.mouseId,
            term: result.term,
            level: result.level,
            courseType: result.courseType,
          };

          this.cover = {
            name: '',
            url: result.coveUrl
          };

          this.prep = {
            state: formatState(getResource(Resources.PREVIEW, result.resources).resourceState),
            id: getResource(Resources.PREVIEW, result.resources).resourceRelationId,
            name: getResource(Resources.PREVIEW, result.resources).resourceName,
          };

          this.homework = {
            state: formatState(getResource(Resources.PICTURE_BOOK, result.resources).resourceState),
            id: getResource(Resources.PICTURE_BOOK, result.resources).resourceRelationId,
            name: getResource(Resources.PICTURE_BOOK, result.resources).resourceName,
          };

          this.practice = {
            state: formatState(getResource(Resources.EXERCISES, result.resources).resourceState),
            id: getResource(Resources.EXERCISES, result.resources).resourceRelationId,
            name: getResource(Resources.EXERCISES, result.resources).resourceName,
          };

          this.courseWareForClass = {
            name: getResource(Resources.COURSE_WARE_FOR_CLASS, result.resources).resourceName,
            url: getResource(Resources.COURSE_WARE_FOR_CLASS, result.resources).resourceUrl,
          };

          this.lessonPreparationCourseWare = {
            name: getResource(Resources.COURSE_WARE_FOR_PREPARATION, result.resources).resourceName,
            url: getResource(Resources.COURSE_WARE_FOR_PREPARATION, result.resources).resourceUrl,
          };

          this.disabled.prep = this.prep.state && result.state === 20;
          this.disabled.homework = this.homework.state && result.state === 20;
          this.disabled.practice = this.practice.state && result.state === 20;

          this.disabled.prepCanChange = this.disabled.prep && this.prep.id;
          this.disabled.homeworkCanChange = this.disabled.homework && this.homework.id;
          this.disabled.practiceCanChange = this.disabled.practice && this.practice.id;
        });
      }
    });
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

  deleteCourseWareForClass(): void {
    if (this.auth) {
      return;
    }

    // TODO API
    this._lessonService.deleteLessonResources(this.course.id, 'COURSEWARE_FOR_CLASS').subscribe(result => {
      if (result) {
        this.courseWareForClass = {
          name: undefined,
          url: undefined,
        };
      }
    });
  }

  deleteLessonPreparationCourseWare(): void {
    if (this.auth) {
      return;
    }

    // TODO API
    this._lessonService.deleteLessonResources(this.course.id, 'COURSEWARE_FOR_PREPARATION').subscribe(result => {
      if (result) {
        this.lessonPreparationCourseWare = {
          name: undefined,
          url: undefined,
        };
      }
    });
  }
}
