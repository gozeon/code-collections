import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TdDialogService, TdLoadingService } from '@covalent/core';
import { Router } from '@angular/router';
import { BaseService } from '../../../../services/base.service';
import { HomeworkService } from '../../../../services/homework.service';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-update-homework',
  templateUrl: './update-homework.component.html',
  styleUrls: ['./update-homework.component.scss']
})
export class UpdateHomeworkComponent implements OnInit, OnDestroy {
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
    if (localStorage.getItem('homework') === null) {
      this._route.navigate(['/main/content/homework']);
    }
    this.initPage();
  }

  ngOnDestroy() {
    if (localStorage.getItem('homework') !== null) {
      localStorage.removeItem('homework');
    }
  }

  initPage(): void {
    const prep = JSON.parse(localStorage.getItem('homework'));
    this.name = prep.name;
    this.remark = prep.remark;
    this.selected = {
      tearmCode: prep.tearmCode,
      level: prep.level,
      pubStatus: prep.pubStatus
    };

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
    if (!this.name || !this.selected.tearmCode || !this.selected.level) {
      this.warn('信息不完整');
      return;
    }

    const name = JSON.parse(localStorage.getItem('info')).name;
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('level', this.selected.level);
    formData.append('tearmCode', this.selected.tearmCode);
    formData.append('pubStatus', this.selected.pubStatus);
    formData.append('id', JSON.parse(localStorage.getItem('homework')).id);
    // formData.append('createUsername', name);
    // formData.append('pubUsername', +this.selected.pubStatus === 1 ? name : '');
    formData.append('remark', this.remark);
    formData.append('type', '1');
    if (this.file) {
      formData.append('file', this.file);
    }

    this._loadingService.register();
    // TODO API
    this._homeworkService.updateHomework(formData).subscribe(result => {
      this._loadingService.resolve();
      if (result.code === 200) {
        this.success('修改');
      }
    });
  }
}
