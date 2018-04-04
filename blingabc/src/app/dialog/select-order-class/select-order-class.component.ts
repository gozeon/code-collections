import { formatTimeArrToZh } from '../../manager/class/class-time/time.utils';
import { Component, OnInit, Inject } from '@angular/core';
import {
  ITdDataTableColumn,
  IPageChangeEvent,
} from '@covalent/core';
import { BaseService, ClassService } from '../../services';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-select-order-class',
  templateUrl: './select-order-class.component.html',
  styleUrls: ['./select-order-class.component.scss']
})
export class SelectOrderClassComponent implements OnInit {

  // ngModel 绑定 过滤参数
  selected = { level: '', term: '', courseType: '', schoolTimeId: '', distribution: '', stage: '' };
  isSelect = false;

  filteredTotal: number; // 总页数
  page = 1; // 页数
  pageSize = 5; // 条数

  seasons: any[] = [{ code: '', name: '不限' }]; // 学季
  types: any[] = [{ code: '', name: '不限' }]; // 课程类型
  levels: any[] = [{ code: '', name: '不限' }]; // 等级
  classTime: any[] = [{ id: '', schoolTimeTxt: '不限' }]; // 上课时间
  distribution: any[] = [{ code: '', name: '不限' }]; // 等级
  stages: any[] = [{ code: '', name: '不限' }]; // 分期
  selectData: any = []; // 选择的数据
  filteredData: any = []; // 显示的数据
  searchTermCode = ''; // 班级id
  columns = orderClassColumns; // 表头

  constructor(private _baseService: BaseService, private _classService: ClassService,
    public dialogRef: MatDialogRef<SelectOrderClassComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // 基础项
    this._baseService.getAllTerms().subscribe(v => {
      this.seasons = this.seasons.concat(v);
    });
    this._baseService.getAllCourseType().subscribe(v => {
      this.types = this.types.concat(v);
    });
    this._baseService.getAllCourseLevel().subscribe(v => {
      this.levels = this.levels.concat(v);
    });
    this._baseService.getAllTime().subscribe(v => {

      v = v.map(i => {
        i.schoolTimeTxt = formatTimeArrToZh(i.schoolTime);
        return i;
      });
      this.classTime = this.classTime.concat(v);
    });
    this._baseService.getAllDistributions().subscribe(v => {
      this.distribution = this.distribution.concat(v);
    });
    this._baseService.getAllStages().subscribe(v => {
      this.stages = this.stages.concat(v);
    });
    this.filter();

  }

  // 过滤 + 请求列表
  filter(): void {
    this._classService.getAllClass(Object.assign({}, this.selected, {
      page: this.page,
      size: this.pageSize,
      classCode: this.searchTermCode,
      state: 20,
      classEnding: 0,
    })).subscribe(v => {
      this.filteredData = v.list;
      this.filteredTotal = v.total;
    });
  }
  // 查询一个班级
  search(ev) {
    this.searchTermCode = ev;
    this.filter();
  }

  // 添加班级
  addClass(v) {
    let isT = false;
    this.selectData.forEach(item => {
      if (item.id == v.id) {
        isT = true;
        return;
      }
    });
    if (!isT) {
      this.selectData = this.selectData.concat(v);
    }
  }
  // 移除已选中课程
  remove(v) {
    for (let i = 0; i < this.selectData.length; i++) {
      this.selectData = this.selectData.filter(item => {
        return item.id !== v.id;
      });
    }
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }
}
// 时间转换 上课时间/开课时间
const TIME_FORMAT: (v: any) => any = (v: any) => {
  // return v?moment(v).format('YYYY-MM-DD HH:mm'):'';
  return v ? formatTimeArrToZh(v) : '';
};
export const orderClassColumns: ITdDataTableColumn[] = [
  { name: 'classCode', label: '班级编号 ', },
  { name: 'className', label: '班级名称', },
  { name: 'foreignTeacherName', label: '外教姓名', },
  { name: 'schoolTime', label: '上课时间', format: TIME_FORMAT },
  { name: 'liveCurrentContain', label: '已报人数', },
  { name: 'distributionName', label: '开班到', },
  { name: 'stageName', label: '分期', },
];

