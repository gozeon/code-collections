import { Component, OnInit, Inject } from '@angular/core';
import { Md2Toast } from '../../common/toast/toast';
import {
  ITdDataTableColumn, IPageChangeEvent, TdDialogService, TdDataTableService
} from '@covalent/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseService, keyCodetoValue, ClassService } from '../../services';

@Component({
  selector: 'app-open-class-to',
  templateUrl: './open-class-to.component.html',
  styleUrls: ['./open-class-to.component.scss']
})
export class OpenClassToComponent implements OnInit {
  // paging
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  currentPage = 1;
  pageSize = 5;

  // table
  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '操作', },
    { name: 'type', label: '类型', },
    { name: 'className', label: '班级名称', },
    { name: 'season', label: '学季', },
    { name: 'level', label: '等级', },
    { name: 'schoolTime', label: '上课时间', },
    { name: 'startAt', label: '开课日期', },
    { name: 'totalPrice', label: '总价', },
    { name: 'foreignTeacherName', label: '外教', },
    { name: 'classTeacherName', label: '班主任', },
  ];

  // select
  distributions: any[] = [];
  distribution: number;

  constructor(private _baseService: BaseService, private _dialog: MatDialog,
    private _classService: ClassService, private _dialogService: TdDialogService,
    private _toast: Md2Toast, @Inject(MAT_DIALOG_DATA) public data: any,
    private _dataTableService: TdDataTableService, public dialogRef: MatDialogRef<OpenClassToComponent>, ) {
  }
  ngOnInit() {
    this._baseService.getAllDistributions().subscribe(v => this.distributions = keyCodetoValue(v));
    this.filter();
  }

  filter(): void {
    const newDate = this.data;
    this.filteredTotal = this.data.length;
    this.filteredData = this._dataTableService.pageData(newDate, this.fromRow, this.currentPage * this.pageSize);
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;

    this.filter();
  }

  delete(id: number): void {
    this.data = this.data.filter(i => i.id !== id);
    this.filter();
  }

  submit(): void {
    if (!this.distribution || this.data.length === 0) {
      this._toast.show('信息不完整', 1800);
    } else {
      this._classService.updateAllClassDistribution(this.distribution, this.data.map(i => i.id)).subscribe((v: boolean) => {
        if (v) {
          this._toast.show('修改成功', 1800);
          this.dialogRef.close(true);
        } else {
          this._toast.show('修改失败', 1800);
        }
      });
    }
  }

}
