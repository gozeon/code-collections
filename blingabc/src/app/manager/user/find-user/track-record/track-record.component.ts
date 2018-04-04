import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdDialogService } from '@covalent/core';
import { tableWidth } from '../../../setting';
import { TrackService, UserService } from '../../../../services';
import * as moment from 'moment';
import { ShowTrackContentComponent } from '../../../../dialog/show-track-content/show-track-content.component';
import { CreateTrackRecordComponent } from '../../../../dialog/create-track-record/create-track-record.component';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-class-record',
  templateUrl: './track-record.component.html',
  styleUrls: ['./track-record.component.scss']
})
export class TrackRecordComponent implements OnInit {

  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '' },
    { name: 'trackAt', label: '跟进时间' },
    { name: 'content', label: '跟踪记录' },
    { name: 'createCode', label: '跟进人' },
  ];

  constructor(private _trackService: TrackService, private _dialog: TdDialogService, private _toast: Md2Toast,
    private _userService: UserService) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      studentNum: JSON.parse(localStorage.getItem('userInfo')).studentList[0].stuNum,
      // createCode: JSON.parse(localStorage.getItem('info')).username
    });

    this._trackService.getAllTrackRecord(data).subscribe(r => {
      if (r.list.length > 0) {
        this.filteredData = r.list.map(i => {
          i.trackAt = i.createDate ? moment(i.createDate).format('YYYY-MM-DD HH:mm') : null;
          return i;
        });

        this.filteredTotal = r.total;
      }
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  openShowDetailDialog(row: any): void {
    this._dialog.open(ShowTrackContentComponent, { width: '50%', data: row });
  }

  openCreateTrackRecordDialog(): void {
    this._dialog.open(CreateTrackRecordComponent, { width: '50%' }).afterClosed().subscribe(result => {
      if (result && result.code === 200) {
        this.filter();
        this.updateStorage(() => this._toast.show('添加成功', 1800));
      }
    });
  }

  updateStorage(cb: () => void): void {
    this._userService.getParentInfo(JSON.parse(localStorage.getItem('userInfo')).mobile).subscribe(v => {
      localStorage.setItem('userinfo', JSON.stringify(v));
      cb();
    });
  }
}
