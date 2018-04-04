import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TdDialogService, TdLoadingService } from '@covalent/core';
import { Router } from '@angular/router';
import { BaseService } from '../../../../services/base.service';
import { PrepService } from '../../../../services/prep.service';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-update-prep',
  templateUrl: './update-prep.component.html',
  styleUrls: ['./update-prep.component.scss']
})
export class UpdatePrepComponent implements OnInit, OnDestroy {
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
              private _prepService: PrepService,
              private _loadingService: TdLoadingService) {
    this.initSelect();
  }

  ngOnInit() {
    if (localStorage.getItem('prep') === null) {
      this._route.navigate(['/main/content/prep']);
    }
    this.initPage();
  }

  ngOnDestroy() {
    if (localStorage.getItem('prep') !== null) {
      localStorage.removeItem('prep');
    }
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

  initPage(): void {
    const prep = JSON.parse(localStorage.getItem('prep'));
    this.name = prep.name;
    this.remark = prep.remark;
    this.selected = {
      tearmCode: prep.tearmCode,
      level: prep.level,
      pubStatus: prep.pubStatus
    };

  }

  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = v);
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = v);
  }

  success(str: string): void {
    this._toast.show(`${str}成功`, 1800);
    this._route.navigate(['/main/content/prep']);
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
    formData.append('remark', this.remark);
    formData.append('id', JSON.parse(localStorage.getItem('prep')).id);

    if (this.file) {
      formData.append('file', this.file);
    }

    // TODO API
    this._loadingService.register();
    this._prepService.updatePreview(formData).subscribe(result => {
      this._loadingService.resolve();
      if (result.code === 200) {
        this.success('修改');
      }
    });
  }
}
