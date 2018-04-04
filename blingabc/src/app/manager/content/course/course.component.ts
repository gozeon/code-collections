import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, TdDialogService, TdDataTableService,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent
} from '@covalent/core';
import { Router } from '@angular/router';

import { BaseService, LessonService, keyCodetoValue } from './../../../services';
import { Store } from '@ngrx/store';
import * as CourseAction from '../../../action/course-action';
import { CourserFilterState, initCourserFilterState } from '../../../reducer/course-reducer';
import { AppState } from '../../../reducer/index';
import { Observable } from 'rxjs/Observable';
import { tableWidth } from '../../setting';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-content-manager-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class ContentManagerCourseComponent implements OnInit {

  seasons: any[] = [];
  types: any[] = [];
  levels: any[] = [];
  selected: CourserFilterState;

  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'state', label: '是否发布'},
    {name: 'name', label: '课时名'},
    {name: 'preview', label: '课前预习', width: tableWidth.number * 2},
    {name: 'coursewareForClass', label: '上课课件', width: tableWidth.number * 2},
    {name: 'coursewareForPreparation', label: '备课课件', width: tableWidth.number * 2},
    {name: 'exercises', label: '课后作业', width: tableWidth.number * 2},
    {name: 'pictureBook', label: '绘本', width: tableWidth.number * 2},
    {name: 'isTestCourse', label: '是否测评课'},
  ];

  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;

  constructor(private _dialogService: TdDialogService,
              private _dataTableService: TdDataTableService,
              private _lessonService: LessonService,
              private _toast: Md2Toast,
              private router: Router,
              private _baseService: BaseService,
              private store: Store<AppState>) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = keyCodetoValue(v));
    this._baseService.getAllCourseType().subscribe(v => this.types = keyCodetoValue(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = keyCodetoValue(v));
    this.store.select('course').map(r => r).subscribe(r => this.selected = r);
  }

  ngOnInit(): void {
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;

    this.filter();
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  filter(): void {
    this.store.dispatch(new CourseAction.Change(this.selected));
    // NOTE 多选之后，点击发布，成功之后重置 || 请求之前重置
    this.selectData = [];
    this._lessonService.getAllLessons(Object.assign({
      page: this.page,
      size: this.pageSize,
      name: this.searchTerm
    }, this.selected)).subscribe(v => {
      this.filteredData = v.list;
      this.filteredTotal = v.total;
    });
  }

  createLesson(): void {
    if (this.checkState(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在未发布的课程!`,
        closeButton: '确定'
      });
      return;
    } else {
      // NOTE localStorage -> courseLessonList
      window.localStorage.setItem('courseLessonList', JSON.stringify(this.selectData.map(i => {
        i.lessonName = i.name;
        return i;
      })));
      this.router.navigate(['/main/content/lesson/add']);
    }
  }

  selectAllEvent(v: ITdDataTableSelectAllEvent): void {
    if (v.selected) {
      this.selectData = [...new Set(this.selectData.concat(v.rows))];
    } else {
      for (let i = 0; i < v.rows.length; i++) {
        this.selectData = this.selectData.filter(item => {
          return item.id !== v.rows[i].id;
        });
      }
    }
  }

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData.push(v.row);
    } else {
      this.selectData = this.selectData.filter(item => item.id !== v.row.id)
    }
  }

  publish(lesson: any): void {
    this._dialogService.openConfirm({
      title: `发布课时`,
      message: `确定要发布 ${lesson.name} 课程？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._lessonService.publishLesson(lesson.id, {state: 20})
          .subscribe((v: boolean) => {
            if (v) {
              this._toast.show('发布成功', 1800);
              this.reset();
            } else {
              this._toast.show('发布失败', 1800);
            }
          });
      }
    });
  }

  delete(lesson: any): void {
    if (lesson.state == 20) {
      this._dialogService.openAlert({
        title: '警告',
        message: '已发布的课时不能删除',
      });
      return;
    }
    this._dialogService.openConfirm({
      title: `删除课时`,
      message: `确定要删除 ${lesson.name} 课时？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._lessonService.deleteLessonById(lesson.id)
          .subscribe((v: boolean) => {
            if (v) {
              this._toast.show('删除成功', 1800);
              this.reset();
            } else {
              this._toast.show('删除失败', 1800)
            }
          });
      }
    });
  }

  reset(): void {
    // this.selected = { level: '', term: '', courseType: '' };
    this.store.dispatch(new CourseAction.Reset());
    this.filter();
  }

  checkState(lessons: any[]): boolean {
    for (let i = 0; i < lessons.length; i++) {
      if (Boolean(lessons[i].state == 10)) {
        return Boolean(lessons[i].state == 10);
      }
    }
  }
}
