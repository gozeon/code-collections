import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { tableWidth } from '../../setting';
import { DeviceService } from '../../../services/device.service';
import * as moment from 'moment';
import { Md2Toast } from '../../../common/toast';
import { MatDialog } from '@angular/material';
import { UpdateProblemRecordComponent } from '../../../dialog/update-problem-record/update-problem-record.component';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-problem-record',
  templateUrl: './problem-record.component.html',
  styleUrls: ['./problem-record.component.scss']
})
export class ProblemRecordComponent implements OnInit {
  search = {
    startAt: undefined,
    endAt: undefined,
    status: undefined,
    classId: undefined,
    phone: undefined,
    name: undefined,
  };

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'task_id', label: '操作'},
    {name: 'name', label: '学员姓名',},
    {name: 'parent_name', label: '家长姓名',},
    {name: 'telephone', label: '手机号'},
    {name: 'class_code', label: '班级 id'},
    {name: 'type', label: '设备问题', width: tableWidth.time},
    {name: 'status', label: '状态', format: value => (['未处理', '已处理'][value])},
    {name: 'remarks', label: '备注'},
    {name: 'create_date', label: '创建时间', format: value => formatTime(value)},
    {name: 'operator', label: '操作人'},
  ];

  constructor(private _deviceService: DeviceService,
              private _toast: Md2Toast,
              private _dialog: MatDialog,) {
    this.filter();
  }

  ngOnInit() {
  }

  filter(): void {
    if (this.search.startAt && this.search.endAt) {
      if (this.verifyTime(this.search.startAt, this.search.endAt)) {
        this._toast.show('时间未填写或不合理', 1800);
        return;
      }
    }


    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      classCode: this.search.classId,
      telephone: this.search.phone,
      status: this.search.status,
      startTime: this.search.startAt ? moment(this.search.startAt).format('x') : undefined,
      endTime: this.search.endAt ? moment(this.search.endAt).format('x') : undefined,
      name: this.search.name
    });
    this._deviceService.getAllDeviceTasks(data).subscribe(result => {
      this.filteredData = result.list.map(item => {
        item.videocam = item.type.lastIndexOf(1) === -1 ? true : false;
        item.headset = item.type.lastIndexOf(2) === -1 ? true : false;
        item.mic = item.type.lastIndexOf(3) === -1 ? true : false;
        item.language = item.type.lastIndexOf(4) === -1 ? true : false;

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

  verifyTime(start, end): boolean {
    if (!start || !end) {
      return true;
    }
    return moment(start).isAfter(end);
  }

  reset(): void {
    this.search = {
      startAt: undefined,
      endAt: undefined,
      status: undefined,
      classId: undefined,
      phone: undefined,
      name: undefined,
    };

    this.filter();
  }

  /**
   * @param v  '1.5%'
   * @returns {boolean}
   */
  formatFrameLoss(v): boolean {
    if (!v) {
      return false;
    }

    const n = Number((v.split('%'))[0]);

    if (n > 1.5) {
      return false;
    }

    return true;
  }

  show(row) {
    this._dialog.open(UpdateProblemRecordComponent, {width: '50%', data: row}).afterClosed().subscribe(r => {
      if(r) {
        this.filter();
        this._toast.show('修改成功', 1800);
      }
    });
  }
}
