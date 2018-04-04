import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { StudentService } from '../../../services/student.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../common/toast/toast';

function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD: HH:mm');
  }
  return null;
}

@Component({
  selector: 'app-student-class',
  templateUrl: './student-class.component.html',
  styleUrls: ['./student-class.component.scss']
})
export class StudentClassComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  page = 1;
  pageSize = 30;

  searchOptions = {
    classCode: undefined,
    parentMobile: undefined,
    lessonForeignName: undefined,
    beginDate: moment().format('YYYY-MM-DD'),
  };


  columns: ITdDataTableColumn[] = [
    {name: 'stuId', label: '操作'},
    {name: 'classCode', label: '班级编码'},
    {name: 'parentMobile', label: '手机号'},
    {name: 'enName', label: '英文名'},
    {name: 'beginDate', label: '最近上课时间', format: (value) => formatTime(value)},
    {name: 'lessonForeignName', label: '课时外教'},
    {name: 'virtualPhone', label: '虚拟账号'},
    {name: 'classForeignName', label: '班级外教'},
    {name: 'classTeacherName', label: '班主任'},
  ];

  constructor(private _studentService: StudentService,
              private _router: Router,
              private _toast: Md2Toast) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {
    const data = Object.assign({},
      this.searchOptions,
      {
        page: this.page,
        size: this.pageSize,
        beginDate: this.searchOptions.beginDate ? moment(this.searchOptions.beginDate).format('x') : undefined
      });

    this._studentService.getAllClass(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  goToDetail(row): void {
    row.mobile = row.parentMobile;
    localStorage.setItem('userInfo', JSON.stringify(row));
    this._router.navigate(['/main/student/user/user-info']);
  }

  setDay(num): void {
    this.searchOptions.beginDate = moment().add(num, 'day').format('YYYY-MM-DD');
    this.filter();
  }

  showMessage(msg: string): void {
    this._toast.show(msg, 1800);
  }
}
