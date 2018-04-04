import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PrepService } from '../../services/prep.service';
import { ITdDataTableColumn, TdLoadingService } from '@covalent/core';
import { formatFileType } from '../../manager/content/utils';
import { Md2Toast } from '../../common/toast/toast';
import { ENV } from '../../services/api.config';

@Component({
  selector: 'app-prep-preview',
  templateUrl: './prep-preview.component.html',
  styleUrls: ['./prep-preview.component.scss']
})
export class PrepPreviewComponent implements OnInit {
  @ViewChild('file') file: ElementRef;

  filteredData: any[] = [];
  columns: ITdDataTableColumn[] = [
    {name: 'seq', label: '序号'},
    {name: 'type', label: '消息格式', format: value => formatFileType(value)},
    {name: 'content', label: '消息内容'},
    {name: 'duration', label: '语音时间', format: value => value + 's'},
    {name: 'delay', label: '间隔时间', format: value => value + 's'},
  ];

  uri: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<PrepPreviewComponent>,
              private _prepService: PrepService,
              private _toast: Md2Toast,
              private _loadingService: TdLoadingService) {
    this.initTable();
    if (ENV === 'dev') {
      this.uri = `
https://i.t.blingabc.com/home/picturebookInteraction/27754/${this.data.id}?lessonNum=1&classLessonName=%E9%A2%84%E8%A7%88`;
    } else {
      this.uri = `
https://i.blingabc.com/home/picturebookInteraction/27754/${this.data.id}?lessonNum=1&classLessonName=%E9%A2%84%E8%A7%88`;
    }
  }

  ngOnInit() {
  }

  initTable(): void {
    this._prepService.getPrepContent(this.data.id).subscribe(result => this.filteredData = result);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].name.slice(-3) !== 'zip') {
        event.target.value = '';
        this._toast.show('只支持ZIP格式', 1800);
        return;
      }
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      // TODO API
      this._loadingService.register();
      this._prepService.reSetPrepContent(this.data.id, formData).subscribe(result => {
        this._loadingService.resolve();
        if (result.code === 200) {
          this._toast.show('上传成功', 1800);
          this.initTable();
        }
      });
    }
  }
}
