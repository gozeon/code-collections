import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { ClassService } from '../../../services/class.service';

@Component({
  selector: 'app-retired-class',
  templateUrl: './retired-class.component.html',
  styleUrls: ['./retired-class.component.scss']
})
export class RetiredClassComponent implements OnInit {
  ifSpecial;
  reviewState;
  classCode;
  telephone;

  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 30;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: ''},
    {name: 'ifSpecialName', label: '是否特殊退班'},
    {name: 'reviewStateName', label: '审核状态'},
    {name: 'telephone', label: '手机号'},
    {name: 'classCode', label: '班级编号'},
    {name: 'className', label: '班级名称'},
    {name: 'shouldNumber', label: '应退课时数'},
    {name: 'realNumber', label: '实退课时数'},
    {name: 'refundAmount', label: '退款金额'},
    {name: 'submitterName', label: '提交人'},
    {name: 'reviewerName', label: '审核人'},
  ];

  constructor(private _classService: ClassService) {
  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    const data = Object.assign({}, {
      size: this.pageSize,
      page: this.page,
      ifSpecial: this.ifSpecial,
      telephone: this.telephone,
      classCode: this.classCode,
      reviewState: this.reviewState
    });

    // TODO API
    this._classService.getQuiteClass(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  // 关键字搜索 -- 家长电话号码
  searchNum(num: string): void {
    this.telephone = num;
    this.filter();
  }

  searchCode(code: string): void {
    this.classCode = code;
    this.filter();
  }
}
