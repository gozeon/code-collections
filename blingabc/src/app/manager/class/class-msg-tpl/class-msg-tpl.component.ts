import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, ITdDataTableSelectEvent, ITdDataTableSelectAllEvent,
  TdDialogService, IPageChangeEvent
} from '@covalent/core';
import { Router } from '@angular/router';
import { BaseService, keyCodetoValue, ClassService, appendAll } from './../../../services';
import { formatTimeArrToZh } from '../class-time/time.utils';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ViewCourseTimeComponent } from '../../../dialog/view-course-time/view-course-time.component';
import { Md2Toast } from '../../../common/toast/toast';

@Component({
  selector: 'app-class-msg-tpl',
  templateUrl: './class-msg-tpl.component.html',
  styleUrls: ['./class-msg-tpl.component.scss'],
})
export class ClassMsgTplComponent implements OnInit {
  // select
  seasons: any[] = [];
  types: any[] = [];
  levels: any[] = [];
  times: any[] = [];
  stages: any[] = [];
  states: any[] = [];
  selected = {
    level: undefined,
    term: undefined,
    courseType: undefined,
    schoolTimeId: undefined,
    stage: undefined,
    state: undefined
  };
  selectData: any[] = [];

  // table
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'state', label: '状态'},
    {name: 'tmpId', label: '模版id'},
    {name: 'templateName', label: '名称'},
    {name: 'type', label: '类型'},
    // { name: 'courseName', label: '课程名称', },
    {name: 'term', label: '学季'},
    {name: 'stageName', label: '期'},
    {name: 'level', label: '等级'},
    {name: 'schoolTimeS', label: '上课时间'},
    // { name: 'startAt', label: '开课日期', },
    // { name: 'totalPrice', label: '总价', },
    {name: 'openClassTotle', label: '开班数'},
    // { name: 'openClassTotle', label: '上架班级数', },
    // { name: 'openClassTotle', label: '报名班级数', },
    // { name: 'openClassTotle', label: '报满班级数', },
  ];

  constructor(private _baseService: BaseService, private _classService: ClassService, private _route: Router,
              private _dialogService: TdDialogService, private _toast: Md2Toast, private _dialog: MatDialog,) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(keyCodetoValue(v)));
    this._baseService.getAllCourseType().subscribe(v => this.types = appendAll(keyCodetoValue(v)));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(keyCodetoValue(v)));
    this._baseService.getAllTime().subscribe(v => {
      this.times = appendAll(v.map(i => {
        i.name = formatTimeArrToZh(i.schoolTime);
        return i;
      }));
    });

    this._baseService.getAllStages().subscribe(v => this.stages = appendAll(v));
    this._baseService.getAllStates().subscribe(v => this.states = appendAll(v));
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];
    this._classService.getAllClassTemplate(Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
    })).subscribe(v => {
      if (v.list.length > 0) {
        this.filteredData = v.list.map(i => {
          i.tmpId = i.id;
          i.courseName = i.course.courseName;
          i.type = i.course.courseTypeName;
          i.term = i.course.termName;
          i.level = i.course.levelName;
          i.startAt = i.classStartDate ? moment(i.classStartDate).format('YYYY-MM-DD') : null;
          i.schoolTimeS = i.schoolTime ? formatTimeArrToZh(i.schoolTime) : null;
          return i;
        });
      } else {
        this.filteredData = [];
      }
      this.filteredTotal = v.total;
    });
  }

  openViewCourseTime(row: any): void {
    this._dialog.open(ViewCourseTimeComponent, {width: '50%', height: '90%', data: row})
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;

    // 暂时不支持模版名称搜索
    // this.filter();
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

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  reset(): void {
    this.selected = {
      level: undefined,
      term: undefined,
      courseType: undefined,
      schoolTimeId: undefined,
      stage: undefined,
      state: undefined
    };
    this.filter();
  }

  delete(row: any): void {
    if (row.state == 20) {
      this._dialogService.openAlert({
        title: '警告',
        message: '已发布的模版不能删除',
      });
      return;
    }
    this._dialogService.openConfirm({
      title: `删除模版`,
      message: `确定要删除 ${row.name ? row.name : ''} 模版？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._classService.deleteClassTemplate(row.id).subscribe(v => {
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

  publish(v: any): void {
    this._dialogService.openConfirm({
      title: `发布`,
      message: `确定要发布 ${v.name ? v.name : ''} 模版？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._classService.publishAll([v.id])
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

  publishAll(): void {
    if (this.checkLessonState(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在已发布的模版!`,
        closeButton: '确定'
      })
      return;
    } else {
      this._dialogService.openConfirm({
        title: `批量发布`,
        message: `确定要发布所选模版?`,
        cancelButton: '取消',
        acceptButton: '确定',
      }).afterClosed().subscribe((accept: boolean) => {
        if (accept) {
          // TODO API
          this._classService.publishAll(this.selectData.map(i => i.id)).subscribe((v: boolean) => {
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

  checkLessonState(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].state == 20)) {
        return Boolean(items[i].state == 20);
      }
    }
  }

  openClass(row: any): void {
    if (row && row.state && row.state === 20) {
      this._route.navigate(['/main/class/template/create/', row.id]);
      return;
    } else {
      this._dialogService.openAlert({
        title: `警告`,
        message: `模版未发布!`,
        closeButton: '确定'
      });
      return;
    }
  }

  filterTimes(e: any): void {
    const value = +e.target.value;
    if (value > 0 && value < 8) {
      this._baseService.getAllTime().subscribe(v => {
        this.times = appendAll(v.map(i => {
          i.name = formatTimeArrToZh(i.schoolTime);
          return i;
        })).filter(item => String(item.schoolTime).substr(0, 1) === e.target.value);
      });
    } else {
      this._baseService.getAllTime().subscribe(v => {
        this.times = appendAll(v.map(i => {
          i.name = formatTimeArrToZh(i.schoolTime);
          return i;
        }));
      });
    }
  }
}
