import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, ITdDataTableSelectEvent } from '@covalent/core';
import { MessageService } from '../../services/message.service';
import { MatDialogRef } from '@angular/material';
import { Md2Toast } from '../../common/toast/toast';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  selectData;
  filteredData: any[] = [];
  filteredTotal: number;
  fromRow = 1;
  initialPage = 1;
  page = 1;
  pageSize = 5;
  searchItem = '';
  columns: ITdDataTableColumn[] = [
    {name: 'content', label: '发送内容'}
  ];

  params: any = {};
  objectKeys = Object.keys;
  content = '';

  constructor(private _messageService: MessageService,
              public dialogRef: MatDialogRef<SendMessageComponent>,
              private _toast: Md2Toast) {

  }

  ngOnInit() {
    this.filter();
  }

  filter(): void {
    this.reset();

    const data = Object.assign({}, {
      page: this.page,
      size: this.pageSize,
      content: this.searchItem,
      style: 1
    });

    this._messageService.getSmsTemplateList(data).subscribe(result => {
      this.filteredData = result.list;
      this.filteredTotal = result.total;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {
    // NOTE 目前不支持跨页选择
    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  searchContent(content: string): void {
    this.searchItem = content;

    this.filter();
  }

  selectEvent(v: ITdDataTableSelectEvent): void {
    if (v.selected) {
      this.selectData = v.row;
      this.params = this.selectData.params.split(',').reduce(function (allNames, name) {
        allNames[name] = '';
        return allNames;
      }, {});
      this.content = this.selectData.content;
    } else {
      this.reset();
    }
  }

  reset(): void {
    this.selectData = undefined;
    this.params = {};
    this.content = '';
  }

  onChange(): void {
    let tmp = this.selectData.content;
    Object.keys(this.params).forEach(item => {
      const rgx = new RegExp(`(#|{{)${item}(#|}})`, 'g');
      tmp = tmp.replace(rgx, this.params[item]);
    });

    this.content = tmp;
  }

  onSubmit(): void {
    const data = Object.assign({}, {
      stlCode: this.selectData.code,
      mobile: JSON.parse(localStorage.getItem('userInfo')).mobile,
      params: this.params
    });

    // TODO API
    this._messageService.sendMessageSingle(data).subscribe(result => {
      if (result.code === 200) {
        this._toast.show('发送成功', 1800);
        this.dialogRef.close();
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }
}
