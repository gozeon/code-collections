import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, TdDialogService, TdDataTableService,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent
} from '@covalent/core';
import { BaseService, keyCodetoValue } from './../../../services';

import { CourseService } from './../../../services';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducer/index';
import { LessonFilterState } from '../../../reducer/lesson-reducer';
import * as LessonAction from '../../../action/lesson-action';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-content-manager-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class ContentManagerLessonComponent implements OnInit {
  seasons: any[];
  types: any[];
  levels: any[];
  selected: LessonFilterState;
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;

  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'state', label: '发布状态'},
    {name: 'courseCode', label: '课程编号'},
    {name: 'courseName', label: '课程名称'},
    {name: 'courseTypeName', label: '类型'},
    {name: 'lessonTotal', label: '包含课时数'},
    {name: 'publishAt', label: '发布时间'},
    {name: 'publishPeople', label: '发布人'},
  ];

  constructor(private _baseService: BaseService,
              private _courseService: CourseService,
              private _toast: Md2Toast,
              private _dialogService: TdDialogService,
              private store: Store<AppState>) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = keyCodetoValue(v));
    this._baseService.getAllCourseType().subscribe(v => this.types = keyCodetoValue(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = keyCodetoValue(v));
    this.store.select('lesson').map(r => r).subscribe(r => this.selected = r);
  }

  ngOnInit(): void {
    this.filter();
  }

  filter(): void {
    this.store.dispatch(new LessonAction.Change(this.selected));

    this.selectData = [];
    this._courseService.getAllCourse(Object.assign({
      page: this.page,
      size: this.pageSize,
      name: this.searchTerm
    }, this.selected)).subscribe(v => {
      this.filteredData = v.list;
      this.filteredTotal = v.total;
    });
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

  publishAll(): void {
    if (this.checkLessonState(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在已发布的课程!`,
        closeButton: '确定'
      });
      return;
    } else {
      this._dialogService.openConfirm({
        title: `批量发布`,
        message: `确定要发布所选课程?`,
        cancelButton: '取消',
        acceptButton: '确定',
      }).afterClosed().subscribe((accept: boolean) => {
        if (accept) {
          // TODO API
          this._courseService.publishAll(this.selectData.map(i => i.id)).subscribe((v: boolean) => {
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
      this.selectData = this.selectData.filter(item => item.id !== v.row.id);
    }
  }

  publish(course: any): void {
    this._dialogService.openConfirm({
      title: `发布课时`,
      message: `确定要发布 ${course.courseName} 课程？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._courseService.updateCourseByid(course.id, Object.assign(course, {state: 20}))
          .subscribe((v: boolean) => {
            if (v) {
              this._toast.show('发布成功', 1800);
              this.reset();
            } else {
              this._toast.show('布失败', 1800);
            }
          });
      }
    });
  }

  delete(row: any): void {
    if (row.state == 20) {
      this._dialogService.openAlert({
        title: '警告',
        message: '已发布的课程不能删除',
      });
      return;
    }
    this._dialogService.openConfirm({
      title: `删除课时`,
      message: `确定要删除 ${row.courseName} 课时？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._courseService.deleteCourseById(row.id)
          .subscribe((v: boolean) => {
            if (v) {
              this._toast.show('删除成功', 1800);
              this.reset();
            } else {
              this._toast.show('删除失败', 1800);
            }
          });
      }
    });
  }

  checkLessonState(lessons: any[]): boolean {
    for (let i = 0; i < lessons.length; i++) {
      if (Boolean(lessons[i].state == 20)) {
        return Boolean(lessons[i].state == 20);
      }
    }
  }

  reset(): void {
    // this.selected = {level: '', term: '', courseType: ''};
    this.store.dispatch(new LessonAction.Reset());

    this.selectData = [];
    this.filter();
  }
}
