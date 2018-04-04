import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent,
  TdDialogService
} from '@covalent/core';
import * as moment from 'moment';
import { ConferenceService } from './../../../services';
import { MatDialog } from '@angular/material';
import { AddConferenceComponent } from '../../../dialog/add-conference/add-conference.component';
import { Md2Toast } from '../../../common/toast/toast';

@Component({
  selector: 'app-conference-config',
  templateUrl: './conference-config.component.html',
  styleUrls: ['./conference-config.component.scss']
})
export class ConferenceConfigComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    {name: 'stateName', label: '状态'},
    {name: 'name', label: '发布会名'},
    {name: 'startAt', label: '开始时间'},
    {name: 'endAt', label: '结束时间'},
    {name: 'distributionName', label: '开班到'},
    {name: 'multiple', label: '倍数'},
  ];
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;

  constructor(private _conferenceService: ConferenceService, private _dialog: MatDialog, private _toast: Md2Toast,
              private _dialogService: TdDialogService,) {
  }

  ngOnInit() {
    this.filter();
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.selectData = [];
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  filter(): void {
    // NOTE 多选之后，点击发布，成功之后重置 || 请求之前重置
    this.selectData = [];
    this._conferenceService.getAllConferences(this.page, this.pageSize).subscribe(v => {
      this.filteredData = v.list.map(i => {
        i.startAt = i.startDate ? moment(i.startDate).format('YYYY-MM-DD HH:mm') : null;
        i.endAt = i.endDate ? moment(i.endDate).format('YYYY-MM-DD HH:mm') : null;
        return i;
      });
      this.filteredTotal = v.total;
    });
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

  cancelAll(): void {
    if (this.checkState(this.selectData)) {
      this._dialogService.openAlert({
        title: `警告`,
        message: `存在状态无效的数据!`,
        closeButton: '确定'
      });
      return;
    } else {
      // TODO API
      this._conferenceService.cnacelConferences(this.selectData.map(i => i.id)).subscribe(v => {
        if (v) {
          this._toast.show('修改成功', 1800);
          this.filter();
        } else {
          this._toast.show('修改失败', 1800);
        }
      });
    }
  }

  openAddConferenceDialog(): void {
    this._dialog.open(AddConferenceComponent, {width: '50%'}).afterClosed().subscribe(v => {
      if (v.code === 200) {
        this._toast.show('添加成功', 1800);
        this.filter();
      }
    });
  }

  checkState(targes: any[]): boolean {
    for (let i = 0; i < targes.length; i++) {
      if (Boolean(targes[i].state == 10)) {
        return true;
      }
    }
  }
}
