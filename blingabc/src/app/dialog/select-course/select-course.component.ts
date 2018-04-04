import { Component, OnInit, Inject } from '@angular/core';
import { BaseService, keyCodetoValue, LessonService } from '../../services';
import {
  ITdDataTableColumn,
  IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent
} from '@covalent/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrls: ['./select-course.component.scss']
})
export class SelectCourseComponent implements OnInit {
  selected = {level: '', term: '', courseType: ''};
  seasons: any[] = [];
  types: any[] = [];
  levels: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 5;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '编号'},
    {name: 'name', label: '课时名'},
  ];
  selectData: any[] = [];

  constructor(private _baseService: BaseService, private _lessonService: LessonService,
              public dialogRef: MatDialogRef<SelectCourseComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this._baseService.getAllTerms().subscribe(v => this.seasons = keyCodetoValue(v));
    this._baseService.getAllCourseType().subscribe(v => this.types = keyCodetoValue(v));
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = keyCodetoValue(v));
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];
    this._lessonService.getAllLessons(Object.assign({
      page: this.page,
      size: this.pageSize,
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
      this.selectData = this.selectData.filter(item => item.id !== v.row.id)
    }
  }
}
