import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPageChangeEvent, ITdDataTableColumn, TdDialogService } from '@covalent/core';
import { ForeignTeacherService } from '../../../services/foreign-teacher.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ForeignMarkAbsentComponent } from '../../../dialog/foreign-mark-absent/foreign-mark-absent.component';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {
  form: FormGroup;

  date = {
    startAt: '',
    endAt: ''
  };

  isShowReset;

  // table
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'lessonDate', label: `Lesson Date` },
    { name: 'name', label: `Teacher's Name` },
    { name: 'classCode', label: 'Class ID' },
    { name: 'id_backup', label: 'Lesson ID' },
    { name: 'courseTypeENName', label: 'Lesson Type' },
    { name: 'classLessonName', label: 'Lesson' },
    { name: 'registeredStudentCount', label: 'Registered Student' },
    { name: 'phone', label: 'Mobile' },
    { name: 'stateName', label: 'Lesson Status' },
    { name: 'id', label: '' },
  ];

  constructor(private fb: FormBuilder, private _dialogService: TdDialogService,
    private _foreignTeacherService: ForeignTeacherService, private _dialog: MatDialog,
    private _toast: Md2Toast) {
    this.form = this.fb.group({
      'firstName': [''],
      'phone': [''],
      'classLessonId': [''],
      'classCode': [''],
    });
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, this.form.value, {
      page: this.page,
      size: this.pageSize,
      startDate: this.date.startAt ? moment(this.date.startAt).format('x') : null,
      endDate: this.date.endAt ? moment(this.date.endAt).format('x') : null,
    });

    // TODO API
    this._foreignTeacherService.getAllClassWithForeignTeacher(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        item.lessonDate = item.beginDate ? moment(item.beginDate).format('YYYY-MM-DD HH:mm') : null;
        item.id_backup = item.id;
        return item;
      });
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  query(): void {
    // 时间缺少一个
    if ((!this.date.startAt && this.date.endAt) || (this.date.startAt && !this.date.endAt)) {
      this.warn('Time conditions are incomplete');
      return;
    }

    if (this.date.startAt && this.date.endAt) {
      if (!moment(this.date.startAt).isBefore(moment(this.date.endAt))) {
        this.warn('please set a correct time period.');
        return;
      }
    }


    this.page = 1;

    // TODO API
    this.isShowReset = true;
    this.filter();
  }

  reset(): void {
    this.date = {
      startAt: '',
      endAt: ''
    };
    this.form.reset();
    this.isShowReset = false;
    this.filter();
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: `Warn`,
      message: msg,
    });
  }

  openDialog(row: any): void {
    this._dialogService.open(ForeignMarkAbsentComponent, { width: '50%', height: '60%', data: row })
      .afterClosed().subscribe(r => {
        if (r && r.code) {
          this.filter();
          this._toast.show('修改成功', 1800);
        }
      });
  }
}
