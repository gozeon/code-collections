import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TdDialogService, TdLoadingService } from '@covalent/core';
import { Router } from '@angular/router';
import { BaseService } from '../../../../services/base.service';
import { HomeworkService } from '../../../../services/homework.service';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-add-homework',
  templateUrl: './add-homework.component.html',
  styleUrls: ['./add-homework.component.scss']
})
export class AddHomeworkComponent implements OnInit {
  seasons: any[];
  levels: any[];
  selected = {
    tearmCode: '',
    level: '',
    pubStatus: ''
  };
  file: File;
  name: string;
  remark = '';
  uploading = false;

  @ViewChild('fileInput')
  fileInput: ElementRef;

  constructor(private _dialogService: TdDialogService,
              private _toast: Md2Toast,
              private _route: Router,
              private _baseService: BaseService,
              private _homeworkService: HomeworkService,
              private _loadingService: TdLoadingService) {
    this.initSelect();
  }

  ngOnInit() {
  }

  uploadFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].name.slice(-3) !== 'zip') {
        event.target.value = '';
        this.warn('只支持ZIP格式');
      }
      this.file = event.target.files[0];
    }
  }


  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = v);
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = v);
  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/content/homework']);
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: '警告',
      message: msg,
    });
    return;
  }

  deleteFile(): void {
    this.fileInput.nativeElement.value = '';
    this.file = null;
  }

  onSubmit(): void {
    if (!this.name || !this.file || !this.selected.tearmCode || !this.selected.level) {
      this.warn('信息不完整');
      return;
    }
    const name = JSON.parse(localStorage.getItem('info')).name;
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('level', this.selected.level);
    formData.append('tearmCode', this.selected.tearmCode);
    formData.append('pubStatus', '0');
    formData.append('createUsername', name);
    formData.append('file', this.file);
    // formData.append('pubUsername', +this.selected.pubStatus === 1 ? name : '');
    formData.append('remark', this.remark);
    formData.append('type', '1');

    this._loadingService.register();
    // TODO API
    this._homeworkService.createHomework(formData).subscribe(result => {
      this._loadingService.resolve();
      if (result.code === 200) {
        this.success('创建');
      }
    });
  }
}
