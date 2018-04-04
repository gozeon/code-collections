import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdLoadingService } from '@covalent/core';
import { DistributionService } from '../../../services/distribution.service';
import * as moment from 'moment';
import { verifyMiddleWare } from '../../../services';
import { Md2Toast } from '../../../common/toast';

export function formatTime(value: string | number): string {
  if (value) {
    return moment(value).format('YYYY-MM-DD');
  }
  return null;
}

@Component({
  selector: 'app-distribution-withdraw-prohibited',
  templateUrl: './distribution-withdraw-prohibited.component.html',
  styleUrls: ['./distribution-withdraw-prohibited.component.scss']
})
export class DistributionWithdrawProhibitedComponent implements OnInit {
  search = {
    name: undefined,
    email: undefined,
  };

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'email', label: '邮箱'},
    {name: 'name', label: '姓名',},
    {name: 'createUsername', label: '操作人',},
    {name: 'createDate', label: '操作时间', format: value => formatTime(value)},
  ];

  constructor(private _distributionService: DistributionService,
              private _toast: Md2Toast,
              private _loadingService: TdLoadingService,) {
  }

  ngOnInit() {
    this.filter();
  }

  filter() {

    const data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize,
    });

    this._distributionService.getAllWithdrawProhibited(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  delete(id) {
    this._distributionService.deleteWithdrawProhibited(id).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('删除成功', 1800);
        this.filter();
      }
    });
  }

  importFile(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].name.slice(-4) !== 'xlsx') {
        event.target.value = '';
        this._toast.show('只支持xlsx格式', 1800);
        return;
      }
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      formData.append('createUsername', JSON.parse(localStorage.getItem('info')).username);
      // TODO API
      this._loadingService.register();
      this._distributionService.importWithdrawProhibited(formData).subscribe(result => {
        this._loadingService.resolve();
        if(verifyMiddleWare(result)) {
          this._toast.show('导入成功');
          this.filter();
        }
      });
    }
  }
}
