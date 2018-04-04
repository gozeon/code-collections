import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent } from '@covalent/core';
import { MessageService, BaseService } from './../../../services';

@Component({
  selector: 'app-msg-template',
  templateUrl: './msg-template.component.html',
  styleUrls: ['./msg-template.component.scss']
})
export class MsgTemplateComponent implements OnInit {

  columns = SmstemplateColumns;
  list: any[];
  page = 1;
  pageSize = 5;
  total: number; // 总数
  type: number;

  constructor(private _baseService: BaseService, private _messageService: MessageService) {
  }
  // 获取数据 列表 —— 过滤
  getData(parm) {
    this._messageService.getSmsTemplateList(parm).subscribe(v => {
      this.list = v['list'];
      this.total = v['total'];
    });
  }
  ngOnInit() {
    // 请求数据
    this.getData({
      size: this.pageSize,
      page: this.page
    });
  }
  // 选择类型 radio改变
  changeType(ev: any) {
    this.type = Number(ev.value);
    this.page = 1;
    this.getData({
      size: this.pageSize,
      page: this.page,
      type: this.type,
    });
  }
  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.getData({
      size: this.pageSize,
      page: this.page,
      type: this.type,
    });
  }
}

export const SmstemplateColumns: ITdDataTableColumn[] = [
  { name: 'name', label: '名称' },
  { name: 'type', label: '类型', },
  { name: 'code', label: '模板编号' },
  { name: 'content', label: '内容' },
  { name: 'createDate', label: '添加日期' },
  { name: 'style', label: '分类' },
  { name: 'isDelete', label: '是否删除' },
];
