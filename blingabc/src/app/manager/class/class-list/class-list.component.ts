import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, TdDialogService
  , ITdDataTableSelectEvent
} from '@covalent/core';
import { MatDialog } from '@angular/material';
import { OpenClassToComponent } from '../../../dialog/open-class-to/open-class-to.component';
import { SelectClassTeacherComponent } from '../../../dialog/select-class-teacher/select-class-teacher.component';
import { BaseService, keyCodetoValue, ClassService, appendAll } from './../../../services';
import { formatTimeArrToZh } from '../class-time/time.utils';
import * as moment from 'moment';
import { tableWidth } from '../../setting';
import { Md2Toast } from '../../../common/toast/toast';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
})
export class ClassListComponent implements OnInit {
  // select
  seasons: any[];
  types: any[];
  levels: any[];
  times: any[] = [];
  distributions: any[] = [];
  stages: any[] = [];
  states: any[] = [];
  selected = {
    term: undefined,
    level: undefined,
    courseType: undefined,
    schoolTimeId: undefined,
    distribution: undefined,
    stage: undefined,
    state: undefined,
    liveCurrentContain: undefined
  };

  // paging
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTermName = '';
  searchTermCode = '';
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;

  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'stateName', label: '上架状态'},
    {name: 'distributionName', label: '开班到'},
    {name: 'classCode', label: '班级编号'},
    {name: 'className', label: '名称', width: tableWidth.number + 40},
    {name: 'type', label: '类型'},
    {name: 'season', label: '学季'},
    {name: 'stageName', label: '期'},
    {name: 'level', label: '等级'},
    // { name: 'className', label: '班级名称', },
    {name: 'schoolTimeS', label: '上课时间'},
    // { name: 'startAt', label: '开课日期', },
    {name: 'totalPrice', label: '总价'},
    {name: 'liveCurrentContain', label: '当前报名人数'},
    {name: 'foreignTeacherName', label: '外教'},
    {name: 'classTeacherName', label: '班主任'},
  ];

  constructor(private _baseService: BaseService, private _dialog: MatDialog,
              private _classService: ClassService, private _dialogService: TdDialogService, private _toast: Md2Toast,) {

  }

  ngOnInit() {
    this.createSelections();
    this.filter();
  }

  createSelections(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = appendAll(keyCodetoValue(v)));
    this._baseService.getAllCourseType().subscribe(v => this.types = appendAll(keyCodetoValue(v)));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = appendAll(keyCodetoValue(v)));
    this._baseService.getAllDistributions().subscribe(v => this.distributions = appendAll(keyCodetoValue(v)));
    this._baseService.getAllTime().subscribe(v => {
      this.times = appendAll(v.map(i => {
        i.name = formatTimeArrToZh(i.schoolTime);
        return i;
      }));
    });
    this._baseService.getAllStages().subscribe(v => this.stages = appendAll(v));
    this._baseService.getAllStates().subscribe(v => this.states = appendAll(v));
  }

  filter(): void {
    this.selectData = [];
    this._classService.getAllClass(Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
      classCode: this.searchTermCode,
      foreignTeacherName: this.searchTermName
    })).subscribe(v => {
      if (v.list.length > 0) {
        this.filteredData = v.list.map(i => {
          i.startAt = i.classStartDate ? moment(i.classStartDate).format('YYYY-MM-DD') : null;
          i.type = i.classCourse ? i.classCourse.courseTypeName : null;
          i.season = i.classCourse ? i.classCourse.termName : null;
          i.level = i.classCourse ? i.classCourse.levelName : null;
          i.schoolTimeS = i.schoolTime ? formatTimeArrToZh(i.schoolTime) : null;
          return i;
        });
      } else {
        this.filteredData = [];
      }
      this.filteredTotal = v.total;
    });
  }

  reset(): void {
    this.selected = {
      term: undefined,
      level: undefined,
      courseType: undefined,
      schoolTimeId: undefined,
      distribution: undefined,
      stage: undefined,
      state: undefined,
      liveCurrentContain: undefined
    };
    this.filter();
  }

  searchName(name: string): void {
    this.searchTermName = name;
    this.filter();
  }

  searchCode(code: string): void {
    this.searchTermCode = code;
    this.filter();
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
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

  openOpenClassToDialog(): void {
    if (this.checkStateE(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在未发布的班级!`,
        closeButton: '确定'
      });
      return;
    } else {
      this._dialog.open(OpenClassToComponent, {width: '70%', data: this.selectData}).afterClosed().subscribe(v => {
        if (v) {
          this.filter();
        }
      });
    }
  }

  openSelectClassTeacherDialog() {
    this._dialog.open(SelectClassTeacherComponent, {
      width: '70%',
      data: {isOnly: true}
    }).afterClosed().subscribe(data => {
      if (data && data.length === 1) {
        this._classService.updateAllClassTeacher(data[0].id, this.selectData.map(i => i.id)).subscribe((v: boolean) => {
          if (v) {
            this._toast.show('修改成功', 1800);
            this.reset();
          } else {
            this._toast.show('修改失败', 1800);
          }
        });
      }
    });
  }

  publishAll(): void {
    if (this.checkState(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在已发布的班级!`,
        closeButton: '确定'
      });
      return;
    } else {
      this._dialogService.openConfirm({
        title: `批量发布`,
        message: `确定要发布所选班级?`,
        cancelButton: '取消',
        acceptButton: '确定',
      }).afterClosed().subscribe((accept: boolean) => {
        if (accept) {
          // TODO API
          this._classService.publishAllClass(this.selectData.map(i => i.id)).subscribe((v: boolean) => {
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

  offTheShelf(): void {
    if (this.checkStateE(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在未发布的班级!`,
        closeButton: '确定'
      });
      return;
    } else {
      this._dialogService.openConfirm({
        title: `批量下架`,
        message: `确定要下架所选班级?`,
        cancelButton: '取消',
        acceptButton: '确定',
      }).afterClosed().subscribe((accept: boolean) => {
        if (accept) {
          // TODO API
          this._classService.offShelvesAll(this.selectData.map(i => i.id)).subscribe((v: boolean) => {
            if (v) {
              this._toast.show('下架成功', 1800);
              this.reset();
            } else {
              this._toast.show('下架失败', 1800);
            }
          });
        }
      });
    }
  }

  checkState(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].state == 20)) {
        return Boolean(items[i].state == 20);
      }
    }
  }

  checkStateE(items: any[]): boolean {
    for (let i = 0; i < items.length; i++) {
      if (Boolean(items[i].state == 10)) {
        return Boolean(items[i].state == 10);
      }
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
