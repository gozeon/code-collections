import { Component, OnInit } from '@angular/core';
import {
  ITdDataTableColumn, IPageChangeEvent, ITdDataTableSelectAllEvent, ITdDataTableSelectEvent,
  TdDialogService,
} from '@covalent/core';
import * as moment from 'moment';
import { CRMUserService } from './../../../services';
import { MatDialog } from '@angular/material';
import { AddCrmUserComponent } from '../../../dialog/add-crm-user/add-crm-user.component';
import { Md2Toast } from '../../../common/toast/toast';

@Component({
  selector: 'app-staff-group',
  templateUrl: './staff-group.component.html',
  styleUrls: ['./staff-group.component.scss']
})
export class StaffGroupComponent implements OnInit {

  // table
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作',},
    {name: 'username', label: '账号',},
    {name: 'name', label: '姓名',},
    {name: 'phone', label: '手机号',},
    {name: 'status', label: '在职状态',},
    {name: 'createAt', label: '创建时间',},
  ];
  selectData: any[] = [];
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  searchTerm: string;

  // select
  status: number;

  constructor(private _cRMUserService: CRMUserService, private _dialogService: TdDialogService,
              private _toast: Md2Toast, private _dialog: MatDialog,) {
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
    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      username: this.searchTerm,
      status: this.status
    });

    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);

    this._cRMUserService.getAllUsers(data).subscribe(v => {
      this.filteredData = v.list.map(i => {
        i.createAt = i.createDate ? moment(i.createDate).format('YYYY-MM-DD hh:mm') : null;
        return i;
      });
      this.filteredTotal = v.total;
    });
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;

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

  openAddCRMUserDialog(): void {
    this._dialog.open(AddCrmUserComponent, {width: '50%'}).afterClosed().subscribe(v => {
      if (v && v.code === 200 && v.type === 'add') {
        this._toast.show('添加成功', 1800);
        this.filter();
      }
    });
  }

  openUpdateCRMUserDialog(row: any): void {
    this._dialog.open(AddCrmUserComponent, {width: '50%', data: row}).afterClosed().subscribe(v => {
      if (v && v.code === 200) {
        this._toast.show('操作成功', 1800);
        this.filter();
      }
    });
  }

  reset(): void {
    this.status = undefined;

    this.filter();
  }

  resetPassword(r: any): void {
    this._dialogService.openConfirm({
      title: `重置密码`,
      message: `确定要重置账户${r.username}的密码?`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._cRMUserService.resetPasswordById(r.id).subscribe(v => {
          if (v) {
            this.filter();
            this._toast.show('重置成功', 1800);
          } else {
            this._toast.show('重置失败', 1800);
          }
        });
      }
    });
  }

  updateStatus(id: number, status: number): void {
    this._dialogService.openConfirm({
      title: `修改状态`,
      message: `修改工作状态为${status === 1 ? '在职' : '离职'}?`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._cRMUserService.updateCRMUserById({id: id, status: status}).subscribe(v => {
          if (v) {
            this._toast.show('修改成功', 1800);
            this.filter();
          } else {
            this._toast.show('修改失败', 1800);
          }
        });
      }
    });
  }

  deleteAll(): void {
    this._dialogService.openConfirm({
      title: `提示`,
      message: `确定要删除所选用户？`,
      cancelButton: '取消',
      acceptButton: '确定',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // TODO API
        this._cRMUserService.deleteAll(this.selectData.map(i => i.id)).subscribe(v => {
          if (v) {
            this._toast.show('删除成功', 1800);
            this.filter();
          } else {
            this._toast.show('删除失败', 1800);
          }
        });
      }
    });
  }
}
