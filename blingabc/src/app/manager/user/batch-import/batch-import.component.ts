import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { OrderService, UserService } from './../../../services';
import {
  TdDialogService
} from '@covalent/core';
import { Md2Toast } from '../../../common/toast/index';

@Component({
  selector: 'app-batch-import',
  templateUrl: './batch-import.component.html',
  styleUrls: ['./batch-import.component.scss']
})
export class BatchImportComponent implements OnInit {
  channels1: any[];
  channels2: any[];

  channel1: undefined;
  channel2: undefined;
  file: any;

  constructor(private _orderService: OrderService, private _dialogService: TdDialogService,
    private _userService: UserService, private _toast: Md2Toast, ) { }

  ngOnInit() {
    this._orderService.getchanneList(-1).subscribe(v => this.channels1 = v);
  }

  getChannel2(): void {
    this._orderService.getchanneList(this.channel1).subscribe(v => this.channels2 = v);
  }

  chooseFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.channel1 && this.channel2 && this.file) {
      const channel1 = this.channels1.filter(i => i.id == this.channel1);
      const channel2 = this.channels2.filter(i => i.id == this.channel2);

      const formData = new FormData();
      formData.append('channelCodeOne', channel1[0].code);
      formData.append('channelCodeTwo', channel2[0].code);
      formData.append('file', this.file);

      // TODO API
      this._userService.batchUploadParent(formData).subscribe(result => {
        if (result.code === '10000' && result.msg === 'ok') {
          this._toast.show('添加成功', 1800);
        } else {
          this._toast.show(result.msg, 1800);
        }
      })
    } else {
      this.warn('信息不完整');
    }
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }
}
