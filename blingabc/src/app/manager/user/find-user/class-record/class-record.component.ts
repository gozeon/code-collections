import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdDialogService } from '@covalent/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { RecedeClassComponent } from '../../../../dialog/recede-class/recede-class.component';
import { TransferClassComponent } from '../../../../dialog/transfer-class/transfer-class.component';
import { ClassService } from '../../../../services/class.service';
import * as moment from 'moment';
import { formatTimeArrToZh } from '../../../class/class-time/time.utils';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-follow-reocrd',
  templateUrl: './class-record.component.html',
  styleUrls: ['./class-record.component.scss']
})
export class ClassRecordComponent implements OnInit {
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'classId', label: '' },
    { name: 'changeStateName', label: '状态' },
    { name: 'classCode', label: '班级编号' },
    { name: 'className', label: '班级名称' },
    { name: 'stageName', label: '期' },
    { name: 'foreighTeacherName', label: '外教' },
    { name: 'schoolTimeFormat', label: '上课时间' },
    { name: 'startAt', label: '最近待上课时间' },
    { name: 'lessonNum', label: '最近待上课节' },
  ];
  stuNum;

  constructor(private _dialogService: TdDialogService, private _dialog: MatDialog,
    private _classService: ClassService, private _toast: Md2Toast, ) {
  }

  ngOnInit() {
    this.stuNum = JSON.parse(localStorage.getItem('userInfo')).studentList[0].stuNum;
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      stuNum: this.stuNum,
    });
    this._classService.getAllClassRecords(data).subscribe(result => {
      this.filteredData = result.list.filter(item => {
        item.startAt = item.beginDate ? moment(item.beginDate).format('YYYY-MM-DD HH:mm') : null;
        item.schoolTimeFormat = item.schoolTime ? formatTimeArrToZh(item.schoolTime) : null;
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

  openDialog(row: any, type: string): void {

    switch (type) {
      case 'changeClass':
        this._classService.getStudentTransferTimes(this.stuNum, row.classCode).subscribe(result => {
          this.confirm('', `该用户 ${result.year}年 ${result.term}季 ${result.courseType} 已经转班 ${result.transferTimes} 次！`)
            .subscribe(r => r ? this.showTransferClassDialog(Object.assign({}, result, row,
              { stuNum: this.stuNum, clickType: 'normal' })) : null);
        });
        break;
      case 'specialChangeClass':
        this._classService.getStudentTransferTimes(this.stuNum, row.classCode).subscribe(result => {
          this.confirm('', `该用户 ${result.year}年 ${result.term}季 ${result.courseType} 已经转班 ${result.transferTimes} 次！`)
            .subscribe(r => r ? this.showTransferClassDialog(Object.assign({}, result, row,
              { stuNum: this.stuNum, clickType: 'special' })) : null);
        });
        break;
      case 'retirement':
        const tmp = moment.duration(moment(row.beginDate).diff(moment()));
        const hour = tmp.asHours();
        const hms = moment.utc(tmp.asMilliseconds()).format('HH:mm:ss');
        if (hour > 24 || !row.beginDate) {
          this.showRecedeClassDialog(row);
          return;
        }
        this.confirm('',
          `距离下次下课还有 ${hms} ,需在上课前完成审核，是否要退班？`)
          .subscribe(r => r ? this.showRecedeClassDialog(row) : null);
        break;
      default:
        break;
    }
  }

  confirm(title: string, message: string): Observable<boolean> {
    return this._dialogService.openConfirm({
      title: title,
      message: message,
      cancelButton: '取消',
      acceptButton: '确定'
    }).afterClosed();
  }

  showRecedeClassDialog(data: any): void {
    this._dialog.open(RecedeClassComponent, { width: '70%', height: '60%', data: data }).afterClosed().subscribe(r => {
      if (r && r.code === 200) {
        this.filter();
        this._toast.show('修改成功', 1800);
      }
    });
  }

  showTransferClassDialog(data: any): void {
    this._dialog.open(TransferClassComponent, { width: '80%', height: '60%', data: data }).afterClosed().subscribe(r => {
      if (r && r.code === 200) {
        this.filter();
        this._toast.show('修改成功', 1800);
      }
    });
  }
}
