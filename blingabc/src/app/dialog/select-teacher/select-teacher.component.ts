import { Component, OnInit, Inject } from '@angular/core';
import {
  ITdDataTableColumn,
  IPageChangeEvent,
  ITdDataTableSelectAllEvent,
  ITdDataTableSelectEvent
} from '@covalent/core';
import { ForeignTeacherService } from '../../services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-select-teacher',
  templateUrl: './select-teacher.component.html',
  styleUrls: ['./select-teacher.component.scss']
})
export class SelectTeacherComponent implements OnInit {
  // search
  searchTerm: string;

  // paging
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 5;

  // select
  selectData: any[] = [];

  // table
  columns: ITdDataTableColumn[] = [
    {name: 'number', label: '编号'},
    {name: 'name', label: '姓名'},
    {name: 'nationalityName', label: '国籍'},
    {name: 'sex', label: '性别'},
  ];

  constructor(private _foreignTeacherService: ForeignTeacherService, private _toast: Md2Toast,
              public dialogRef: MatDialogRef<SelectTeacherComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.selectData = [];

    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      name: this.searchTerm,
      jobStatus: 1,
      dutyStatus: 1,
      teacherStatus: 1
    });
    this._foreignTeacherService.getAllTeacher(data).subscribe(v => {
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

  onNoClick(): void {
    if (this.data.isOnly && this.selectData.length > 1) {
      this._toast.show('不能多选', 1800);
      return;
    }
    this.dialogRef.close(this.selectData);
  }
}
