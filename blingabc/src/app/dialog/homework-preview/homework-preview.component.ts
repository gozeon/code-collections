import { Component, Inject, OnInit } from '@angular/core';
import { ITdDataTableColumn, TdLoadingService } from '@covalent/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HomeworkService } from '../../services/homework.service';
import { Md2Toast } from '../../common/toast/toast';
import { ENV } from '../../services/api.config';

@Component({
  selector: 'app-homework-preview',
  templateUrl: './homework-preview.component.html',
  styleUrls: ['./homework-preview.component.scss']
})
export class HomeworkPreviewComponent implements OnInit {
  filteredData: any[] = [];
  columns: ITdDataTableColumn[] = [
    {name: 'seq', label: '序号'},
    {name: 'voiceUrl', label: '音频'},
    {name: 'imgUrl', label: '图片'},
    {name: 'textInfo', label: '文字'},
    {name: 'dub', label: '允许配音', format: value => value ? '是' : '否'},
  ];

  uri: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<HomeworkPreviewComponent>,
              private _homeworkService: HomeworkService,
              private _toast: Md2Toast,
              private _loadingService: TdLoadingService) {
    this.initTable();
    if (ENV === 'dev') {
      this.uri = `
https://i.t.blingabc.com/home/listen-book?homeworkId=${this.data.id}&title=%E9%A2%84%E8%A7%88&classLessonId=27837`;
    } else {
      this.uri = `
https://i.blingabc.com/home/listen-book?homeworkId=${this.data.id}&title=%E9%A2%84%E8%A7%88&classLessonId=27837`;
    }
  }

  ngOnInit() {
  }

  initTable(): void {
    this._homeworkService.getHomeworkContent(this.data.id).subscribe(result => this.filteredData = result);
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
      this._homeworkService.reSetHomeworkContent(this.data.id, formData).subscribe(result => {
        this._loadingService.resolve();
        if (result.code === 200) {
          this._toast.show('上传成功', 1800);
          this.initTable();
        }
      });
    }
  }
}
