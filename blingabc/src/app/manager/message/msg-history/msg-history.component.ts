
import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent } from '@covalent/core';
import { MessageService, BaseService } from './../../../services';

@Component({
  selector: 'app-msg-history',
  templateUrl: './msg-history.component.html',
  styleUrls: ['./msg-history.component.scss']
})
export class MsgHistoryComponent implements OnInit {

  columns = historyColumns;
  list: any[];
  page: number = 1;
  pageSize: number = 5;
  total: number;//总数
  templateType: number;

  constructor(private _baseService: BaseService, private _messageService: MessageService) {

  }

  // 获取数据 列表 —— 过滤
  getData(parm) {
    this._messageService.getSmstemplatehistory(parm).subscribe(v => {
      this.list = v['list'];
      this.total = v['total'];
    });
  }


  ngOnInit() {
    // 请求数据
    this.getData({
      pageSize: this.pageSize,
      pageNum: this.page
    })
  }

  // 选择类型 radio改变
  changeType(ev: any) {
    this.templateType = Number(ev.value);
    this.page = 1;
    this.getData({
      pageSize: this.pageSize,
      pageNum: this.page,
      templateType: this.templateType,
    })
  }
  // 分页
  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;
    this.getData({
      pageSize: this.pageSize,
      pageNum: this.page,
      templateType: this.templateType,
    })
  }


}
export const historyColumns: ITdDataTableColumn[] = [
  { name: 'templateType', label: '类型', },
  { name: 'templateCode', label: '模板编码' },
  { name: 'content', label: '内容' },
  { name: 'mobile', label: '发送用户数' },
  { name: 'createDate', label: '添加日期' },
  { name: 'sendTime', label: '发送次数' },
  { name: 'sendRet', label: '发送状态' },
  { name: 'isDelete', label: '是否删除' },
];
