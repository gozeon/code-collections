import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import { ConferenceService } from '../../../services/conference.service';
import { verifyMiddleWare } from '../../../services/base.service';
import { Md2Toast } from '../../../common/toast/toast';

export interface ConferenceGrabConfig {
  name: string;
  no: string;
  state: boolean | number;
  id?: string;
}

@Component({
  selector: 'app-conference-grab-config',
  templateUrl: './conference-grab-config.component.html',
  styleUrls: ['./conference-grab-config.component.scss']
})
export class ConferenceGrabConfigComponent implements OnInit {
  name;
  no;

  columns: ITdDataTableColumn[] = [
    {name: 'id', label: ''},
    {name: 'name', label: '发布会名称'},
    {name: 'state', label: '启用状态', format: (value) => ['关闭', '开启'][value]},
    {name: 'no', label: '编号'},
  ];
  filteredData: any[] = [];

  conferenceGrabConfig: ConferenceGrabConfig = {
    name: '',
    no: '',
    state: 1
  };

  isUpdate = false;

  constructor(private _conferenceService: ConferenceService,
              private _toast: Md2Toast) {

  }

  ngOnInit() {
    this.initTable();
  }


  initTable(): void {
    this._conferenceService.getAllConferenceWithGrab().subscribe(result => {
      this.filteredData = result.filter(item => {
        item.id = item.no;
        item.state = +item.state;
        return item;
      });
    });
  }

  showWpdate(row: ConferenceGrabConfig): void {
    this.conferenceGrabConfig = row;
    this.isUpdate = true;
  }

  add(): void {
    this._conferenceService.addConferenceWithGrab({
      name: this.name,
      no: this.no
    }).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.initTable();
        this._toast.show('添加成功', 1800);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }

  update(): void {
    const data = Object.assign({}, this.conferenceGrabConfig, {
      state: this.conferenceGrabConfig.state ? 1 : 0,
    });
    delete data.id;
    this._conferenceService.updateConferenceWithGrab(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.initTable();
        this.close();
        this._toast.show('修改成功', 1800);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }

  delete(id): void {
    this._conferenceService.deleteConferenceWithGrab(id).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this.initTable();
        this.close();
        this._toast.show('删除成功', 1800);
      } else {
        this._toast.show(result.msg, 1800);
      }
    });
  }
  close(): void {
    this.isUpdate = false;
  }
}
