import { Component, OnInit, Inject } from '@angular/core';

import { BaseService, keyCodetoValue, CourseService } from '../../services';
import {
  ITdDataTableColumn,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent
} from '@covalent/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-lesson',
  templateUrl: './select-lesson.component.html',
  styleUrls: ['./select-lesson.component.scss']
})
export class SelectLessonComponent implements OnInit {
  // selection
  seasons: any[] = [];
  types: any[] = [];
  levels: any[] = [];
  selected = {level: '', term: '', courseType: ''};
  selectData: any[] = [];

  // paging
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 5;
  columns: ITdDataTableColumn[] = [
    {name: 'courseCode', label: '课程编号'},
    {name: 'courseName', label: '课程名'},
    {name: 'levelName', label: '适用水平'},
    {name: 'termName', label: '适用学季'},
    {name: 'courseTypeName', label: '类型'},
    {name: 'lessonTotal', label: '包含课时数'},
  ];

  constructor(private _baseService: BaseService, private _courseService: CourseService,
              public dialogRef: MatDialogRef<SelectLessonComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createSelections();
  }

  ngOnInit() {
    this.filter();
  }

  createSelections(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = keyCodetoValue(v));
    this._baseService.getAllCourseType().subscribe(v => this.types = keyCodetoValue(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = keyCodetoValue(v));
  }


  filter(): void {
    // NOTE 默认选择已发布的课程
    this.selectData = [];
    this._courseService.getAllCourse(Object.assign({
      page: this.page,
      size: this.pageSize,
      state: 20
    }, this.selected)).subscribe(v => {
      this.filteredData = v.list;
      this.filteredTotal = v.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  reset(): void {
    this.selected = {level: '', term: '', courseType: ''};
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
}
